const CREDIT_LANES = new Set(["CREDIT_RISK", "BUSINESS_BUSTOUT"]);

export const CREDIT_OUTCOMES = {
  CREDIT_RISK: [
    "Support credit request",
    "Do not support credit request",
    "More information needed",
    "Maintain account",
    "Reduce exposure",
    "Refer to collections or hardship",
    "Refer to fraud review",
    "Escalate senior review"
  ],
  BUSINESS_BUSTOUT: [
    "Support business credit request",
    "Do not support business credit request",
    "More information needed",
    "Reduce exposure",
    "Hold pending KYB / UBO review",
    "Refer to fraud review",
    "Escalate senior review"
  ]
};

const CREDIT_OUTCOME_GUIDE = {
  CREDIT_RISK: [
    {
      label: "Support credit request",
      useWhen: "Identity, repayment capacity, cash flow, and product behavior support the requested exposure."
    },
    {
      label: "Do not support credit request",
      useWhen: "The file is complete enough to support an adverse credit decision with specific, defensible reasons."
    },
    {
      label: "More information needed",
      useWhen: "The application or review still has missing documents, unclear income, or unresolved ownership evidence."
    },
    {
      label: "Maintain account",
      useWhen: "Existing account behavior supports keeping the current line, terms, or exposure unchanged."
    },
    {
      label: "Reduce exposure",
      useWhen: "Current behavior, utilization, payment stress, or cash-flow change supports a safer lower exposure."
    },
    {
      label: "Refer to collections or hardship",
      useWhen: "Repayment distress appears genuine and needs a non-fraud servicing path."
    },
    {
      label: "Refer to fraud review",
      useWhen: "Identity, application, document, or misuse evidence dominates the credit question."
    },
    {
      label: "Escalate senior review",
      useWhen: "Material exposure, policy exception, or uncertainty needs a second-level credit decision."
    }
  ],
  BUSINESS_BUSTOUT: [
    {
      label: "Support business credit request",
      useWhen: "Entity legitimacy, owner control, revenue, and repayment capacity support the request."
    },
    {
      label: "Do not support business credit request",
      useWhen: "The file supports a business-credit adverse decision with specific entity, revenue, or exposure reasons."
    },
    {
      label: "More information needed",
      useWhen: "Business registration, UBO, revenue, bank, invoice, or tax evidence is incomplete."
    },
    {
      label: "Reduce exposure",
      useWhen: "Post-book behavior, rapid draws, repayment stress, or line-change risk supports lower exposure."
    },
    {
      label: "Hold pending KYB / UBO review",
      useWhen: "Ownership, control, beneficial-owner, or legal-entity evidence must be resolved before action."
    },
    {
      label: "Refer to fraud review",
      useWhen: "Business identity, owner identity, misuse, or coordinated abuse signals dominate the credit question."
    },
    {
      label: "Escalate senior review",
      useWhen: "Material exposure, policy exception, or mixed credit/fraud evidence needs senior review."
    }
  ]
};

const CREDIT_REASON_STARTERS = {
  CREDIT_RISK: [
    "Income or cash-flow support is still being reviewed.",
    "Debt-to-income, utilization, and payment trend need a specific explanation before adverse action.",
    "Identity, application, and bank ownership evidence must stay separate from any fraud referral."
  ],
  BUSINESS_BUSTOUT: [
    "Business legitimacy, UBO / owner control, and revenue evidence are still being reviewed.",
    "Rapid utilization, credit-line changes, or repayment stress need a business-credit explanation.",
    "Fraud referral language should only appear if identity, KYB, or misuse evidence supports that path."
  ]
};

const REQUIRED_EVIDENCE_BY_LANE = {
  CREDIT_RISK: ["Identity and application data", "Income verification", "Credit report summary", "Cash flow review", "Bank ownership", "Payment / utilization history"],
  BUSINESS_BUSTOUT: ["KYB review", "Business registration", "Owner KYC / UBO", "Revenue and cash flow", "Bank statements", "Credit exposure history"]
};

const CASE_FAMILY_BY_LANE = {
  CREDIT_RISK: "Consumer application or existing-account credit review",
  BUSINESS_BUSTOUT: "Business credit / bust-out review"
};

const DECISION_QUESTION_BY_LANE = {
  CREDIT_RISK: "Can this person safely receive, keep, or continue to use the requested credit exposure?",
  BUSINESS_BUSTOUT: "Does this business, its owners, revenue, and repayment behavior still support the requested exposure?"
};

export function isCreditDecisionRailCase(activeCaseOrLane) {
  const lane = laneOf(activeCaseOrLane);
  return Boolean(lane && CREDIT_LANES.has(lane));
}

export function getCreditDeterminationOptions(activeCaseOrLane) {
  const lane = laneOf(activeCaseOrLane);
  return CREDIT_OUTCOMES[lane] || [];
}

export function getCreditOutcomeGuide(activeCaseOrLane) {
  const lane = laneOf(activeCaseOrLane);
  return CREDIT_OUTCOME_GUIDE[lane] || [];
}

export function buildCreditDecisionRail(activeCase) {
  if (!isCreditDecisionRailCase(activeCase)) return null;

  const expectedEvidence = unique([
    ...(activeCase.expectedEvidenceCategories || []),
    ...(REQUIRED_EVIDENCE_BY_LANE[activeCase.lane] || [])
  ]);
  const documentNames = flattenDocumentNames(activeCase.documents);
  const completedEvidence = expectedEvidence.filter((item) => hasLooseMatch(documentNames, item));
  const missingEvidence = expectedEvidence.filter((item) => !completedEvidence.includes(item)).slice(0, 5);
  const documentCount = documentNames.length;
  const completedCount = Math.min(completedEvidence.length, expectedEvidence.length);
  const evidenceProgress = expectedEvidence.length ? Math.round((completedCount / expectedEvidence.length) * 100) : 0;
  const outcomes = getCreditDeterminationOptions(activeCase);

  return {
    title: activeCase.lane === "BUSINESS_BUSTOUT" ? "Business Credit Decision Rail" : "Credit Decision Rail",
    caseId: activeCase.id,
    lane: activeCase.lane,
    subtype: activeCase.subtype,
    caseFamily: CASE_FAMILY_BY_LANE[activeCase.lane],
    decisionQuestion: DECISION_QUESTION_BY_LANE[activeCase.lane],
    applicationStatus: statusFor(activeCase, missingEvidence),
    sla: buildSlaLabel(activeCase),
    completedDocs: `${documentCount} fictional document${documentCount === 1 ? "" : "s"} in Evidence Center`,
    completedEvidence,
    missingDocs: missingEvidence.length ? missingEvidence : ["No missing evidence calculated from the current packet."],
    expectedEvidenceCount: expectedEvidence.length,
    completedEvidenceCount: completedCount,
    evidenceProgress,
    evidenceStatusLabel: evidenceStatusFor(evidenceProgress, missingEvidence),
    reasonCodeDrafts: CREDIT_REASON_STARTERS[activeCase.lane] || CREDIT_REASON_STARTERS.CREDIT_RISK,
    reasonNarrativePrompt: narrativePromptFor(activeCase, missingEvidence),
    outcomes,
    outcomeGuide: getCreditOutcomeGuide(activeCase),
    guardrails: [
      "Do not use pay / deny claim reimbursement wording in credit cases.",
      "Require specific reason codes before any adverse-action-style decision.",
      "Use identity or fraud signals as evidence only until the learner chooses a determination.",
      "Keep customer and business records fictional, masked, and training-safe."
    ]
  };
}

function flattenDocumentNames(documents = {}) {
  return unique(Object.values(documents || {}).flat().filter(Boolean));
}

function hasLooseMatch(documentNames, evidenceName) {
  const evidenceTokens = tokenize(evidenceName);
  if (!evidenceTokens.length) return false;

  return documentNames.some((doc) => {
    const docTokens = tokenize(doc);
    return evidenceTokens.some((token) => docTokens.includes(token));
  });
}

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3 && !["review", "data", "history", "summary", "evidence"].includes(token));
}

function statusFor(activeCase, missingEvidence) {
  if (missingEvidence.length >= 3) return "Pending docs / review";
  if (String(activeCase.priority || "").toLowerCase() === "critical") return "Senior review recommended";
  return "Evidence review in progress";
}

function evidenceStatusFor(evidenceProgress, missingEvidence) {
  if (missingEvidence.length >= 3) return "Evidence packet incomplete";
  if (evidenceProgress >= 75) return "Decision narrative can be drafted after review";
  return "Evidence mapping in progress";
}

function buildSlaLabel(activeCase) {
  const reported = activeCase.reportedDate || activeCase.issueStart || "Training date pending";
  if (activeCase.lane === "BUSINESS_BUSTOUT") return `${reported} · entity and exposure review clock visible`;
  return `${reported} · credit notice / document clock visible`;
}

function narrativePromptFor(activeCase, missingEvidence) {
  const missingText = missingEvidence.length ? `Address missing items: ${missingEvidence.join(", ")}.` : "Confirm the file has enough support for the selected credit outcome.";

  if (activeCase.lane === "BUSINESS_BUSTOUT") {
    return `${missingText} Explain entity legitimacy, owner / UBO control, revenue support, exposure trend, and why the selected business-credit action fits.`;
  }

  return `${missingText} Explain identity, income or cash-flow, credit file, bank ownership, utilization or repayment pattern, and why the selected credit action fits.`;
}

function laneOf(activeCaseOrLane) {
  return typeof activeCaseOrLane === "string" ? activeCaseOrLane : activeCaseOrLane?.lane;
}

function unique(list = []) {
  return [...new Set(list.filter(Boolean).map((item) => String(item)))];
}
