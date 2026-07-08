import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Customer360DossierPanel from "./Customer360DossierPanel.jsx";
import DeterminationPanel from "./DeterminationPanel.jsx";
import DocumentRequestWorkflowPanel from "./DocumentRequestWorkflowPanel.jsx";
import LookupReportLauncherPanel from "./LookupReportLauncherPanel.jsx";
import RightRailPanel from "./RightRailPanel.jsx";
import SavedReportCenterPanel from "./SavedReportCenterPanel.jsx";
import { toolNavByLane } from "../data/fraudAcademyEngine.js";
import { loadState, saveState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;
const EMPTY_INDICATORS = { suspicious: [], normal: [] };

export default function NativePanelRuntime() {
  const [snapshot, setSnapshot] = useState(() => readSnapshot());
  const [targets, setTargets] = useState(() => findTargets());

  const caseState = useMemo(() => buildCaseState(snapshot), [snapshot]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => {
      setSnapshot(readSnapshot());
      setTargets(findTargets());
    };

    refresh();
    const interval = window.setInterval(refresh, 600);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const showRail = Boolean(targets.grid && snapshot.activeCase);
    const showDetermination = Boolean(targets.pagePanel && snapshot.page === "determination" && snapshot.activeCase);
    const showCustomer360 = Boolean(targets.pagePanel && snapshot.page === "customer360" && snapshot.activeCase);
    const showDocumentWorkflow = Boolean(targets.pagePanel && snapshot.page === "summary" && snapshot.activeCase);

    document.body.classList.toggle("faNativeRailReady", showRail);
    document.body.classList.toggle("faNativeDeterminationReady", showDetermination);
    document.body.classList.toggle("faNativeCustomer360Ready", showCustomer360);
    document.body.classList.toggle("faNativeDocumentWorkflowReady", showDocumentWorkflow);
    document.body.classList.toggle("faNativeReportCenterReady", showDocumentWorkflow);

    return () => {
      document.body.classList.remove("faNativeRailReady");
      document.body.classList.remove("faNativeDeterminationReady");
      document.body.classList.remove("faNativeCustomer360Ready");
      document.body.classList.remove("faNativeDocumentWorkflowReady");
      document.body.classList.remove("faNativeReportCenterReady");
    };
  }, [targets.grid, targets.pagePanel, snapshot.activeCase, snapshot.page]);

  if (!snapshot.activeCase) return null;

  const rail = targets.grid
    ? createPortal(
        <RightRailPanel
          activeCase={snapshot.activeCase}
          completed={snapshot.completed}
          reviewedTools={caseState.reviewedTools}
          indicators={caseState.indicators}
          caseCount={snapshot.cases.length}
          actions={caseState.actions}
          page={snapshot.page}
          progress={caseState.progress}
        />,
        targets.grid
      )
    : null;

  const determination = targets.pagePanel && snapshot.page === "determination"
    ? createPortal(
        <div className="faNativeDeterminationSlot" aria-label="Native determination panel">
          <DeterminationPanel
            activeCase={snapshot.activeCase}
            determination={caseState.determination}
            justification={caseState.justification}
            setDetermination={(value) => writeCaseMap("determinations", snapshot.activeCase.id, value, setSnapshot)}
            setJustification={(value) => writeCaseMap("justifications", snapshot.activeCase.id, value, setSnapshot)}
            completeCase={() => completeCase(snapshot, caseState.determination, setSnapshot)}
          />
        </div>,
        targets.pagePanel
      )
    : null;

  const customer360 = targets.pagePanel && snapshot.page === "customer360"
    ? createPortal(
        <div className="faNativeCustomer360Slot" aria-label="Customer 360 expanded dossier slot">
          <Customer360DossierPanel activeCase={snapshot.activeCase} />
          <LookupReportLauncherPanel activeCase={snapshot.activeCase} />
        </div>,
        targets.pagePanel
      )
    : null;

  const documentWorkflow = targets.pagePanel && snapshot.page === "summary"
    ? createPortal(
        <div className="faNativeDocumentWorkflowSlot" aria-label="Document request workflow and Report Center slot">
          <DocumentRequestWorkflowPanel activeCase={snapshot.activeCase} />
          <SavedReportCenterPanel activeCase={snapshot.activeCase} />
        </div>,
        targets.pagePanel
      )
    : null;

  return (
    <>
      {rail}
      {determination}
      {customer360}
      {documentWorkflow}
    </>
  );
}

function readSnapshot() {
  const cases = loadState(key("cases"), []);
  const completed = loadState(key("completed"), []);
  const activeCaseId = loadState(key("activeCaseId"), cases[0]?.id);
  const activeCase = cases.find((item) => item.id === activeCaseId) || cases.find((item) => !completed.includes(item.id)) || cases[0] || null;

  return {
    cases,
    completed,
    activeCase,
    page: loadState(key("page"), "dashboard"),
    reviewedTools: loadState(key("reviewedTools"), {}),
    indicators: loadState(key("indicatorChecks"), {}),
    determinations: loadState(key("determinations"), {}),
    justifications: loadState(key("justifications"), {}),
    actionLog: loadState(key("actionLog"), {})
  };
}

function buildCaseState(snapshot) {
  const activeCase = snapshot.activeCase;
  if (!activeCase) {
    return {
      reviewedTools: [],
      indicators: EMPTY_INDICATORS,
      actions: [],
      determination: "",
      justification: "",
      progress: 0
    };
  }

  const reviewedTools = snapshot.reviewedTools[activeCase.id] || [];
  const indicators = snapshot.indicators[activeCase.id] || EMPTY_INDICATORS;
  const determination = snapshot.determinations[activeCase.id] || "";

  return {
    reviewedTools,
    indicators,
    actions: snapshot.actionLog[activeCase.id] || [],
    determination,
    justification: snapshot.justifications[activeCase.id] || "",
    progress: progressFor(activeCase, reviewedTools, indicators, determination)
  };
}

function writeCaseMap(name, caseId, value, setSnapshot) {
  const current = loadState(key(name), {});
  saveState(key(name), { ...current, [caseId]: value });
  notifyLocalRuntime();
  setSnapshot(readSnapshot());
}

function completeCase(snapshot, determination, setSnapshot) {
  const activeCase = snapshot.activeCase;
  if (!activeCase) return;

  const completed = Array.from(new Set([...(snapshot.completed || []), activeCase.id]));
  const currentLog = loadState(key("actionLog"), {});
  const action = {
    actionId: `${activeCase.id}-${Date.now()}-SubmitDecision-native`,
    performedAt: new Date().toISOString(),
    actionType: "SubmitDecision",
    outcome: "Determination submitted through native panel and Luna debrief unlocked",
    xpDelta: 15,
    confidenceDelta: 0,
    notes: "Native determination panel submitted",
    metadata: { determination }
  };

  saveState(key("completed"), completed);
  saveState(key("actionLog"), {
    ...currentLog,
    [activeCase.id]: [action, ...(currentLog[activeCase.id] || [])].slice(0, 24)
  });
  saveState(key("page"), "debrief");
  notifyLocalRuntime();
  setSnapshot(readSnapshot());

  if (typeof window !== "undefined") {
    window.setTimeout(() => window.location.reload(), 120);
  }
}

function findTargets() {
  if (typeof document === "undefined") return { grid: null, pagePanel: null };

  return {
    grid: document.querySelector(".faContentGrid"),
    pagePanel: document.querySelector(".faPagePanel")
  };
}

function notifyLocalRuntime() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
}

function progressFor(activeCase, reviewedTools = [], indicators = EMPTY_INDICATORS, determination = "") {
  const laneTools = toolNavByLane[activeCase?.lane] || [];
  const toolProgress = laneTools.length ? (reviewedTools.length / laneTools.length) * 55 : 0;
  const indicatorProgress = ((indicators.suspicious?.length || 0) + (indicators.normal?.length || 0)) > 0 ? 20 : 0;
  const determinationProgress = determination ? 25 : 0;
  return Math.min(100, Math.round(toolProgress + indicatorProgress + determinationProgress));
}
