import { useEffect, useMemo, useState } from "react";
import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import { CLAIM_FAMILIES } from "./data/fraudAcademyEngine.js";
import { buildCreditDecisionRail } from "./data/creditDecisionRail.js";
import { generateMatrixCase } from "./data/matrixCaseAdapter.js";
import { loadState, saveState } from "./utils/storage.js";
import "./matrixBridge.css";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;
const DEFAULT_LANES = ["RANDOM", "ATO", "FRAUD_CHARGEBACK", "NON_FRAUD_CHARGEBACK", "FIRST_PARTY", "PAYROLL", "BEC", "CREDIT_RISK", "BUSINESS_BUSTOUT", "APPLICATION", "ACH_WIRE_CHECK"];

function readCases() {
  return loadState(key("cases"), []);
}

function readActiveCaseSnapshot() {
  const cases = readCases();
  const activeCaseId = loadState(key("activeCaseId"), cases[0]?.id);
  return cases.find((item) => item.id === activeCaseId) || cases[0] || null;
}

function writeMatrixCases(lane = "RANDOM", count = 1) {
  const seed = Date.now();
  const generated = Array.from({ length: count }, (_, index) => generateMatrixCase(lane, seed + index));
  const existing = readCases();

  saveState(key("cases"), [...generated, ...existing]);
  saveState(key("activeCaseId"), generated[0]?.id);
  saveState(key("page"), "briefing");

  return generated;
}

function legacyGenerateCount(label = "") {
  const normalized = String(label).replace(/\s+/g, " ").trim().toLowerCase();

  if (normalized.includes("+5") || normalized.includes("generate five")) return 5;
  if (normalized.includes("generate claim") || normalized.includes("generate one")) return 1;

  return null;
}

export default function AppWorkstationMatrixBridge() {
  const [lane, setLane] = useState("RANDOM");
  const [lastBatch, setLastBatch] = useState(null);
  const [activeCaseSnapshot, setActiveCaseSnapshot] = useState(() => readActiveCaseSnapshot());

  const laneOptions = useMemo(() => {
    const known = Object.keys(CLAIM_FAMILIES);
    return Array.from(new Set([...DEFAULT_LANES, ...known]));
  }, []);

  function generate(count, source = "matrix-dock") {
    const batch = writeMatrixCases(lane, count);
    setLastBatch({ count, lane, scenarioId: batch[0]?.scenarioId, source });
    setActiveCaseSnapshot(batch[0] || readActiveCaseSnapshot());

    if (typeof window !== "undefined") {
      window.setTimeout(() => window.location.reload(), 160);
    }
  }

  useEffect(() => {
    function refreshSnapshot() {
      setActiveCaseSnapshot(readActiveCaseSnapshot());
    }

    refreshSnapshot();

    if (typeof window === "undefined") return undefined;

    const interval = window.setInterval(refreshSnapshot, 1200);
    window.addEventListener("click", refreshSnapshot, true);
    window.addEventListener("storage", refreshSnapshot);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refreshSnapshot, true);
      window.removeEventListener("storage", refreshSnapshot);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    function routeLegacyGenerateButton(event) {
      const button = event.target?.closest?.("button");
      if (!button || button.closest(".faMatrixBridgeDock")) return;

      const count = legacyGenerateCount(button.textContent);
      if (!count) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      generate(count, "workstation-generate-button");
    }

    document.addEventListener("click", routeLegacyGenerateButton, true);
    return () => document.removeEventListener("click", routeLegacyGenerateButton, true);
  }, [lane]);

  return (
    <>
      <AppWorkstationV3 />
      <aside className="faMatrixBridgeDock" aria-label="Matrix case generator bridge">
        <div>
          <span className="faEyebrow">Matrix engine</span>
          <strong>Live case bridge ✨</strong>
          <small>Creates lane-pure, scenario-sourced cases. V3 generate buttons are routed here too.</small>
        </div>
        <label>
          <span>Lane</span>
          <select value={lane} onChange={(event) => setLane(event.target.value)}>
            {laneOptions.map((value) => (
              <option value={value} key={value}>
                {value === "RANDOM" ? "Random matrix lane" : CLAIM_FAMILIES[value] || value}
              </option>
            ))}
          </select>
        </label>
        <div className="faMatrixBridgeActions">
          <button type="button" onClick={() => generate(1)}>Matrix +1</button>
          <button type="button" onClick={() => generate(5)}>Matrix +5</button>
        </div>
        {lastBatch && (
          <p>
            Added {lastBatch.count} {lastBatch.lane === "RANDOM" ? "random" : CLAIM_FAMILIES[lastBatch.lane] || lastBatch.lane} case{lastBatch.count > 1 ? "s" : ""}. {lastBatch.source === "workstation-generate-button" ? "Routed from the workstation generate button." : `Opening ${lastBatch.scenarioId}.`}
          </p>
        )}
        <CreditRailMini activeCase={activeCaseSnapshot} />
      </aside>
    </>
  );
}

function CreditRailMini({ activeCase }) {
  const rail = buildCreditDecisionRail(activeCase);
  if (!rail) return null;

  const previewOutcomes = (rail.outcomeGuide?.length ? rail.outcomeGuide : rail.outcomes.map((label) => ({ label, useWhen: "Use only if the evidence and reason-code narrative support it." }))).slice(0, 4);

  return (
    <section className="faCreditRailMini" aria-label="Credit decision rail">
      <div className="faCreditRailHeader">
        <span className="faEyebrow">Credit rail</span>
        <strong>{rail.title}</strong>
        <small>{rail.caseFamily} · {rail.subtype}</small>
      </div>
      <p className="faCreditRailQuestion"><strong>Decision question</strong>{rail.decisionQuestion}</p>
      <div className="faCreditRailPills">
        <span>{rail.applicationStatus}</span>
        <span>{rail.evidenceProgress}% evidence mapped</span>
        <span>{rail.evidenceStatusLabel}</span>
      </div>
      <p>{rail.sla}</p>
      <div className="faCreditRailList">
        <small>Missing / needs review</small>
        {rail.missingDocs.slice(0, 3).map((item) => <em key={item}>{item}</em>)}
      </div>
      <div className="faCreditOutcomePreview" aria-label="Credit-safe outcome preview">
        <small>Credit-safe outcomes, not pay / deny claim labels</small>
        {previewOutcomes.map((item) => (
          <span key={item.label}>
            <b>{item.label}</b>
            <small>{item.useWhen}</small>
          </span>
        ))}
      </div>
      <p className="faCreditRailPrompt">{rail.reasonNarrativePrompt}</p>
      <details>
        <summary>Reason-code guardrails</summary>
        {rail.reasonCodeDrafts.map((item) => <p key={item}>{item}</p>)}
        {rail.guardrails.map((item) => <p key={item}>{item}</p>)}
      </details>
    </section>
  );
}
