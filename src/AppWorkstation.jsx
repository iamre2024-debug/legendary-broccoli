import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import { validateMatrixCaseAdapter } from "./data/matrixCaseAdapter.js";
import { validateMatrixScenarioRegistry } from "./data/matrixScenarioRegistry.js";

const matrixScenarioStatus = validateMatrixScenarioRegistry();
const matrixCaseAdapterStatus = validateMatrixCaseAdapter("ATO");

if ((!matrixScenarioStatus.readyForGeneratorAdapter || !matrixCaseAdapterStatus.readyForGeneratorAdapter) && typeof console !== "undefined") {
  console.warn("Fraud Academy matrix generator foundation needs attention:", {
    matrixScenarioStatus,
    matrixCaseAdapterStatus
  });
}

export default AppWorkstationV3;
