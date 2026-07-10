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

const SEARCH_BEHAVIOR_DEFAULTS = {
  timeline: { requiresSearch: "no", revealMode: "direct", searchKeys: ["time", "event", "caseId"] },
  identity: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["trainingId", "nameDob", "phone", "email", "address", "destinationId", "businessName"] },
  financial: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["amount", "date", "merchant", "account", "category", "caseId"] },
  technical: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["ip", "deviceId", "domain", "sessionId", "caseId"] },
  narrative: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["statement", "source", "document", "policy", "caseId"] }
};

const TOOL_BIBLE_OVERRIDES = {
  login: { requiresSearch: "no", revealMode: "direct", searchKeys: ["loginTime", "location", "deviceId", "sessionId"], primaryQuestion: "Who logged in, when, and from where?" },
  session: { requiresSearch: "no", revealMode: "direct", searchKeys: ["sessionId", "action", "timestamp", "deviceId"], primaryQuestion: "What actions occurred after authentication?" },
  device: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["deviceId", "fingerprint", "trustedDevice", "linkedProfile"], primaryQuestion: "What device was used, and does it match normal device behavior?" },
  ip: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["ip", "geo", "asn", "sessionId", "linkedProfile"], primaryQuestion: "Where did the connection originate, and has it been seen elsewhere?" },
  mfa: { requiresSearch: "no", revealMode: "direct", searchKeys: ["otp", "push", "mfaDestination", "timestamp"], primaryQuestion: "What MFA challenge or destination was used during the event sequence?" },
  financial: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["amount", "deposit", "cashActivity", "linkedAccount", "merchant"], primaryQuestion: "Does the money make sense?" },
  identity: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["trainingId", "nameDob", "phone", "email", "address", "businessName"], primaryQuestion: "Does this identity history support who they claim to be?" },
  link: { requiresSearch: "yes", revealMode: "crossReference", searchKeys: ["trainingId", "phone", "email", "deviceId", "ip", "address", "destinationId", "merchant", "businessName", "adminUser"], primaryQuestion: "What repeated data links connect this case to other profiles, destinations, businesses, or cases?" },
  transaction: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["transactionId", "merchant", "amount", "date", "descriptor", "channel"], primaryQuestion: "What financial activity actually occurred?" },
  authorization: { requiresSearch: "no", revealMode: "direct", searchKeys: ["authCode", "entryMode", "token", "avs", "cvv", "amount"], primaryQuestion: "How was the payment authorized or accepted?" },
  merchant: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["merchant", "descriptor", "receipt", "refund", "policy"], primaryQuestion: "What does the merchant evidence prove for this reason code?" },
  merchantHistory: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["merchant", "category", "priorUse", "claimHistory"], primaryQuestion: "Does merchant history fit or conflict with the customer story?" },
  priorClaims: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["claimType", "merchant", "date", "outcome"], primaryQuestion: "Is there a prior claim pattern relevant to this case?" },
  reasonCode: { requiresSearch: "no", revealMode: "direct", searchKeys: ["reasonCode", "policy", "requiredEvidence"], primaryQuestion: "Which evidence matters for this dispute lane?" },
  receipt: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["receipt", "invoice", "amount", "fee", "tip"], primaryQuestion: "Does the receipt or invoice support the billing claim?" },
  fulfillment: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["delivery", "return", "refund", "tracking"], primaryQuestion: "Was the good, service, return, or refund completed as claimed?" },
  terms: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["policy", "terms", "refund", "cancellation"], primaryQuestion: "What policy or disclosure controls this non-fraud dispute?" },
  payrollProfile: { primaryQuestion: "Does the payroll run fit normal business payroll behavior?" },
  employee: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["employeeId", "phone", "email", "priorBank", "destinationId"], primaryQuestion: "Is the employee relationship and destination change consistent with trusted records?" },
  bank: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["destinationId", "bankCode", "maskedAccount", "owner", "priorUse", "recoverability"], primaryQuestion: "Is this destination account trustworthy, and has it been used before?" },
  changeRequest: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["requester", "channel", "replyTo", "approval", "timestamp"], primaryQuestion: "Who requested the change, through what channel, and was it verified?" },
  admin: { requiresSearch: "no", revealMode: "direct", searchKeys: ["adminUser", "login", "mfa", "action", "ip"], primaryQuestion: "What admin action changed the account, payroll, vendor, or business record?" },
  callback: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["trustedPhone", "contact", "attempt", "outcome"], primaryQuestion: "Was verification completed through trusted contact information?" },
  payrollRun: { requiresSearch: "no", revealMode: "direct", searchKeys: ["runId", "releaseWindow", "hold", "recoverability"], primaryQuestion: "Can the payroll run still be paused, stopped, or recovered?" },
  emailHeaders: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["from", "replyTo", "domain", "spf", "dkim", "dmarc"], primaryQuestion: "Do the email headers support the sender identity or a spoof/look-alike concern?" },
  domain: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["domain", "registrar", "age", "mx", "reputation"], primaryQuestion: "Is the domain consistent with the trusted vendor or business relationship?" },
  sender: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["sender", "tone", "mailbox", "priorRequest"], primaryQuestion: "Does sender behavior fit the known relationship and request history?" },
  beneficiary: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["beneficiary", "destinationId", "bankCode", "owner", "priorUse"], primaryQuestion: "Does the beneficiary destination fit the trusted vendor or payment history?" },
  paymentTimeline: { requiresSearch: "no", revealMode: "direct", searchKeys: ["payment", "approval", "hold", "callback", "release"], primaryQuestion: "Where is the payment in the request, hold, release, or recovery sequence?" },
  income: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["income", "deposit", "paystub", "employer"], primaryQuestion: "Is claimed income supported by verified evidence?" },
  employment: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["employer", "employee", "tenure", "status"], primaryQuestion: "Can employment be verified through a trusted source?" },
  dti: { requiresSearch: "no", revealMode: "direct", searchKeys: ["income", "debt", "dti", "monthlyPayment"], primaryQuestion: "Does ability-to-repay change when verified income is used?" },
  creditReport: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["tradeline", "utilization", "inquiry", "derogatory", "scoreBand"], primaryQuestion: "What does the credit file show about credit risk and repayment stress?" },
  bankStatements: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["statement", "deposit", "balance", "overdraft", "returnedItem"], primaryQuestion: "Do bank statements support income, revenue, and cash-flow claims?" },
  paymentHistory: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["payment", "late", "autopay", "returnedPayment"], primaryQuestion: "Does payment history support current credit exposure?" },
  utilization: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["utilization", "balance", "limit", "trend"], primaryQuestion: "Is revolving credit use stable or stressed?" },
  inquiries: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["inquiry", "newAccount", "application", "date"], primaryQuestion: "Is recent credit-seeking velocity relevant to this review?" },
  kyb: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["businessName", "ein", "address", "owner", "registration"], primaryQuestion: "Does the business exist, operate, and fit the requested relationship or exposure?" },
  businessRegistration: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["businessName", "state", "filing", "registeredAgent", "status"], primaryQuestion: "Does registration evidence support the claimed business identity?" },
  ownerKyc: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["owner", "trainingId", "phone", "email", "address"], primaryQuestion: "Does owner identity support the stated control of the business?" },
  revenue: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["revenue", "deposit", "cashFlow", "draw", "nsf"], primaryQuestion: "Does verified revenue support the requested business exposure?" },
  profileVerify: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["trainingId", "nameDob", "address", "email", "deviceId"], primaryQuestion: "Does the application profile match identity and account-opening evidence?" },
  driverLicense: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["license", "ocr", "barcode", "address", "expiration"], primaryQuestion: "Does the ID document support the application identity and address?" },
  selfie: { requiresSearch: "no", revealMode: "direct", searchKeys: ["liveness", "faceMatch", "captureQuality"], primaryQuestion: "Does the selfie or liveness check support the applicant identity control?" },
  address: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["address", "utility", "usps", "firstSeen", "mailDrop"], primaryQuestion: "Can the address be verified and connected to the applicant or customer?" },
  phone: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["phone", "carrier", "lineType", "owner", "port"], primaryQuestion: "Does the phone number support the identity and contact history?" },
  email: { requiresSearch: "yes", revealMode: "lookup", searchKeys: ["email", "domain", "age", "breach", "profile"], primaryQuestion: "Does the email address support the identity and account history?" },
  positivePay: { requiresSearch: "no", revealMode: "direct", searchKeys: ["checkNumber", "payee", "amount", "issuedFile"], primaryQuestion: "Does the item match the issued check file?" },
  checkImage: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["micr", "payee", "amount", "signature", "alteration"], primaryQuestion: "Does the check image support or conflict with the issued-item record?" },
  endorsement: { requiresSearch: "partial", revealMode: "crossReference", searchKeys: ["endorsement", "depositBank", "endorser", "destinationId"], primaryQuestion: "Where did the item go, and does the endorsement fit the payee story?" },
  velocity: { requiresSearch: "no", revealMode: "filteredRecord", searchKeys: ["velocity", "amount", "frequency", "newPayee", "date"], primaryQuestion: "Is payment velocity outside normal business or customer behavior?" }
};

export const toolRegistry = {
  login: registryTool("login", "Login History", "timeline", "Compares login timing, location, success/failure path, and access sequence.", REPORT_ELIGIBLE),
  session: registryTool("session", "Session History", "timeline", "Shows session events and the order of account actions.", REPORT_ELIGIBLE),
  device: registryTool("device", "Device Intelligence", "technical", "Compares trusted behavior against first-seen or unusual devices.", REPORT_ELIGIBLE),
  ip: registryTool("ip", "IP Intelligence", "technical", "Reviews fictional IP, geolocation, proxy/VPN, prior use, linked sessions, and normal-location fit.", REPORT_ELIGIBLE),
  mfa: registryTool("mfa", "MFA History", "timeline", "Shows OTP, push, enrollment, approval, and MFA change events.", REPORT_ELIGIBLE),
  financial: registryTool("financial", "Financial Investigation", "financial", "Answers whether the money behavior fits the claim lane."),
  identity: registryTool("identity", "Identity Intel / People Search", "identity", "Supports ID-style, background, contact, and identity consistency checks with fictional masked records.", REPORT_ELIGIBLE),
  link: registryTool("link", "Link Analysis", "identity", "Maps relationships between customer, device, IP, destination, merchant, and business."),
  transaction: registryTool("transaction", "Transaction Details", "timeline", "Shows posted activity, channel, descriptor, amount, and timing.", REPORT_ELIGIBLE),
  authorization: registryTool("authorization", "Authorization Review", "financial", "Reviews authorization method and card/payment acceptance evidence.", REPORT_ELIGIBLE),
  merchant: registryTool("merchant", "Merchant Evidence", "narrative", "Shows merchant response, service proof, refund proof, and descriptor context."),
  merchantHistory: registryTool("merchantHistory", "Merchant History", "timeline", "Compares current merchant/category use against prior customer behavior."),
  priorClaims: registryTool("priorClaims", "Prior Claims Pattern", "timeline", "Shows prior claim activity without auto-labeling the current claim."),
  reasonCode: registryTool("reasonCode", "Reason Code Guide", "narrative", "Keeps dispute evidence aligned to the correct reason-code lane."),
  receipt: registryTool("receipt", "Receipt / Invoice", "narrative", "Reviews receipt, invoice, tip, tax, currency, and fee disclosures.", REPORT_ELIGIBLE),
  fulfillment: registryTool("fulfillment", "Delivery / Return / Refund", "narrative", "Shows delivery, return, cancellation, refund, and credit evidence.", REPORT_ELIGIBLE),
  terms: registryTool("terms", "Terms / Policy Review", "narrative", "Reviews merchant/service policy and disclosure evidence."),
  payrollProfile: registryTool("payrollProfile", "Payroll Profile", "timeline", "Shows normal payroll cycles, employee count, run amount, and change timing.", REPORT_ELIGIBLE),
  employee: registryTool("employee", "Employee Profile", "identity", "Checks employee relationship, contact path, and deposit history."),
  bank: registryTool("bank", "Bank Account Verification", "identity", "Reviews destination ownership, account type, first-seen timing, and recoverability.", REPORT_ELIGIBLE),
  changeRequest: registryTool("changeRequest", "Change Request Review", "timeline", "Shows request channel, approvals, requester identity, and change trail."),
  admin: registryTool("admin", "Admin Activity", "timeline", "Shows admin access and portal actions without assuming the request was safe."),
  callback: registryTool("callback", "Callback Verification", "narrative", "Tracks trusted-contact callback attempts and outcomes.", REPORT_ELIGIBLE),
  payrollRun: registryTool("payrollRun", "Payroll Run Status", "timeline", "Shows release status, hold controls, and recovery windows.", REPORT_ELIGIBLE),
  emailHeaders: registryTool("emailHeaders", "Email Headers", "technical", "Reviews SPF, DKIM, DMARC, routing, From, and Reply-To clues.", REPORT_ELIGIBLE),
  domain: registryTool("domain", "Domain Lookup", "technical", "Reviews domain age, look-alike patterns, DNS, registrar, and reputation clues.", REPORT_ELIGIBLE),
  sender: registryTool("sender", "Sender Analysis", "technical", "Compares sender behavior, mailbox clues, tone, and request history."),
  beneficiary: registryTool("beneficiary", "Beneficiary Review", "identity", "Reviews destination beneficiary, prior use, bank type, and owner match.", REPORT_ELIGIBLE),
  paymentTimeline: registryTool("paymentTimeline", "Payment Timeline", "timeline", "Shows payment request, callback, hold, approval, and release sequence."),
  income: registryTool("income", "Income Verification", "financial", "Reviews claimed income, verified deposits, documents, and employer fit.", REPORT_ELIGIBLE),
  employment: registryTool("employment", "Employment Verification", "identity", "Checks employment source, status, tenure, and trusted verification outcome.", REPORT_ELIGIBLE),
  dti: registryTool("dti", "DTI Calculator", "financial", "Compares claimed income, verified income, debt, and ability-to-repay metrics.", REPORT_ELIGIBLE),
  creditReport: registryTool("creditReport", "Credit Report Summary", "financial", "Shows fictional score band, tradelines, inquiries, utilization, and derogatory items.", REPORT_ELIGIBLE),
  bankStatements: registryTool("bankStatements", "Bank Statements", "financial", "Reviews deposits, balances, overdrafts, returned items, and cash-flow support.", REPORT_ELIGIBLE),
  paymentHistory: registryTool("paymentHistory", "Payment History", "timeline", "Shows existing loan/card payment behavior and repayment stability."),
  utilization: registryTool("utilization", "Credit Utilization", "financial", "Shows revolving balances, limits, stress, and utilization trends."),
  inquiries: registryTool("inquiries", "Recent Inquiries", "timeline", "Shows recent application velocity and new account search behavior."),
  kyb: registryTool("kyb", "KYB Review", "identity", "Reviews business legitimacy, address, registration, ownership, and operating history.", REPORT_ELIGIBLE),
  businessRegistration: registryTool("businessRegistration", "Business Registration", "identity", "Reviews Secretary-of-State-style registration and filing evidence.", REPORT_ELIGIBLE),
  ownerKyc: registryTool("ownerKyc", "Owner KYC", "identity", "Reviews beneficial owner identity, contact, address, and watchlist checks.", REPORT_ELIGIBLE),
  revenue: registryTool("revenue", "Revenue / Cash Flow", "financial", "Compares claimed business revenue against deposits, draws, NSFs, and cash-flow fit.", REPORT_ELIGIBLE),
  profileVerify: registryTool("profileVerify", "Profile Verify", "identity", "Reviews applicant identity consistency across profile, ID, address, email, and device.", REPORT_ELIGIBLE),
  driverLicense: registryTool("driverLicense", "Driver License Review", "identity", "Reviews OCR, barcode, expiration, address, and tamper signals.", REPORT_ELIGIBLE),
  selfie: registryTool("selfie", "Selfie Verification", "identity", "Reviews liveness, face match, capture quality, and replay risk."),
  address: registryTool("address", "Address Verification", "identity", "Reviews deliverability, first-seen timing, utility proof, and mail-drop risk."),
  phone: registryTool("phone", "Phone Verification", "identity", "Reviews line type, carrier, owner match, first-seen date, and recent porting."),
  email: registryTool("email", "Email Verification", "identity", "Reviews email domain, age, exposure, and profile linkage."),
  positivePay: registryTool("positivePay", "Positive Pay", "identity", "Compares issued check file against payee, amount, check number, and exception status.", REPORT_ELIGIBLE),
  checkImage: registryTool("checkImage", "Check Image", "identity", "Reviews front check image, MICR, payee, amount, signature, and alteration signals.", REPORT_ELIGIBLE),
  endorsement: registryTool("endorsement", "Endorsement Review", "identity", "Reviews back image, endorser, deposit bank, and deposit-account fit.", REPORT_ELIGIBLE),
  velocity: registryTool("velocity", "Velocity Review", "financial", "Reviews frequency, amount spikes, new payees, and timing clusters.", REPORT_ELIGIBLE)
};

export const TOOL_EVIDENCE_GUARDRAILS = [
  "Evidence pages show fictional training evidence only.",
  "Tools must not reveal the final determination.",
  "Tools must not auto-mark final red/green answers.",
  "Snapshot tools summarize and search records; report-eligible tools can open detailed fictional internal reports.",
  "Every tool must stay inside the active claim lane and avoid irrelevant intake questions."
];

const REPORT_TITLES = {
  login: "Login Timeline Report",
  session: "Session History Report",
  device: "Device Intelligence Comparison Report",
  ip: "IP Intelligence Report",
  mfa: "MFA / OTP Report",
  identity: "Identity Search Report",
  transaction: "Transaction Detail Sheet",
  authorization: "Authorization Log",
  receipt: "Receipt / Invoice Viewer",
  fulfillment: "Fulfillment Packet",
  payrollProfile: "Payroll Audit Report",
  bank: "Bank Verification Report",
  callback: "Callback Verification Log",
  payrollRun: "Payroll Run Status Report",
  emailHeaders: "Email Header Analysis",
  domain: "Domain Lookup Report",
  beneficiary: "Beneficiary / Bank Verification Report",
  income: "Income Verification Worksheet",
  dti: "DTI / Income Verification Report",
  creditReport: "Credit Bureau Summary",
  bankStatements: "Bank Statement Digest",
  kyb: "KYB Business Report",
  businessRegistration: "Business Registration Extract",
  ownerKyc: "Owner KYC Packet",
  revenue: "Revenue / Cash Flow Review",
  profileVerify: "Application KYC Report",
  positivePay: "Positive Pay Exception Report",
  checkImage: "Check Image Review",
  endorsement: "Endorsement Review",
  velocity: "Velocity Report"
};

const DEFAULT_DOCUMENTS_BY_TOOL = {
  login: ["Login Timeline Report", "Session History Report", "Profile Change Report"],
  session: ["Session History Report", "Login Timeline Report", "Action Impact Log"],
  device: ["Device Intelligence Comparison Report", "Session History Report", "Customer 360 trusted-device baseline"],
  ip: ["IP Intelligence Report", "Login Timeline Report", "Device Intelligence Comparison Report"],
  mfa: ["MFA / OTP Report", "Profile Change Report", "Login Timeline Report"],
  identity: ["Identity Search Report", "People Search Report", "Customer 360 dossier"],
  bank: ["Bank Verification Report", "Callback Verification Log", "Destination account review"],
  emailHeaders: ["Email Header Analysis", "Domain Lookup Report", "Beneficiary Review"],
  domain: ["Domain Lookup Report", "Email Header Analysis", "Vendor master record"],
  callback: ["Callback Verification Log", "Action Impact Log"],
  kyb: ["KYB Business Report", "Business Registration Extract", "Owner KYC Packet"],
  ownerKyc: ["Owner KYC Packet", "KYB Business Report"],
  profileVerify: ["Application KYC Report", "Identity Search Report"],
  positivePay: ["Positive Pay Exception Report", "Check Image Review", "Endorsement Review"],
  checkImage: ["Check Image Review", "Positive Pay Exception Report"],
  endorsement: ["Endorsement Review", "Check Image Review"]
};

const NEXT_ACTIONS_BY_TOOL = {
  ip: [
    "Search this IP across prior sessions and linked profiles.",
    "Compare geolocation and ASN with the Customer 360 normal market.",
    "Review device, login, MFA, and profile-change sequence before deciding."
  ],
  identity: [
    "Run the fictional People Search report using masked ID or Name + DOB.",
    "Compare address, phone, email, associates, businesses, and public-record sections.",
    "Treat identity consistency as context, not proof of fraud or no fraud."
  ],
  device: [
    "Compare the first-seen device against trusted device baseline.",
    "Review linked profiles, emulator/root context, and device age.",
    "Pair device evidence with login, IP, MFA, and money movement."
  ],
  bank: [
    "Compare old/prior account against new destination account.",
    "Complete trusted callback when the lane requires verification.",
    "Document first-seen date, owner match, account type, and recoverability."
  ],
  callback: [
    "Use trusted contact information from the master record, not the incoming message.",
    "Record answer/no-answer/wrong-person outcomes.",
    "Do not release funds or payroll changes until required challenge-response steps are complete."
  ],
  financial: [
    "Check whether the money movement fits normal deposits and outflows.",
    "Compare linked accounts, cash activity, merchant history, and funds flow.",
    "Document financial facts before choosing a lane-specific determination."
  ],
  income: [
    "Compare claimed income to verified deposits and employer evidence.",
    "Request missing documents when evidence is incomplete.",
    "Use credit-risk outcomes, not fraud reimbursement language."
  ],
  kyb: [
    "Check entity status, owners, business age, address, and revenue support.",
    "Open owner KYC and revenue/cash-flow evidence before final action.",
    "Escalate business fraud review only when evidence supports that path."
  ]
};

export function resolveToolDefinition(toolId) {
  return toolRegistry[toolId] || registryTool(toolId, readable(toolId), "narrative", "Fallback evidence snapshot for this lane.");
}

export function buildToolEvidence({ toolId, lane, caseId, tool = {} }) {
  const definition = resolveToolDefinition(toolId);
  const rows = normalizeToolRows(tool);
  const timeline = normalizeTimeline(tool, rows);
  const category = definition.category;
  const riskSignals = normalizeStringList(tool.riskSignals, defaultRiskSignals(definition, rows, timeline));
  const relatedDocuments = normalizeStringList(tool.relatedDocuments, defaultRelatedDocuments(definition));
  const nextActions = normalizeStringList(tool.nextActions, defaultNextActions(definition));
  const reportTitle = tool.reportTitle || defaultReportTitle(definition);
  const reportSections = normalizeReportSections(tool.reportSections, buildReportSections({ rows, timeline, riskSignals, relatedDocuments, nextActions, definition }));

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
    requiresSearch: definition.requiresSearch,
    revealMode: definition.revealMode,
    searchKeys: definition.searchKeys,
    primaryQuestion: definition.primaryQuestion,
    lanes: definition.lanes,
    summary: tool.summary || definition.evidenceRole,
    evidenceRole: definition.evidenceRole,
    rows,
    timeline,
    riskSignals,
    relatedDocuments,
    nextActions,
    reportTitle,
    reportSections,
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
  if (["new", "first-seen", "mismatch", "unable", "pending", "failed", "limited", "no answer", "not confirmed", "changed", "prepaid"].some((term) => text.includes(term))) return "caution";
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

export function validateToolRegistryBibleMetadata() {
  const requiredFields = ["requiresSearch", "revealMode", "searchKeys", "primaryQuestion", "lanes"];
  const missing = [];
  const invalid = [];

  Object.values(toolRegistry).forEach((definition) => {
    requiredFields.forEach((field) => {
      if (!(field in definition)) missing.push(`${definition.id}.${field}`);
    });

    if (!Array.isArray(definition.searchKeys) || definition.searchKeys.length === 0) invalid.push(`${definition.id}.searchKeys`);
    if (!Array.isArray(definition.lanes) || definition.lanes.length === 0) invalid.push(`${definition.id}.lanes`);
    if (!["yes", "no", "partial"].includes(definition.requiresSearch)) invalid.push(`${definition.id}.requiresSearch`);
    if (!["direct", "lookup", "crossReference", "filteredRecord"].includes(definition.revealMode)) invalid.push(`${definition.id}.revealMode`);
  });

  return {
    ok: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
    checkedToolCount: Object.keys(toolRegistry).length
  };
}

function registryTool(id, title, category, evidenceRole, outputMode = SNAPSHOT_ONLY) {
  const metadata = buildBibleMetadata(id, category);

  return {
    id,
    title,
    category,
    categoryLabel: categoryLabel(category),
    lens: TOOL_CATEGORIES[category]?.lens || "Evidence review",
    template: TOOL_CATEGORIES[category]?.template || "NarrativeToolTemplate",
    evidenceRole,
    outputMode,
    ...metadata
  };
}

function buildBibleMetadata(id, category) {
  const defaults = SEARCH_BEHAVIOR_DEFAULTS[category] || SEARCH_BEHAVIOR_DEFAULTS.narrative;
  const override = TOOL_BIBLE_OVERRIDES[id] || {};

  return {
    requiresSearch: override.requiresSearch || defaults.requiresSearch,
    revealMode: override.revealMode || defaults.revealMode,
    searchKeys: override.searchKeys || defaults.searchKeys,
    primaryQuestion: override.primaryQuestion || `What does ${readable(id)} answer for this claim lane?`,
    lanes: lanesForTool(id)
  };
}

function lanesForTool(toolId) {
  const lanes = Object.entries(toolNavByLane)
    .filter(([, tools]) => tools.some((tool) => tool.id === toolId))
    .map(([lane]) => lane);

  return lanes.length ? lanes : ["UNASSIGNED"];
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

function normalizeStringList(value, fallback = []) {
  if (Array.isArray(value) && value.length) return value.map((item) => String(item));
  return fallback.map((item) => String(item));
}

function normalizeReportSections(value, fallback = []) {
  if (Array.isArray(value) && value.length) {
    return value.map((section, index) => ({
      title: String(section.title || `Report section ${index + 1}`),
      items: normalizeStringList(section.items, [])
    }));
  }
  return fallback;
}

function defaultRiskSignals(definition, rows, timeline) {
  const rowSignals = rows
    .filter((row) => row.flag === "caution")
    .slice(0, 4)
    .map((row) => `${row.label}: ${row.value}`);
  const timelineSignals = timeline
    .filter((event) => event.flag === "caution")
    .slice(0, 2)
    .map((event) => `${event.time}: ${event.text}`);
  const signals = [...rowSignals, ...timelineSignals];

  if (signals.length) return signals;
  return [`${definition.title} has no final verdict. Compare the evidence to the claim story and document any gaps.`];
}

function defaultRelatedDocuments(definition) {
  return DEFAULT_DOCUMENTS_BY_TOOL[definition.id] || [defaultReportTitle(definition), "Case timeline", "Investigation summary"];
}

function defaultNextActions(definition) {
  return NEXT_ACTIONS_BY_TOOL[definition.id] || [
    `Search the ${definition.title} records for repeated values or timing conflicts.`,
    "Compare the evidence against Customer 360 and the active claim lane.",
    "Document unresolved questions before moving to determination."
  ];
}

function defaultReportTitle(definition) {
  return REPORT_TITLES[definition.id] || `${definition.title} Report`;
}

function buildReportSections({ rows, timeline, riskSignals, relatedDocuments, nextActions, definition }) {
  return [
    {
      title: "Evidence snapshot",
      items: rows.slice(0, 8).map((row) => `${row.label}: ${row.value}`)
    },
    {
      title: definition.id === "ip" ? "Prior use / velocity lens" : "Timeline / sequence",
      items: definition.id === "ip"
        ? [
            "Historical use: compare this fictional IP against prior customer sessions and linked case records.",
            "Velocity: review rapid geography, device, or session changes before deciding.",
            ...timeline.slice(0, 3).map((event) => `${event.time}: ${event.text}`)
          ]
        : timeline.slice(0, 5).map((event) => `${event.time}: ${event.text}`)
    },
    {
      title: "Signals and follow-up",
      items: [...riskSignals.slice(0, 4), ...nextActions.slice(0, 3), ...relatedDocuments.slice(0, 3)]
    }
  ];
}

function readable(value = "") {
  return String(value).replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}
