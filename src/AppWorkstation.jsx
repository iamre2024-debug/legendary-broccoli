import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import { validateMatrixScenarioRegistry } from "./data/matrixScenarioRegistry.js";

const matrixScenarioStatus = validateMatrixScenarioRegistry();

if (!matrixScenarioStatus.readyForGeneratorAdapter && typeof console !== "undefined") {
  console.warn("Fraud Academy matrix scenario registry needs attention:", matrixScenarioStatus);
}

export default AppWorkstationV3;
