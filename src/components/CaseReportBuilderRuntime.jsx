import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toolNavByLane } from "../data/fraudAcademyEngine.js";
import { loadSavedReports, reportsForCase } from "../data/savedReportCenter.js";
import { readWorkstationSnapshot } from "../data/workstationRuntimeState.js";
import { loadState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

export default function CaseReportBuilderRuntime() {
  const [snapshot, setSnapshot] = useState(() => readWorkstationSnapshot());
  const [target, setTarget] = useState(() => findTarget());
  const [copied, setCopied] = useState(false);

  const activeCase = snapshot.activeCase;
  const notesMap = loadState(key("notes"), {});
  const notes = activeCase ? notesMap[activeCase.id] || "" : "";
  const reports = useMemo(() => reportsForCase(activeCase?.id, loadSavedReports()), [activeCase?.id, snapshot.page]);
  const report = useMemo(() => buildCaseReport({ snapshot, notes, reports }), [snapshot, notes, reports]);
  const shouldShow = Boolean(target && snapshot.page === "summary" && activeCase);

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

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  async function copyReport() {
    if (!report.text || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(report.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (!shouldShow) return null;

  return createPortal(
    <section className="faGlass faCaseReportBuilder" aria-label="Case report draft builder">
      <div className="faCaseReportHeader">
        <div>
          <span className="faEyebrow">Case Report Draft</span>
          <h3>Investigator report before determination</h3>
          <p>Builds from reviewed tools, saved reports, document actions, indicators, and notes. This is not Report Center and not the senior debrief.</p>
        </div>
        <button type="button" onClick={copyReport}>{copied ? "Copied ✓" : "Copy draft"}</button>
      </div>

      <div className="faCaseReportStats">
        <span><b>{report.reviewedCount}</b>tools reviewed</span>
        <span><b>{reports.length}</b>saved reports</span>
        <span><b>{report.docActions.length}</b>doc/report actions</span>
      </div>

      <div className="faCaseReportGrid">
        <ReportSection title="Case posture" items={report.posture} />
        <ReportSection title="Evidence reviewed" items={report.evidenceReviewed} />
        <ReportSection title="Saved reports referenced" items={report.savedReportItems} empty="No reports saved yet." />
        <ReportSection title="Action impact" items={report.actionItems} empty="No report or document actions logged yet." />
        <ReportSection title="Investigator notes" items={report.noteItems} empty="No investigator notes written yet." />
        <ReportSection title="Open gaps" items={report.openGaps} />
      </div>

      <p className="faCaseReportGuardrail">Draft-only guardrail: no senior reference, QA score, or correct answer appears here. Those stay locked until Determination and Senior Evidence Debrief.</p>
    </section>,
    target
  );
}

function ReportSection({ title, items = [], empty = "No items yet." }) {
  return (
    <section className="faCaseReportSection">
      <h4>{title}</h4>
      {items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="faMuted">{empty}</p>}
    </section>
  );
}

function buildCaseReport({ snapshot, notes, reports }) {
  const activeCase = snapshot.activeCase || {};
  const laneTools = toolNavByLane[activeCase.lane] || [];
  const reviewed = snapshot.reviewedTools?.[activeCase.id] || [];
  const indicators = snapshot.indicators?.[activeCase.id] || { suspicious: [], normal: [] };
  const actions = snapshot.actionLog?.[activeCase.id] || [];
  const docActions = actions.filter((action) => ["ReportSaved", "ReportDeleted", "RequestDocs"].includes(action.actionType));
  const missingTools = laneTools.filter((tool) => !reviewed.includes(tool.id));

  const posture = [
    `Case: ${activeCase.id || "Pending"} · ${activeCase.title || "Training case"}`,
    `Subtype: ${activeCase.subtype || "Subtype pending"}`,
    `Exposure: ${activeCase.exposure || "Exposure pending"}`,
    `Customer/business: ${activeCase.profile?.name || "Profile pending"} · ${activeCase.profile?.customerId || "ID pending"}`
  ];

  const evidenceReviewed = reviewed.length
    ? reviewed.map((toolId) => `${toolLabel(laneTools, toolId)} reviewed and available for determination support.`)
    : ["No lane tools have been marked reviewed yet."];

  const savedReportItems = reports.slice(0, 6).map((report) => `${report.title} · ${report.matchStatus} · ${formatTime(report.savedAt)}`);
  const actionItems = docActions.slice(0, 8).map((action) => `${action.actionType}: ${action.outcome}`);
  const noteItems = notes.trim() ? notes.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 8) : [];

  const openGaps = [
    ...missingTools.slice(0, 6).map((tool) => `${tool.label || tool.id} not marked reviewed.`),
    ...(reports.length ? [] : ["No report has been saved to Report Center for this case yet."]),
    ...(notes.trim() ? [] : ["Investigator notes are still empty."]),
    ...((indicators.suspicious?.length || indicators.normal?.length) ? [] : ["Indicators have not been selected yet."])
  ];

  const text = [
    "CASE REPORT DRAFT",
    ...posture,
    "",
    "Evidence reviewed:",
    ...evidenceReviewed.map((item) => `- ${item}`),
    "",
    "Saved reports:",
    ...(savedReportItems.length ? savedReportItems : ["No saved reports yet."]).map((item) => `- ${item}`),
    "",
    "Action impact:",
    ...(actionItems.length ? actionItems : ["No report/document actions logged yet."]).map((item) => `- ${item}`),
    "",
    "Notes:",
    ...(noteItems.length ? noteItems : ["No notes yet."]).map((item) => `- ${item}`),
    "",
    "Open gaps:",
    ...(openGaps.length ? openGaps : ["No open gaps listed."]).map((item) => `- ${item}`)
  ].join("\n");

  return { posture, evidenceReviewed, savedReportItems, actionItems, noteItems, openGaps, docActions, reviewedCount: reviewed.length, text };
}

function toolLabel(laneTools, toolId) {
  return laneTools.find((tool) => tool.id === toolId)?.label || toolId;
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved locally";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function findTarget() {
  if (typeof document === "undefined") return null;
  return document.querySelector(".faPagePanel .faStack") || document.querySelector(".faPagePanel");
}
