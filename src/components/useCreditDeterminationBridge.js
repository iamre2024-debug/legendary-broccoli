import { useEffect } from "react";
import { buildCreditDecisionRail } from "../data/creditDecisionRail.js";
import { loadState, saveState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

function readDeterminations() {
  return loadState(key("determinations"), {});
}

function saveCreditDetermination(caseId, outcome) {
  if (!caseId || !outcome) return;
  saveState(key("determinations"), { ...readDeterminations(), [caseId]: outcome });
}

function currentPageIsDetermination() {
  return loadState(key("page"), "dashboard") === "determination";
}

export function useCreditDeterminationBridge(activeCaseSnapshot, refreshActiveCaseSnapshot) {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return undefined;

    const rail = buildCreditDecisionRail(activeCaseSnapshot);
    if (!rail) return undefined;

    function syncCreditDeterminationPanel() {
      if (!currentPageIsDetermination()) return;

      const optionGrid = document.querySelector(".faOptionGrid");
      if (!optionGrid) return;

      optionGrid.classList.add("faCreditDecisionGrid");
      optionGrid.setAttribute("aria-label", `${rail.title} outcome choices`);

      const selected = readDeterminations()[rail.caseId];
      const buttons = Array.from(optionGrid.querySelectorAll("button"));

      buttons.forEach((button, index) => {
        const outcome = rail.outcomes[index];
        if (!outcome) {
          button.hidden = true;
          button.setAttribute("aria-hidden", "true");
          return;
        }

        const guide = rail.outcomeGuide.find((item) => item.label === outcome);
        button.hidden = false;
        button.dataset.creditOutcome = outcome;
        button.classList.toggle("active", selected === outcome);
        button.classList.add("faCreditDecisionOption");
        button.innerHTML = `<strong>${outcome}</strong><small>${guide?.useWhen || "Use only if the credit evidence and reason narrative support it."}</small>`;
        button.setAttribute("aria-label", `${outcome}. Credit-safe determination option.`);
      });

      if (!document.querySelector(".faCreditDecisionNotice")) {
        const notice = document.createElement("aside");
        notice.className = "faCreditDecisionNotice";
        notice.innerHTML = `<span>Credit decision rail</span><strong>${rail.decisionQuestion}</strong><p>${rail.reasonNarrativePrompt}</p>`;
        optionGrid.parentElement?.insertBefore(notice, optionGrid);
      }
    }

    function handleCreditDeterminationClick(event) {
      const button = event.target?.closest?.("button[data-credit-outcome]");
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      const outcome = button.dataset.creditOutcome;
      saveCreditDetermination(rail.caseId, outcome);
      refreshActiveCaseSnapshot?.();
      button.closest(".faOptionGrid")?.querySelectorAll("button[data-credit-outcome]").forEach((item) => item.classList.toggle("active", item === button));
      window.setTimeout(() => window.location.reload(), 80);
    }

    syncCreditDeterminationPanel();
    const interval = window.setInterval(syncCreditDeterminationPanel, 500);
    document.addEventListener("click", handleCreditDeterminationClick, true);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("click", handleCreditDeterminationClick, true);
    };
  }, [activeCaseSnapshot, refreshActiveCaseSnapshot]);
}
