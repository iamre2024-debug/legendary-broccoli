import { useEffect } from "react";
import { CLAIM_FAMILIES } from "../data/fraudAcademyEngine.js";
import { generateMatrixCase } from "../data/matrixCaseAdapter.js";
import { loadState, saveState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

const FAMILY_TO_LANE = Object.fromEntries(
  Object.entries(CLAIM_FAMILIES).map(([lane, label]) => [label, lane])
);

export default function MatrixGenerateRuntime() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    function routeGenerateButton(event) {
      const button = event.target?.closest?.("button");
      if (!button || button.closest(".faMatrixBridgeDock")) return;

      const count = generateCountFromLabel(button.textContent);
      if (!count) return;

      const lane = laneFromPage(button);
      const generated = writeMatrixCases(lane, count);
      if (!generated.length) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      notifyLocalRuntime();
      if (typeof window !== "undefined") {
        window.setTimeout(() => window.location.reload(), 120);
      }
    }

    document.addEventListener("click", routeGenerateButton, true);
    return () => document.removeEventListener("click", routeGenerateButton, true);
  }, []);

  return null;
}

function generateCountFromLabel(label = "") {
  const normalized = String(label).replace(/\s+/g, " ").trim().toLowerCase();
  if (!normalized.includes("generate") && !normalized.includes("+5")) return null;
  if (normalized.includes("+5") || normalized.includes("five")) return 5;
  if (normalized.includes("generate")) return 1;
  return null;
}

function laneFromPage(button) {
  const queuePanel = button.closest?.(".faToolbar") || document.querySelector(".faToolbar");
  const selectedFilter = queuePanel?.querySelector?.(".faFilterChip.selected")?.textContent?.trim();
  if (selectedFilter && selectedFilter !== "All") {
    return FAMILY_TO_LANE[selectedFilter] || selectedFilter;
  }
  return "RANDOM";
}

function writeMatrixCases(lane = "RANDOM", count = 1) {
  const seed = Date.now();
  const generated = Array.from({ length: count }, (_, index) => generateMatrixCase(lane, seed + index));
  const existing = loadState(key("cases"), []);

  saveState(key("cases"), [...generated, ...existing]);
  saveState(key("activeCaseId"), generated[0]?.id);
  saveState(key("page"), "briefing");

  return generated;
}

function notifyLocalRuntime() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
}
