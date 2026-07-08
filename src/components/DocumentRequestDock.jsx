import { useState } from "react";
import { buildCreditDecisionRail } from "../data/creditDecisionRail.js";
import { buildDocumentRequestWorkflow } from "../data/documentRequestWorkflow.js";
import { appendAction } from "../data/workstationRuntimeState.js";

export default function DocumentRequestDock({ activeCase }) {
  const [loggedRequests, setLoggedRequests] = useState({});
  if (!activeCase) return null;

  const rail = buildCreditDecisionRail(activeCase);
  const requestRows = buildDocumentRequestWorkflow(activeCase, rail).slice(0, 4);
  const creditMode = Boolean(rail);

  if (!requestRows.length) return null;

  function logRequest(row) {
    if (!activeCase?.id || !row?.id) return;
    appendAction(activeCase.id, {
      actionId: `${activeCase.id}-${row.id}-${Date.now()}`,
      performedAt: new Date().toISOString(),
      actionType: "RequestDocs",
      outcome: `Requested ${row.name}`,
      xpDelta: 2,
      confidenceDelta: 0.01,
      notes: row.reason,
      metadata: {
        label: row.name,
        status: row.status,
        due: row.due,
        source: creditMode ? "Credit doc rail" : "Evidence request rail",
        requestReason: row.reason
      }
    });
    setLoggedRequests((current) => ({ ...current, [row.id]: true }));
  }

  return (
    <section className="faDocumentRequestDock" aria-label="Document request workflow preview">
      <div className="faDocumentRequestHeader">
        <span className="faEyebrow">Document requests</span>
        <strong>{creditMode ? "Credit doc rail" : "Evidence request rail"}</strong>
        <small>{creditMode ? "Compact missing-support preview" : "Compact open-evidence preview"}</small>
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
            <button type="button" onClick={() => logRequest(row)}>
              {loggedRequests[row.id] ? "Logged ✓" : "Log request"}
            </button>
          </article>
        ))}
      </div>
      <p>Use the Summary workflow for full document tracking and notes.</p>
    </section>
  );
}
