import { buildCreditDecisionRail } from "./creditDecisionRail.js";

export const DOCUMENT_REQUEST_STATUSES = [
  "Requested",
  "Received",
  "Pending Review",
  "Approved",
  "Rejected",
  "Expired",
  "Missing",
  "Exception Approved"
];

const STOP_TOKENS = new Set([
  "review",
  "data",
  "history",
  "summary",
  "evidence",
  "report",
  "record",
  "status",
  "request"
]);

export function buildDocumentRequestWorkflow(activeCase, existingRail) {
  if (!activeCase) return [];

  const rail = existingRail === undefined ? buildCreditDecisionRail(activeCase) : existingRail;
  const documentNames = flattenDocuments(activeCase.documents);
  const expected = unique([
    ...(activeCase.expectedEvidenceCategories || []),
    ...((rail && rail.missingDocs) || [])
  ]).filter((item) => !String(item).toLowerCase().includes("no missing evidence"));

  const source = expected.length ? expected : documentNames.slice(0, 6);

  return source.slice(0, 10).map((name, index) => {
    const inPacket = hasLooseMatch(documentNames, name);
    const status = inPacket ? "Received" : defaultStatusFor(activeCase, rail, index);

    return {
      id: requestId(name, index),
      name,
      status,
      inPacket,
      required: requiredLabel(activeCase, rail, index),
      due: dueLabel(activeCase, rail, status),
      reason: reasonFor(activeCase, rail, name, status),
      linkedTool: linkedToolFor(name, activeCase),
      authenticityFlag: inPacket ? "Pending Review" : "Not received yet"
    };
  });
}

export function nextDocumentRequestStatus(status) {
  const index = DOCUMENT_REQUEST_STATUSES.indexOf(status);
  return DOCUMENT_REQUEST_STATUSES[(index + 1) % DOCUMENT_REQUEST_STATUSES.length] || DOCUMENT_REQUEST_STATUSES[0];
}

export function documentRequestTone(status) {
  if (["Received", "Approved"].includes(status)) return "good";
  if (["Rejected", "Expired", "Missing"].includes(status)) return "caution";
  if (["Pending Review", "Exception Approved"].includes(status)) return "review";
  return "neutral";
}

function defaultStatusFor(activeCase, rail, index) {
  if (rail?.missingDocs?.length) return index < rail.missingDocs.length ? "Requested" : "Pending Review";
  if (String(activeCase.priority || "").toLowerCase() === "critical") return "Missing";
  return index % 3 === 0 ? "Requested" : "Pending Review";
}

function requiredLabel(activeCase, rail, index) {
  if (rail) return index < 6 ? "Required for credit narrative" : "Optional support";
  if (String(activeCase.priority || "").toLowerCase() === "critical") return "Required before determination";
  return index % 2 === 0 ? "Required" : "Helpful support";
}

function dueLabel(activeCase, rail, status) {
  if (status === "Received" || status === "Approved") return "Received";
  if (rail) return activeCase.reportedDate ? `${activeCase.reportedDate} credit clock` : "Credit clock";
  return activeCase.reportedDate ? `Before determination · ${activeCase.reportedDate}` : "Before determination";
}

function reasonFor(activeCase, rail, name, status) {
  if (status === "Received") return "Available in Evidence Center for review, authenticity, and timeline linkage.";
  if (rail) return "Needed for support / do-not-support / more-info credit reasoning without using fraud claim wording.";
  return `Needed to compare ${name} against the ${activeCase.title} story before a determination.`;
}

function linkedToolFor(name, activeCase) {
  const tokens = tokenize(name).join(" ");

  if (/identity|applicant|kyc|owner|ubo|profile|driver|license|selfie|liveness|address|phone|email/.test(tokens)) return "Identity Intel / People Search";
  if (/income|paystub|employment|employer|dti/.test(tokens)) return "Income / Employment Verification";
  if (/bank|statement|cash|flow|deposit|ownership/.test(tokens)) return "Bank Verification / Financial Investigation";
  if (/payroll|employee|direct|destination|change/.test(tokens)) return "Payroll Profile / Employee Profile";
  if (/merchant|receipt|invoice|delivery|return|refund|terms|policy/.test(tokens)) return "Merchant Evidence / Receipt Review";
  if (/email|domain|sender|beneficiary|payment|wire|ach|check/.test(tokens)) return "Payment / Communication Review";
  if (activeCase?.lane === "CREDIT_RISK" || activeCase?.lane === "BUSINESS_BUSTOUT") return "Credit Decision Rail";

  return "Evidence Center";
}

function flattenDocuments(documents = {}) {
  return unique(Object.values(documents || {}).flat().filter(Boolean));
}

function hasLooseMatch(documentNames, evidenceName) {
  const tokens = tokenize(evidenceName);
  if (!tokens.length) return false;

  return documentNames.some((doc) => {
    const docTokens = tokenize(doc);
    return tokens.some((token) => docTokens.includes(token));
  });
}

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3 && !STOP_TOKENS.has(token));
}

function requestId(name, index) {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${slug || "document"}-${index}`;
}

function unique(list = []) {
  return [...new Set((list || []).filter(Boolean).map((item) => String(item)))];
}
