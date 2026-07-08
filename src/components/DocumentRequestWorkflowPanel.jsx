import { useMemo, useState } from "react";
import {
  DOCUMENT_REQUEST_STATUSES,
  buildDocumentRequestWorkflow,
  documentRequestTone,
  nextDocumentRequestStatus
} from "../data/documentRequestWorkflow.js";
import { loadState, saveState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

export default function DocumentRequestWorkflowPanel({ activeCase }) {
  const [statusMap, setStatusMap] = useState(() => readStatusMap(activeCase?.id));

  const rows = useMemo(() => {
    return buildDocumentRequestWorkflow(activeCase).map((row) => ({
      ...row,
      status: statusMap[row.id] || row.status
    }));
  }, [activeCase, statusMap]);

  if (!activeCase || !rows.length) return null;

  const counts = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  function updateStatus(row, status) {
    const nextForCase = { ...readStatusMap(activeCase.id), [row.id]: status };
    const allStatuses = loadState(key("documentRequestStatuses"), {});
    saveState(key("documentRequestStatuses"), { ...allStatuses, [activeCase.id]: nextForCase });
    setStatusMap(nextForCase);
    appendRequestAction(activeCase.id, row, status);
    notifyLocalRuntime();
  }

  return (
    <section className="faDocumentWorkflow faGlass" aria-label="Document request workflow">
      <div className="faDocWorkflowHeader">
        <div>
          <span className="faEyebrow">Document Request Workflow</span>
          <h3>Evidence requests before determination</h3>
          <p>
            Track missing, received, and review-needed documents without turning Evidence Center into a tool drawer or revealing the answer early.
          </p>
        </div>
        <strong>📄✨</strong>
      </div>

      <div className="faDocWorkflowStats" aria-label="Document request summary">
        <span><b>{rows.length}</b> request rows</span>
        <span><b>{counts.Received || 0}</b> received</span>
        <span><b>{(counts.Requested || 0) + (counts.Missing || 0)}</b> open / missing</span>
        <span><b>{counts["Pending Review"] || 0}</b> pending review</span>
      </div>

      <div className="faDocWorkflowRows">
        {rows.map((row) => (
          <article className="faDocWorkflowRow" key={row.id}>
            <div className="faDocWorkflowMain">
              <strong>{row.name}</strong>
              <p>{row.reason}</p>
              <small>Linked tool: {row.linkedTool}</small>
            </div>

            <div className="faDocWorkflowControl">
              <label>
                <span>Status</span>
                <select value={row.status} onChange={(event) => updateStatus(row, event.target.value)}>
                  {DOCUMENT_REQUEST_STATUSES.map((status) => (
                    <option value={status} key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={() => updateStatus(row, nextDocumentRequestStatus(row.status))}>
                Next status
              </button>
            </div>

            <div className="faDocWorkflowMeta">
              <span className="faDocStatusPill" data-tone={documentRequestTone(row.status)}>{row.status}</span>
              <small>{row.required}</small>
              <small>{row.due}</small>
              <em>{row.authenticityFlag}</em>
            </div>
          </article>
        ))}
      </div>

      <p className="faMuted">
        Training-safe rule: request only lane-relevant fictional documents, keep IDs masked, and use this workflow as process evidence, not a verdict machine.
      </p>
    </section>
  );
}

function readStatusMap(caseId) {
  if (!caseId) return {};
  const allStatuses = loadState(key("documentRequestStatuses"), {});
  return allStatuses[caseId] || {};
}

function appendRequestAction(caseId, row, status) {
  const currentLog = loadState(key("actionLog"), {});
  const action = {
    actionId: `${caseId}-${Date.now()}-RequestDocs-${row.id}`,
    performedAt: new Date().toISOString(),
    actionType: "RequestDocs",
    outcome: `${row.name} set to ${status}`,
    xpDelta: ["Received", "Pending Review", "Approved"].includes(status) ? 4 : 2,
    confidenceDelta: 0.01,
    notes: "Document Request Workflow updated",
    metadata: {
      documentName: row.name,
      status,
      linkedTool: row.linkedTool,
      required: row.required
    }
  };

  saveState(key("actionLog"), {
    ...currentLog,
    [caseId]: [action, ...(currentLog[caseId] || [])].slice(0, 24)
  });
}

function notifyLocalRuntime() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
}
