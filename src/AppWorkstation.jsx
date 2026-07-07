import AppWorkstationNativeBridge from "./AppWorkstationNativeBridge.jsx";
import { validateMatrixCaseAdapter } from "./data/matrixCaseAdapter.js";
import { validateMatrixScenarioRegistry } from "./data/matrixScenarioRegistry.js";
import { validateFraudAcademyGuardrails } from "./data/fraudAcademyGuardrails.js";

const matrixScenarioStatus = validateMatrixScenarioRegistry();
const matrixCaseAdapterStatus = validateMatrixCaseAdapter("ATO");
const fraudAcademyGuardrailStatus = validateFraudAcademyGuardrails();

if ((!matrixScenarioStatus.readyForGeneratorAdapter || !matrixCaseAdapterStatus.readyForGeneratorAdapter) && typeof console !== "undefined") {
  console.warn("Fraud Academy matrix generator foundation needs attention:", {
    matrixScenarioStatus,
    matrixCaseAdapterStatus
  });
}

if (!fraudAcademyGuardrailStatus.ok && typeof console !== "undefined") {
  console.warn("Fraud Academy source and lane guardrails need attention:", fraudAcademyGuardrailStatus);
}

export default AppWorkstationNativeBridge;
