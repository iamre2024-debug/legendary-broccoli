import { toolNavByLane } from "./fraudAcademyEngine";

export const TOOL_CATEGORIES = {
  timeline: {
    label: "Timeline",
    lens: "Chronological event sequence",
    template: "TimelineToolTemplate"
  },
  identity: {
    label: "Identity / Verification",
    lens: "Identity, ownership, match, and dossier checks",
    template: "IdentityToolTemplate"
  },
  financial: {
    label: "Financial / Metrics",
    lens: "Money movement, cash flow, credit, and account behavior",
    template: "FinancialToolTemplate"
  },
  technical: {
    label: "Technical / Network",
    lens: "Device, IP, header, domain, and session environment",
    template: "TechnicalToolTemplate"
  },
  narrative: {
    label: "Narrative / Communication",
    lens: "Statements, merchant/vendor evidence, contact notes, and policies",
    template: "NarrativeToolTemplate"
  }
};

const SNAPSHOT_ONLY = "snapshot";
const REPORT_ELIGIBLE = "report-eligible";

export const toolRegistry = {
  login: registryTool("login", "Login History", "timeline", "Compares login timing, location, success/failure path, and access sequence."),
  session: registryTool("session", "Session History", "timeline", "Shows session events and the order of account actions."),
  device: registryTool("device", "Device Intelligence", "technical", "Compares trusted behavior against first-seen or unusual devices."),
  ip: registryTool("ip", "IP Intelligence", "technical", "Reviews fictional IP, geolocation, proxy/VPN, and normal-location fit."),
  mfa: registryTool("mfa", "MFA History", "timeline", "Shows OTP, push, enrollment, approval, and MFA change events."),
  financial: registryTool("financial", "Financial Investigation", "financial", "Answers whether the money behavior fits the claim lane."),
  identity: registryTool("identity", "Identity Intel / People Search", "identity", "Supports SSN-style, background, contact, and identity consistency checks.", REPORT_ELIGIBLE),
  link: registryTool("link", "Link Analysis", "identity", "Maps relationships between customer, device, IP, destination, merchant, and business."),
  transaction: registryTool("transaction", "Transaction Details", "timeline", "Shows posted activity, channel, descriptor, amount, and timing."),
  authorization: registryTool("authorization", "Authorization Review", "financial", "Reviews authorization method and card/payment acceptance evidence."),
  merchant: registryTool("merchant", "Merchant Evidence", "narrative", "Shows merchant response, service proof, refund proof, and descriptor context."),
  merchantHistory: registryTool("merchantHistory", "Merchant History", "timeline", "Compares current merchant/category use against prior customer behavior."),
  priorClaims: registryTool("priorClaims", "Prior Claims Pattern", "timeline", "Shows prior claim activity without auto-labeling the current claim."),
  reasonCode: registryTool("reasonCode", "Reason Code Guide", "narrative", "Keeps dispute evidence aligned to the correct reason-code lane."),
  receipt: registryTool("receipt", "Receipt / Invoice", "narrative", "Reviews receipt, invoice, tip, tax, currency, and fee disclosures."),
  fulfillment: registryTool("fulfillment", "Delivery / Return / Refund", "narrative", "Shows delivery, return, cancellation, refund, and credit evidence."),
  terms: registryTool("terms", "Terms / Policy Review", "narrative", "Reviews merchant/service policy and disclosure evidence."),
  payrollProfile: registryTool("payrollProfile", "Payroll Profile", "timeline", "Shows normal payroll cycles, employee count, run amount, and change timing."),
  employee: registryTool("employee", "Employee Profile", "identity", "Checks employee relationship, contact path, and deposit history."),
  bank: registryTool("bank", "Bank Account Verification", "identity", "Reviews destination ownership, account type, first-seen timing, and recoverability."),
  changeRequest: registryTool("changeRequest", "Change Request Review", "timeline", "Shows request channel, approvals, requester identity, and change trail."),
  admin: registryTool("admin", "Admin Activity", "timeline", "Shows admin access and portal actions without assuming the request was safe."),
  callback: registryTool("callback", "Callback Verification", "narrative", "Tracks trusted-contact callback attempts and outcomes."),
  payrollRun: registryTool("payrollRun", "Payroll Run Status", "timeline", "Shows release status, hold controls, and recovery windows."),
  emailHeaders: registryTool("emailHeaders", "Email Headers", "technical", "Reviews SPF, DKIM, DMARC, routing, From, and Reply-To clues."),
  domain: registryTool("domain", "Domain Lookup", "technical", "Reviews domain age, look-alike patterns, DNS, registrar, and reputation clues."),
  sender: registryTool("sender", "Sender Analysis", "technical", "Compares sender behavior, mailbox clues, tone, and request history."),
  beneficiary: registryTool("beneficiary", "Beneficiary Review", "identity", "Reviews destination beneficiary, prior use, bank type, and owner match."),
  paymentTimeline: registryTool("paymentTimeline", "Payment Timeline", "timeline", "Shows payment request, callback, hold, approval, and release sequence."),
  income: registryTool("income", "Income Verification", "financial", "Reviews claimed income, verified deposits, documents, and employer fit."),
  employment: registryTool("employment", "Employment Verification", "identity", "Checks employment source, status, tenure, and trusted verification outcome."),
  dti: registryTool("dti", "DTI Calculator", "financial", "Compares claimed income, verified income, debt, and ability-to-repay metrics."),
  creditReport: registryTool("creditReport", "Credit Report Summary", "financial", "Shows fictional score band, tradelines, inquiries, utilization, and derogatory items."),
  bankStatements: registryTool("bankStatements", "Bank Statements", "financial", "Reviews deposits, balances, overdrafts, returned items, and cash-flow support."),
  paymentHistory: registryTool("paymentHistory", "Payment History", "timeline", "Shows existing loan/card payment behavior and repayment stability."),
  utilization: registryTool("utilization", "Credit Utilization", "financial", "Shows revolving balances, limits, stress, and utilization trends."),
  inquiries: registryTool("inquiries", "Recent Inquiries", "timeline", "Shows recent application velocity and new account search behavior."),
  kyb: registryTool("kyb", "KYB Review", "identity", "Reviews business legitimacy, address, registration, ownership, and operating history.", REPORT_ELIGIBLE),
  businessRegistration: registryTool("businessRegistration", "Business Registration", "identity", "Reviews Secretary-of-State-style registration and filing evidence."),
  ownerKyc: registryTool("ownerKyc", "Owner KYC", "identity", "Reviews beneficial owner identity, contact, address, and watchlist checks.", REPORT_ELIGIBLE),
  revenue: registryTool("revenue", "Revenue / Cash Flow", "financial", "Compares claimed business revenue against deposits, draws, NSFs, and cash-flow fit."),
  profileVerify: registryTool("profileVerify", "Profile Verify", "identity", "Reviews applicant identity consistency across profile, ID, address, email, and device.", REPORT_ELIGIBLE),
  driverLicense: registryTool("driverLicense", "Driver License Review", "identity", "Reviews OCR, barcode, expiration, address, and tamper signals."),
  selfie: registryTool("selfie", "Selfie Verification", "identity", "Reviews liveness, face match, capture quality, and replay risk."),
  address: registryTool("address", "Address Verification", "identity", "Reviews deliverability, first-seen timing, utility proof, and mail-drop risk."),
  phone: registryTool("phone", "Phone Verification", "identity", "Reviews line type, carrier, owner match, first-seen date, and recent porting."),
  email: registryTool("email", "Email Verification", "identity", "Reviews email domain, age, exposure, and profile linkage."),
  positivePay: registryTool("positivePay", "Positive Pay", "identity", "Compares issued check file against payee, amount, check number, and exception status."),
  checkImage: registryTool("checkImage", "Check Image", "identity", "Reviews front check image, MICR, payee, amount, signature, and alteration signals."),
  endorsement: registryTool("endorsement", "Endorsement Review", "identity", "Reviews back image, endorser, deposit bank, and deposit-account fit."),
  velocity: registryTool("velocity", "Velocity Review", "financial", "Reviews frequency, amount spikes, new payees, and timing clusters.")
};

export const TOOL_EVIDENCE_GUARDRAILS = [
  "Evidence pages show fictional training evidence only.",
  "Tools must not reveal the final determination.",
  "Tools must not auto-mark final red/green answers.",
  "Reports are reserved for report-style identity, SSN/background, KYB, and generated document workflows.",
  "Every tool must stay inside the active claim lane and avoid irrelevant intake questions."
];

export function resolveToolDefinition(toolId) {
  return toolRegistry[toolId] || registryTool(toolId, readable(toolId), "narrative", "Fallback evidence snapshot for this lane.");
}

export function buildToolEvidence({ toolId, lane, caseId, tool = {} }) {
  const definition = resolveToolDefinition(toolId);
  const rows = normalizeToolRows(tool);
  const timeline = normalizeTimeline(tool, rows);
  const category = definition.category;

  return {
    schema: "ToolEvidence.v1",
    toolId,
    lane,
    caseId,
    title: tool.title || definition.title,
    category,
    categoryLabel: categoryLabel(category),
    lens: definition.lens,
    outputMode: definition.outputMode,
    reportEligible: definition.outputMode === REPORT_ELIGIBLE,
    summary: tool.summary || definition.evidenceRole,
    evidenceRole: definition.evidenceRole,
    rows,
    timeline,
    trainingTip: tool.trainingTip || "Review this evidence against the case story. The tool is a snapshot, not a verdict.",
    guardrails: TOOL_EVIDENCE_GUARDRAILS
  };
}

export function categoryLabel(category) {
  return TOOL_CATEGORIES[category]?.label || "Evidence";
}

export function normalizeToolRows(tool = {}) {
  if (Array.isArray(tool.rows)) {
    return tool.rows.map((row) => normalizeEvidenceRow(row.k || row.label || "Record", row.v ?? row.value, row.flag));
  }

  if (Array.isArray(tool.fields)) {
    return tool.fields.map(([label, value]) => normalizeEvidenceRow(label, value, inferFlag(`${label} ${value}`)));
  }

  return [normalizeEvidenceRow("Status", "Ready for training data", "neutral")];
}

export function normalizeTimeline(tool = {}, rows = []) {
  if (Array.isArray(tool.timeline) && tool.timeline.length) {
    return tool.timeline.map((item, index) => Array.isArray(item)
      ? { time: item[0], text: String(item[1] ?? "Not provided"), flag: normalizeFlag(item[2]) }
      : { time: `Step ${index + 1}`, text: String(item), flag: inferFlag(item) });
  }

  return rows.map((row, index) => ({ time: row.label || row.k || `Step ${index + 1}`, text: row.value || row.v, flag: row.flag }));
}

export function normalizeFlag(flag) {
  const value = String(flag || "neutral").toLowerCase();
  if (["good", "pass", "normal", "verified", "match"].includes(value)) return "good";
  if (["bad", "fail", "risk", "warn", "warning", "caution", "mismatch"].includes(value)) return "caution";
  return "neutral";
}

export function inferFlag(value = "") {
  const text = String(value).toLowerCase();
  if (["verified", "known", "stable", "good", "passed", "complete", "match", "no suspicious", "not involved"].some((term) => text.includes(term))) return "good";
  if (["new", "first-seen", "mismatch", "unable", "pending", "failed", "high", "limited", "no answer", "not confirmed", "changed", "prepaid"].some((term) => text.includes(term))) return "caution";
  return "neutral";
}

export function flagClass(flag) {
  return normalizeFlag(flag);
}

export function flagIcon(flag) {
  return normalizeFlag(flag) === "good" ? "✓" : normalizeFlag(flag) === "caution" ? "!" : "▫";
}

export function assertToolRegistryCoverage() {
  const configuredIds = new Set(Object.values(toolNavByLane).flat().map((tool) => tool.id));
  const missing = [...configuredIds].filter((toolId) => !toolRegistry[toolId]);

  if (missing.length && typeof console !== "undefined") {
    console.warn("Fraud Academy tool registry missing tool IDs:", missing);
  }

  return { totalTools: configuredIds.size, missing };
}

function registryTool(id, title, category, evidenceRole, outputMode = SNAPSHOT_ONLY) {
  return {
    id,
    title,
    category,
    categoryLabel: categoryLabel(category),
    lens: TOOL_CATEGORIES[category]?.lens || "Evidence review",
    template: TOOL_CATEGORIES[category]?.template || "NarrativeToolTemplate",
    evidenceRole,
    outputMode
  };
}

function normalizeEvidenceRow(label, value = "Not provided", flag = "neutral") {
  const normalizedFlag = normalizeFlag(flag);
  const safeValue = String(value ?? "Not provided");

  return {
    label: String(label || "Record"),
    value: safeValue,
    flag: normalizedFlag,
    k: String(label || "Record"),
    v: safeValue
  };
}

function readable(value = "") {
  return String(value).replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}
