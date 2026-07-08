import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toolNavByLane } from "../data/fraudAcademyEngine.js";
import { buildToolEvidence, resolveToolDefinition } from "../data/toolRegistry.js";
import { loadSavedReports, saveReportPreview } from "../data/savedReportCenter.js";
import { loadState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;
const toolPageIds = new Set(Object.values(toolNavByLane).flat().map((tool) => tool.id));

export default function ToolReportSaveRuntime() {
  const [snapshot, setSnapshot] = useState(() => readSnapshot());
  const [target, setTarget] = useState(() => findToolReportTarget());
  const [savedReportId, setSavedReportId] = useState("");

  const currentToolId = toolPageIds.has(snapshot.page) ? snapshot.page : "";
  const activeCase = snapshot.activeCase;
  const currentReport = useMemo(() => buildCurrentReport(activeCase, currentToolId), [activeCase, currentToolId]);
  const shouldShow = Boolean(target && activeCase && currentToolId && currentReport);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => {
      setSnapshot(readSnapshot());
      setTarget(findToolReportTarget());
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

  useEffect(() => {
    setSavedReportId("");
  }, [activeCase?.id, currentToolId]);

  function handleSave() {
    if (!activeCase || !currentReport) return;
    const saved = saveReportPreview({
      activeCase,
      preview: currentReport.preview,
      source: "tool-report",
      sourceRecord: currentReport.sourceRecord,
      query: currentToolId
    });
    setSavedReportId(saved?.reportId || "");
    if (typeof window !== "undefined") window.dispatchEvent(new Event("storage"));
  }

  if (!shouldShow) return null;

  return createPortal(
    <section className="faGlass faToolReportSaveDock" aria-label="Save tool report">
      <div>
        <span className="faEyebrow">Report Center</span>
        <h4>Save this report preview</h4>
        <p>{currentReport.preview.subtitle}</p>
      </div>
      <button type="button" onClick={handleSave}>Save this report</button>
      {savedReportId && <small>Saved to Report Center ✓</small>}
    </section>,
    target
  );
}

function readSnapshot() {
  const cases = loadState(key("cases"), []);
  const completed = loadState(key("completed"), []);
  const activeCaseId = loadState(key("activeCaseId"), cases[0]?.id);
  const activeCase = cases.find((item) => item.id === activeCaseId) || cases.find((item) => !completed.includes(item.id)) || cases[0] || null;

  return {
    activeCase,
    page: loadState(key("page"), "dashboard"),
    reports: loadSavedReports()
  };
}

function findToolReportTarget() {
  if (typeof document === "undefined") return null;
  return document.querySelector(".faReportShell") || document.querySelector(".faPagePanel .faStack");
}

function buildCurrentReport(activeCase, toolId) {
  if (!activeCase || !toolId) return null;
  const definition = resolveToolDefinition(toolId);
  const rawTool = activeCase.tools?.[toolId] || {};
  const evidence = buildToolEvidence({ toolId, lane: activeCase.lane, caseId: activeCase.id, tool: rawTool });
  const sections = normalizeSections(evidence.reportSections);

  return {
    preview: {
      title: evidence.reportTitle || `${definition.title} Report`,
      subtitle: `${definition.title} evidence preview for ${activeCase.title}.`,
      matchStatus: evidence.reportEligible ? "Report Ready" : "Snapshot Saved",
      tone: evidence.riskSignals?.length ? "review" : "neutral",
      sections: sections.length ? sections : fallbackSections(evidence)
    },
    sourceRecord: {
      id: `${activeCase.id}-${toolId}`,
      type: definition.title,
      label: evidence.categoryLabel,
      primaryValue: evidence.summary,
      reportKind: evidence.reportEligible ? "report" : "snapshot"
    }
  };
}

function normalizeSections(sections = []) {
  if (!Array.isArray(sections)) return [];
  return sections.map((section, index) => ({
    title: section.title || `Report section ${index + 1}`,
    items: Array.isArray(section.items) ? section.items.map((item) => String(item)).filter(Boolean) : []
  })).filter((section) => section.items.length);
}

function fallbackSections(evidence) {
  return [
    { title: "Evidence rows", items: (evidence.rows || []).slice(0, 8).map((row) => `${row.label}: ${row.value}`) },
    { title: "Timeline", items: (evidence.timeline || []).slice(0, 6).map((event) => `${event.time}: ${event.text}`) },
    { title: "Next actions", items: evidence.nextActions || [] }
  ];
}
