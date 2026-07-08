import { toolNavByLane } from "./fraudAcademyEngine.js";
import { loadState, saveState } from "../utils/storage.js";

export const WORKSTATION_STORE = "fa-v3-interactive-investigator";
export const WORKSTATION_STORAGE_EVENT = "fa-workstation-runtime-updated";
export const EMPTY_INDICATORS = { suspicious: [], normal: [] };

export const workstationKey = (name) => `${WORKSTATION_STORE}:${name}`;

export function readWorkstationSnapshot() {
  const cases = loadState(workstationKey("cases"), []);
  const completed = loadState(workstationKey("completed"), []);
  const activeCaseId = loadState(workstationKey("activeCaseId"), cases[0]?.id);
  const activeCase = cases.find((item) => item.id === activeCaseId) || cases.find((item) => !completed.includes(item.id)) || cases[0] || null;

  return {
    cases,
    completed,
    activeCase,
    activeCaseId,
    page: loadState(workstationKey("page"), "dashboard"),
    reviewedTools: loadState(workstationKey("reviewedTools"), {}),
    indicators: loadState(workstationKey("indicatorChecks"), {}),
    determinations: loadState(workstationKey("determinations"), {}),
    justifications: loadState(workstationKey("justifications"), {}),
    actionLog: loadState(workstationKey("actionLog"), {})
  };
}

export function buildActiveCaseState(snapshot) {
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

export function progressFor(activeCase, reviewedTools = [], indicators = EMPTY_INDICATORS, determination = "") {
  const laneTools = toolNavByLane[activeCase?.lane] || [];
  const toolProgress = laneTools.length ? (reviewedTools.length / laneTools.length) * 55 : 0;
  const indicatorProgress = ((indicators.suspicious?.length || 0) + (indicators.normal?.length || 0)) > 0 ? 20 : 0;
  const determinationProgress = determination ? 25 : 0;
  return Math.min(100, Math.round(toolProgress + indicatorProgress + determinationProgress));
}

export function writeCaseMap(name, caseId, value) {
  const current = loadState(workstationKey(name), {});
  saveState(workstationKey(name), { ...current, [caseId]: value });
  notifyWorkstationRuntime();
}

export function appendAction(caseId, action) {
  if (!caseId || !action) return;
  const currentLog = loadState(workstationKey("actionLog"), {});
  saveState(workstationKey("actionLog"), {
    ...currentLog,
    [caseId]: [action, ...(currentLog[caseId] || [])].slice(0, 24)
  });
  notifyWorkstationRuntime();
}

export function notifyWorkstationRuntime() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event(WORKSTATION_STORAGE_EVENT));
}
