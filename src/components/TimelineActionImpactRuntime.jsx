import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { REPORT_CENTER_GUARDRAIL, REPORT_CENTER_UPDATED_EVENT } from "../data/savedReportCenter.js";
import { readWorkstationSnapshot, WORKSTATION_STORAGE_EVENT } from "../data/workstationRuntimeState.js";

export default function TimelineActionImpactRuntime() {
  const [snapshot, setSnapshot] = useState(() => readWorkstationSnapshot());
  const [target, setTarget] = useState(() => findTarget());

  const actions = useMemo(() => {
    const caseId = snapshot.activeCase?.id;
    if (!caseId) return [];
    return Array.isArray(snapshot.actionLog[caseId]) ? snapshot.actionLog[caseId] : [];
  }, [snapshot.activeCase?.id, snapshot.actionLog]);

  const shouldShow = Boolean(target && snapshot.page === "timeline" && snapshot.activeCase);
  const reportActions = actions.filter((action) => ["ReportSaved", "ReportDeleted", "RequestDocs"].includes(action.actionType));
  const otherActions = actions.filter((action) => !["ReportSaved", "ReportDeleted", "RequestDocs"].includes(action.actionType));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => {
      setSnapshot(readWorkstationSnapshot());
      setTarget(findTarget());
    };

    refresh();
    const interval = window.setInterval(refresh, 700);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);
    window.addEventListener(REPORT_CENTER_UPDATED_EVENT, refresh);
    window.addEventListener(WORKSTATION_STORAGE_EVENT, refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(REPORT_CENTER_UPDATED_EVENT, refresh);
      window.removeEventListener(WORKSTATION_STORAGE_EVENT, refresh);
    };
  }, []);

  if (!shouldShow) return null;

  return createPortal(
    <section className="faGlass faTimelineRuntime" aria-label="Live action impact history">
      <div className="faTimelineRuntimeHeader">
        <div>
          <span className="faEyebrow">Live Action Impact</span>
          <h3>Report and document actions</h3>
          <p>Runtime-created report saves, deletes, and document request updates refresh here without needing a page reload.</p>
        </div>
        <strong>{actions.length}</strong>
      </div>

      <div className="faTimelineRuntimeGrid">
        <RuntimeActionColumn title="Report / document actions" actions={reportActions} empty="Save a report or update document requests to see it here." />
        <RuntimeActionColumn title="Other investigator actions" actions={otherActions.slice(0, 6)} empty="Open tools, select indicators, or submit a determination to build the rest of the trail." />
      </div>

      <p className="faTimelineRuntimeGuardrail">{REPORT_CENTER_GUARDRAIL}</p>
    </section>,
    target
  );
}

function RuntimeActionColumn({ title, actions = [], empty }) {
  return (
    <section className="faTimelineRuntimeColumn">
      <span className="faEyebrow">{title}</span>
      {actions.length ? actions.map((action) => <RuntimeAction action={action} key={action.actionId} />) : <p className="faMuted">{empty}</p>}
    </section>
  );
}

function RuntimeAction({ action }) {
  const meta = action.metadata || {};

  return (
    <article className="faTimelineRuntimeAction" data-action={action.actionType || "Action"}>
      <div>
        <strong>{formatActionLabel(action)}</strong>
        <span>{formatTime(action.performedAt)}</span>
      </div>
      <p>{action.outcome || action.notes || "Action saved to the local training trail."}</p>
      {!!Object.keys(meta).length && (
        <small>
          {meta.reportTitle || meta.toolId || meta.label || meta.source || "Metadata saved"}
          {meta.matchStatus ? ` · ${meta.matchStatus}` : ""}
          {meta.query ? ` · Query: ${meta.query}` : ""}
        </small>
      )}
    </article>
  );
}

function findTarget() {
  if (typeof document === "undefined") return null;
  return document.querySelector(".faPagePanel .faStack") || document.querySelector(".faPagePanel");
}

function formatActionLabel(action = {}) {
  if (action.actionType === "ReportSaved") return "Report saved";
  if (action.actionType === "ReportDeleted") return "Report deleted";
  if (action.actionType === "RequestDocs") return "Docs updated";
  if (action.actionType === "SubmitDecision") return "Determination";
  if (action.actionType === "MarkToolReviewed") return "Tool reviewed";
  if (action.actionType === "SelectIndicator") return "Indicator selected";
  if (action.actionType === "OpenCase") return "Case opened";
  if (action.actionType === "GenerateCase") return "Case generated";
  return action.actionType || "Action";
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved locally";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
