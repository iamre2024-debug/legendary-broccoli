const CREDIT_LANES = new Set(["CREDIT_RISK", "BUSINESS_BUSTOUT"]);

const CREDIT_OUTCOMES = {
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

export function isCreditDecisionRailCase(activeCase) {
  return Boolean(activeCase && CREDIT_LANES.has(activeCase.lane));
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

  return {
    title: activeCase.lane === "BUSINESS_BUSTOUT" ? "Business Credit Decision Rail" : "Credit Decision Rail",
    caseId: activeCase.id,
    lane: activeCase.lane,
    subtype: activeCase.subtype,
    applicationStatus: statusFor(activeCase, missingEvidence),
    sla: buildSlaLabel(activeCase),
    completedDocs: `${documentCount} fictional document${documentCount === 1 ? "" : "s"} in Evidence Center`,
    missingDocs: missingEvidence.length ? missingEvidence : ["No missing evidence calculated from the current packet."],
    evidenceProgress: expectedEvidence.length ? Math.round((completedCount / expectedEvidence.length) * 100) : 0,
    reasonCodeDrafts: CREDIT_REASON_STARTERS[activeCase.lane] || CREDIT_REASON_STARTERS.CREDIT_RISK,
    outcomes: CREDIT_OUTCOMES[activeCase.lane] || CREDIT_OUTCOMES.CREDIT_RISK,
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

function buildSlaLabel(activeCase) {
  const reported = activeCase.reportedDate || activeCase.issueStart || "Training date pending";
  if (activeCase.lane === "BUSINESS_BUSTOUT") return `${reported} · entity and exposure review clock visible`;
  return `${reported} · credit notice / document clock visible`;
}

function unique(list = []) {
  return [...new Set(list.filter(Boolean).map((item) => String(item)))];
}
