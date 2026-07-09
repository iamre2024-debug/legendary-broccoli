import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { getLaneIndicatorFilter } from "../data/phase2AIndicatorLanes.js";
import { buildActiveCaseState } from "../data/workstationRuntimeState.js";
import { useWorkstationSnapshot } from "../hooks/useWorkstationSnapshot.js";

function textOf(element) {
  return (element?.textContent || "").replace(/\s+/g, " ").trim();
}

function sectionType(section) {
  const label = textOf(section.querySelector(".faEyebrow"));
  if (/Suspicious/i.test(label)) return "suspicious";
  if (/Normal/i.test(label)) return "normal";
  return null;
}

function applyLaneFilter(filter) {
  const sections = Array.from(document.querySelectorAll(".faGlass"));
  let touched = 0;

  for (const section of sections) {
    const type = sectionType(section);
    if (!type) continue;

    const allowed = filter[type];
    const rows = Array.from(section.querySelectorAll(".faCheckboxRow"));
    for (const row of rows) {
      const label = textOf(row.querySelector("span")) || textOf(row);
      const keep = allowed.has(label);
      row.hidden = !keep;
      row.dataset.phase2aLaneFiltered = keep ? "visible" : "hidden";
      touched += 1;
    }
  }

  document.body.classList.toggle("faLaneIndicatorFilterReady", touched > 0);
}

export default function LaneIndicatorFilterRuntime() {
  const { snapshot } = useWorkstationSnapshot({ intervalMs: 500 });
  const activeCase = snapshot.activeCase;
  const activeState = buildActiveCaseState(snapshot);
  const isIndicatorsPage = snapshot.page === "indicators";
  const filter = useMemo(() => getLaneIndicatorFilter(activeCase?.lane, activeState.indicators), [activeCase?.lane, activeState.indicators]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!isIndicatorsPage || !activeCase) {
      document.body.classList.remove("faLaneIndicatorFilterReady");
      document.querySelectorAll(".faCheckboxRow[data-phase2a-lane-filtered]").forEach((row) => {
        row.hidden = false;
        delete row.dataset.phase2aLaneFiltered;
      });
      return undefined;
    }

    applyLaneFilter(filter);
    const interval = window.setInterval(() => applyLaneFilter(filter), 350);
    return () => window.clearInterval(interval);
  }, [activeCase, filter, isIndicatorsPage]);

  if (!isIndicatorsPage || !activeCase) return null;

  const panel = document.querySelector(".faPagePanel .faStack");
  if (!panel) return null;

  const suspiciousCount = filter.suspicious.size;
  const normalCount = filter.normal.size;

  return createPortal(
    <section className="faLaneIndicatorGuide faGlass" aria-label="Lane-specific indicator guide">
      <div>
        <span className="faEyebrow">Lane-specific indicators</span>
        <h3>{activeCase.title}</h3>
        <p>
          Indicator choices are filtered to this claim lane so the review stays evidence-first and avoids irrelevant checklist noise.
        </p>
      </div>
      <div className="faLaneIndicatorStats">
        <span><strong>{suspiciousCount}</strong><small>suspicious options</small></span>
        <span><strong>{normalCount}</strong><small>normal options</small></span>
      </div>
    </section>,
    panel
  );
}
