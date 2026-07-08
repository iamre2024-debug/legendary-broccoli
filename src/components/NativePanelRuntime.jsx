import { useMemo } from "react";
import { createPortal } from "react-dom";
import Customer360DossierPanel from "./Customer360DossierPanel.jsx";
import DeterminationPanel from "./DeterminationPanel.jsx";
import DocumentRequestWorkflowPanel from "./DocumentRequestWorkflowPanel.jsx";
import LookupReportLauncherPanel from "./LookupReportLauncherPanel.jsx";
import RightRailPanel from "./RightRailPanel.jsx";
import { saveState } from "../utils/storage.js";
import { useNativeBodyClasses, useNativePortalTargets } from "../hooks/useNativePortalTargets.js";
import { useWorkstationSnapshot } from "../hooks/useWorkstationSnapshot.js";
import {
  appendAction,
  buildActiveCaseState,
  workstationKey,
  writeCaseMap as writeRuntimeCaseMap
} from "../data/workstationRuntimeState.js";

export default function NativePanelRuntime() {
  const { snapshot, refresh: refreshSnapshot } = useWorkstationSnapshot({ intervalMs: 600 });
  const targets = useNativePortalTargets();

  const caseState = useMemo(() => buildActiveCaseState(snapshot), [snapshot]);
  const nativeClassMap = useMemo(() => ({
    faNativeRailReady: Boolean(targets.grid && snapshot.activeCase),
    faNativeDeterminationReady: Boolean(targets.pagePanel && snapshot.page === "determination" && snapshot.activeCase),
    faNativeCustomer360Ready: Boolean(targets.pagePanel && snapshot.page === "customer360" && snapshot.activeCase),
    faNativeDocumentWorkflowReady: Boolean(targets.pagePanel && snapshot.page === "summary" && snapshot.activeCase)
  }), [targets.grid, targets.pagePanel, snapshot.activeCase, snapshot.page]);

  useNativeBodyClasses(nativeClassMap);

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
            setDetermination={(value) => writeCaseMap("determinations", snapshot.activeCase.id, value, refreshSnapshot)}
            setJustification={(value) => writeCaseMap("justifications", snapshot.activeCase.id, value, refreshSnapshot)}
            completeCase={() => completeCase(snapshot, caseState.determination, refreshSnapshot)}
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
        <div className="faNativeDocumentWorkflowSlot" aria-label="Document request workflow slot">
          <DocumentRequestWorkflowPanel activeCase={snapshot.activeCase} />
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

function writeCaseMap(name, caseId, value, refreshSnapshot) {
  writeRuntimeCaseMap(name, caseId, value);
  refreshSnapshot();
}

function completeCase(snapshot, determination, refreshSnapshot) {
  const activeCase = snapshot.activeCase;
  if (!activeCase) return;

  const completed = Array.from(new Set([...(snapshot.completed || []), activeCase.id]));
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

  saveState(workstationKey("completed"), completed);
  appendAction(activeCase.id, action);
  saveState(workstationKey("page"), "debrief");
  refreshSnapshot();

  if (typeof window !== "undefined") {
    window.setTimeout(() => window.location.reload(), 120);
  }
}
