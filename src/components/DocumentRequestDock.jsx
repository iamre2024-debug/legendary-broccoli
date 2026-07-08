import { buildCreditDecisionRail } from "../data/creditDecisionRail.js";
import { buildDocumentRequestWorkflow } from "../data/documentRequestWorkflow.js";

export default function DocumentRequestDock({ activeCase }) {
  if (!activeCase) return null;

  const rail = buildCreditDecisionRail(activeCase);
  const requestRows = buildDocumentRequestWorkflow(activeCase, rail).slice(0, 6);
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
          <article className="faDocumentRequestRow" key={`${row.id}-${row.status}`}>
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
