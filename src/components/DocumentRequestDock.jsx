import { buildCreditDecisionRail } from "../data/creditDecisionRail.js";

const REVIEW_STATUSES = ["In packet", "Request ready", "SLA watch", "Review if unresolved"];

export default function DocumentRequestDock({ activeCase }) {
  if (!activeCase) return null;

  const rail = buildCreditDecisionRail(activeCase);
  const requestRows = buildRequestRows(activeCase, rail).slice(0, 6);
  const creditMode = Boolean(rail);

  if (!requestRows.length) return null;

  return (
    <section className="faDocumentRequestDock" aria-label="Document request workflow preview">
      <div className="faDocumentRequestHeader">
        <span className="faEyebrow">Document requests</span>
        <strong>{creditMode ? "Credit doc rail" : "Evidence request rail"}</strong>
        <small>{creditMode ? "Tracks missing support before credit action" : "Tracks open evidence without revealing the answer"}</small>
      </div>
      <div className="faDocumentRequestRows">
        {requestRows.map((row) => (
          <article className="faDocumentRequestRow" key={`${row.name}-${row.status}`}>
            <div>
              <strong>{row.name}</strong>
              <small>{row.reason}</small>
            </div>
            <span>{row.status}</span>
            <em>{row.due}</em>
          </article>
        ))}
      </div>
      <p>
        Use this as a request tracker, not a verdict. Ask only for lane-relevant fictional documents and keep customer, business, and employee data masked.
      </p>
    </section>
  );
}

function buildRequestRows(activeCase, rail) {
  const expected = unique([
    ...(activeCase.expectedEvidenceCategories || []),
    ...(rail?.missingDocs || [])
  ]);
  const documentNames = flattenDocuments(activeCase.documents);
  const source = expected.length ? expected : documentNames.slice(0, 6);

  return source.map((name, index) => {
    const inPacket = hasLooseMatch(documentNames, name);
    const status = inPacket ? "In packet" : statusFor(activeCase, rail, index);
    return {
      name,
      status,
      due: dueLabel(activeCase, rail, status),
      reason: reasonFor(activeCase, rail, name, status)
    };
  });
}

function statusFor(activeCase, rail, index) {
  if (rail?.missingDocs?.length) return index < rail.missingDocs.length ? "Request ready" : "SLA watch";
  if (String(activeCase.priority || "").toLowerCase() === "critical") return "SLA watch";
  return REVIEW_STATUSES[(index + 1) % REVIEW_STATUSES.length];
}

function dueLabel(activeCase, rail, status) {
  if (status === "In packet") return "Received";
  if (rail) return activeCase.reportedDate ? `${activeCase.reportedDate} clock` : "Credit clock";
  return activeCase.reportedDate ? `Before determination · ${activeCase.reportedDate}` : "Before determination";
}

function reasonFor(activeCase, rail, name, status) {
  if (status === "In packet") return "Available in Evidence Center for review.";
  if (rail) return "Needed for support / do-not-support / more-info credit narrative.";
  return `Needed to compare ${name} against the ${activeCase.title} story.`;
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
    .filter((token) => token.length > 3 && !["review", "data", "history", "summary", "evidence", "report"].includes(token));
}

function unique(list = []) {
  return [...new Set((list || []).filter(Boolean).map((item) => String(item)))];
}
