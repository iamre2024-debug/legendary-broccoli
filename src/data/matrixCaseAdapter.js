import { CLAIM_FAMILIES, generateCase as generateLegacyCase, toolNavByLane } from "./fraudAcademyEngine";
import { buildCustomerProfileSpine, profileRowsForTool } from "./customerProfileSpine";
import { fullHistoryRowsForTool } from "./customerToolHistory";
import { attachProfileSearchDirectory } from "./profileSearchDirectory";
import { toolIoRowsForTool } from "./toolIoContracts";
import { buildScenarioProvenance, getScenarioForLane, MATRIX_SCENARIO_VERSION } from "./matrixScenarioRegistry";
import { resolveToolDefinition } from "./toolRegistry";

const TRAINING_GUARDRAIL = "Final determination and senior reasoning stay hidden until the learner completes determination and justification.";

export function generateMatrixCase(lane = "RANDOM", seed = Date.now()) {
  const scenario = getScenarioForLane(lane, seed);
  const baseCase = generateLegacyCase(scenario.lane);
  const customerProfile = attachProfileSearchDirectory(buildCustomerProfileSpine(scenario, baseCase), scenario);
  const toolkitTools = uniqueList(scenario.toolkitTools || []);
  const suggestedTools = toolkitTools.map((toolId) => toolLabelFor(scenario.lane, toolId));
  const provenance = buildScenarioProvenance(scenario);

  return {
    ...baseCase,
    lane: scenario.lane,
    title: scenario.claimFamily || CLAIM_FAMILIES[scenario.lane] || baseCase.title,
    subtype: scenario.subtype,
    summary: buildMatrixSummary(scenario, baseCase.exposure),
    statement: buildMatrixStatement(scenario, baseCase.statement),
    profile: customerProfile,
    intakeQuestions: scenario.intakeQuestions?.length ? scenario.intakeQuestions : baseCase.intakeQuestions,
    intakeAnswers: buildNeutralIntakeAnswers(scenario, baseCase),
    suggestedTools,
    documents: mergeDocumentBuckets(baseCase.documents, scenario.documents, customerProfile),
    timeline: buildNeutralTimeline(scenario, baseCase, customerProfile),
    tools: enrichScenarioTools(baseCase.tools, scenario, baseCase, toolkitTools, customerProfile),
    expectedEvidenceCategories: scenario.expectedEvidence || [],
    taxonomyTags: scenario.taxonomyTags || {},
    scenarioId: scenario.scenarioId,
    scenarioVersion: MATRIX_SCENARIO_VERSION,
    scenarioProvenance: provenance,
    caseBriefing: {
      caseSummary: scenario.plainEnglishMeaning,
      howItHappens: scenario.howItHappens,
      startingTools: suggestedTools,
      evidenceToReview: scenario.expectedEvidence || [],
      documentPacket: scenario.documents || {},
      trainingGuardrail: TRAINING_GUARDRAIL
    },
    matrixTrainingNotes: {
      commonMistake: scenario.commonMistake,
      miniExample: scenario.miniExample,
      hiddenDebriefLogic: "Stored for post-decision coaching only."
    }
  };
}

export function validateMatrixCaseAdapter(lane = "ATO") {
  const sample = generateMatrixCase(lane, 7);
  const missing = [];

  ["scenarioId", "scenarioVersion", "scenarioProvenance", "taxonomyTags", "expectedEvidenceCategories", "caseBriefing"].forEach((field) => {
    if (!(field in sample)) missing.push(field);
  });

  if (!sample.expectedEvidenceCategories?.length) missing.push("expectedEvidenceCategories:empty");
  if (!sample.suggestedTools?.length) missing.push("suggestedTools:empty");
  if (!sample.profile?.lookupKeys?.trainingFullSsnOrEin) missing.push("profile.lookupKeys:missing");
  if (!sample.profile?.loginSessions?.length) missing.push("profile.loginSessions:empty");
  if (["PAYROLL", "BEC", "BUSINESS_BUSTOUT"].includes(sample.lane) && !sample.profile?.employeeDirectory?.length) missing.push("profile.employeeDirectory:empty");
  if (!sample.profile?.bankAccounts?.length) missing.push("profile.bankAccounts:empty");

  return {
    version: MATRIX_SCENARIO_VERSION,
    readyForGeneratorAdapter: missing.length === 0,
    sampleCaseId: sample.id,
    sampleScenarioId: sample.scenarioId,
    sampleCustomerId: sample.profile?.customerId,
    lane: sample.lane,
    missing
  };
}

function enrichScenarioTools(baseTools = {}, scenario, baseCase, toolkitTools, customerProfile) {
  const enrichedTools = { ...baseTools };

  toolkitTools.forEach((toolId) => {
    const definition = resolveToolDefinition(toolId);
    const currentTool = enrichedTools[toolId] || {};
    const baseRows = Array.isArray(currentTool.rows) ? currentTool.rows : [];
    const baseTimeline = Array.isArray(currentTool.timeline) ? currentTool.timeline : [];
    const scenarioDocs = flattenDocuments(scenario.documents);
    const profileRows = fullHistoryRowsForTool(toolId, customerProfile, profileRowsForTool(toolId, customerProfile));
    const ioRows = toolIoRowsForTool(toolId);

    enrichedTools[toolId] = {
      ...currentTool,
      title: currentTool.title || definition.title,
      summary: `${currentTool.summary || definition.evidenceRole} Matrix context: ${scenario.plainEnglishMeaning}`,
      rows: [
        ...ioRows,
        ...baseRows,
        ...profileRows,
        row("Scenario source", `${scenario.scenarioId} · ${scenario.difficulty}`, "neutral"),
        row("Evidence category", (scenario.expectedEvidence || []).join(", ") || "Needs review", "neutral"),
        row("Claim lane fit", scenario.claimFamily, "good"),
        row("Training guardrail", "Evidence only, no final verdict", "good")
      ],
      timeline: enrichToolTimeline(baseTimeline, scenario, baseCase, customerProfile, toolId),
      riskSignals: uniqueList([
        ...(currentTool.riskSignals || []),
        `Needs review: ${definition.title} evidence should be compared against the ${scenario.claimFamily} story.`,
        `Customer 360 comparison: ${customerProfile.customerId} baseline, profile changes, login sessions, and lookup keys should be used as context only.`,
        `Input/output check: ${definition.title} should use its expected input and produce its expected output without revealing the final determination.`,
        `Search directory check: use employee, bank, device, IP, or identity keys only when they belong to this fictional profile packet.`,
        `Evidence gap check: ${firstOrFallback(scenario.expectedEvidence, "lane-specific evidence")} must be documented before determination.`,
        `Sequence check: ${(scenario.timelinePattern || []).slice(0, 3).join(" → ") || "timeline not provided"}.`
      ]),
      relatedDocuments: uniqueList([...(currentTool.relatedDocuments || []), ...scenarioDocs, ...profileDocumentNames(customerProfile), `${definition.title} Report`, "Case timeline", "Investigation summary"]),
      nextActions: uniqueList([
        ...(currentTool.nextActions || []),
        `Confirm the ${definition.title} input matches the active lane and Customer 360 profile before relying on the output.`,
        `Search ${definition.title} for repeated values, first-seen records, timing gaps, or ownership mismatches.`,
        "Compare the result with Customer 360 baseline and any related report sections.",
        "Write the open question in Investigation Summary before moving to indicators."
      ]),
      reportTitle: currentTool.reportTitle || `${definition.title} · ${scenario.claimFamily} Report`,
      reportSections: currentTool.reportSections || [
        {
          title: "Tool input / output contract",
          items: ioRows.map((item) => `${item.k}: ${item.v}`)
        },
        {
          title: "Search directory / lookup keys",
          items: searchDirectoryItems(customerProfile)
        },
        {
          title: "Matrix scenario context",
          items: [scenario.plainEnglishMeaning, scenario.howItHappens, `Scenario ID: ${scenario.scenarioId}`]
        },
        {
          title: "Customer 360 lookup spine",
          items: reportSeedItems(customerProfile)
        },
        {
          title: "Evidence to compare",
          items: (scenario.expectedEvidence || []).map((item) => `Review ${item} evidence without treating it as a final answer.`)
        },
        {
          title: "Training guardrail",
          items: [scenario.commonMistake, TRAINING_GUARDRAIL, "Use fictional/masked records only."]
        }
      ],
      trainingTip: currentTool.trainingTip || `Use this ${definition.title} snapshot to support or challenge the case story. Do not decide from one tool alone.`
    };
  });

  return enrichedTools;
}

function buildMatrixSummary(scenario, exposure) {
  const amountText = exposure && exposure !== "$0.00" ? ` Exposure is ${exposure}.` : "";
  return `${scenario.plainEnglishMeaning} ${scenario.howItHappens}${amountText} Review the lane-specific evidence before choosing a determination.`;
}

function buildMatrixStatement(scenario, fallbackStatement) {
  const question = firstOrFallback(scenario.intakeQuestions, "Can you review what happened?");
  return fallbackStatement || `${question} I can provide more information through the secure training channel.`;
}

function buildNeutralIntakeAnswers(scenario, baseCase) {
  const baseAnswers = baseCase.intakeAnswers || {};
  const generatedAnswers = Object.fromEntries((scenario.intakeQuestions || []).slice(0, 5).map((question, index) => [
    question,
    neutralAnswerFor(question, scenario, index)
  ]));

  return { ...generatedAnswers, ...baseAnswers };
}

function neutralAnswerFor(question, scenario, index) {
  const lower = String(question).toLowerCase();
  if (lower.includes("callback")) return "Pending trusted-source verification";
  if (lower.includes("document") || lower.includes("proof")) return "Some documents are available; missing items remain open";
  if (lower.includes("bank") || lower.includes("destination")) return "Prior use and owner match need review";
  if (lower.includes("device") || lower.includes("ip")) return "Baseline comparison required";
  if (lower.includes("amount") || lower.includes("income") || lower.includes("revenue")) return "Claimed value must be compared to supporting records";
  return index === 0 ? scenario.plainEnglishMeaning : "Needs review in the appropriate tool";
}

function buildNeutralTimeline(scenario, baseCase, customerProfile) {
  const pattern = scenario.timelinePattern || [];
  if (!pattern.length) return baseCase.timeline || [];

  const profileEvents = (customerProfile.profileChanges || []).slice(0, 1).map((event) => [
    event.time || "Profile event",
    `${event.event} recorded in Customer 360 for ${scenario.claimFamily}. Evidence only, no final conclusion.`
  ]);

  return [
    ...pattern.map((event, index) => [
      index === 0 ? baseCase.issueStart : `Step ${index + 1}`,
      `${event} recorded for ${scenario.claimFamily}. Evidence only, no final conclusion.`
    ]),
    ...profileEvents
  ];
}

function enrichToolTimeline(baseTimeline, scenario, baseCase, customerProfile, toolId) {
  const generated = buildNeutralTimeline(scenario, baseCase, customerProfile);
  const sessionEvents = toolId === "login"
    ? (customerProfile.loginSessions || []).map((session) => [session.time, `${session.eventText}. Evidence only, compare to baseline.`])
    : [];
  return uniqueTimeline(baseTimeline.length ? [...baseTimeline, ...sessionEvents] : [...sessionEvents, ...generated]);
}

function mergeDocumentBuckets(baseDocuments = {}, scenarioDocuments = {}, customerProfile = {}) {
  const merged = { ...baseDocuments };

  Object.entries(scenarioDocuments || {}).forEach(([bucket, docs]) => {
    merged[bucket] = uniqueList([...(merged[bucket] || []), ...(docs || [])]);
  });

  merged["Customer 360 / Lookup Records"] = uniqueList([
    ...(merged["Customer 360 / Lookup Records"] || []),
    "Customer 360 dossier",
    "Fictional profile lookup trail",
    "Employee directory lookup packet",
    "Employee prior/requested bank comparison",
    "Login/IP/device baseline comparison",
    ...(customerProfile.backgroundReportOutline || [])
  ]);

  return merged;
}

function flattenDocuments(documents = {}) {
  return uniqueList(Object.values(documents || {}).flat().filter(Boolean));
}

function profileDocumentNames(customerProfile = {}) {
  return uniqueList(["Customer 360 dossier", "Profile change event log", "Login/IP/device lookup trail", "Employee directory lookup packet", "Employee bank comparison packet", ...(customerProfile.backgroundReportOutline || [])]);
}

function reportSeedItems(customerProfile = {}) {
  const seeds = customerProfile.reportSeeds || [];
  const directorySeeds = customerProfile.searchDirectoryReportSeeds || [];
  if (!seeds.length && !directorySeeds.length) return ["Customer profile lookup seeds pending."];
  return [...seeds.map((seed) => `${seed.label}: ${seed.value}. ${seed.use}`), ...directorySeeds];
}

function searchDirectoryItems(customerProfile = {}) {
  const entities = customerProfile.searchableEntities || [];
  if (!entities.length) return ["Search directory has no employee/vendor-specific records for this lane. Use Customer 360 lookup keys only."];
  return entities.slice(0, 10).map((entity) => `${entity.type}: ${entity.value}. ${entity.use}`);
}

function uniqueTimeline(events = []) {
  const seen = new Set();
  return events.filter((event) => {
    const key = Array.isArray(event) ? event.join("|") : String(event);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toolLabelFor(lane, toolId) {
  const navTool = (toolNavByLane[lane] || []).find((tool) => tool.id === toolId);
  return navTool?.label || resolveToolDefinition(toolId).title;
}

function row(k, v, flag = "neutral") {
  return { k, v, flag };
}

function firstOrFallback(list = [], fallback = "evidence") {
  return Array.isArray(list) && list.length ? list[0] : fallback;
}

function uniqueList(list = []) {
  return [...new Set((list || []).filter(Boolean).map((item) => String(item)))];
}
