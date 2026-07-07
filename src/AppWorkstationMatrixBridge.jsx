import { useMemo, useState } from "react";
import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import { CLAIM_FAMILIES } from "./data/fraudAcademyEngine.js";
import { generateMatrixCase } from "./data/matrixCaseAdapter.js";
import { loadState, saveState } from "./utils/storage.js";
import "./matrixBridge.css";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;
const DEFAULT_LANES = ["RANDOM", "ATO", "FRAUD_CHARGEBACK", "NON_FRAUD_CHARGEBACK", "PAYROLL", "BEC", "CREDIT_RISK", "APPLICATION"];

function readCases() {
  return loadState(key("cases"), []);
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

export default function AppWorkstationMatrixBridge() {
  const [lane, setLane] = useState("RANDOM");
  const [lastBatch, setLastBatch] = useState(null);

  const laneOptions = useMemo(() => {
    const known = Object.keys(CLAIM_FAMILIES);
    return Array.from(new Set([...DEFAULT_LANES, ...known]));
  }, []);

  function generate(count) {
    const batch = writeMatrixCases(lane, count);
    setLastBatch({ count, lane, scenarioId: batch[0]?.scenarioId });

    if (typeof window !== "undefined") {
      window.setTimeout(() => window.location.reload(), 160);
    }
  }

  return (
    <>
      <AppWorkstationV3 />
      <aside className="faMatrixBridgeDock" aria-label="Matrix case generator bridge">
        <div>
          <span className="faEyebrow">Matrix engine</span>
          <strong>Live case bridge ✨</strong>
          <small>Creates lane-pure, scenario-sourced cases without answer reveal.</small>
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
            Added {lastBatch.count} {lastBatch.lane === "RANDOM" ? "random" : CLAIM_FAMILIES[lastBatch.lane] || lastBatch.lane} case{lastBatch.count > 1 ? "s" : ""}. Opening {lastBatch.scenarioId}.
          </p>
        )}
      </aside>
    </>
  );
}
