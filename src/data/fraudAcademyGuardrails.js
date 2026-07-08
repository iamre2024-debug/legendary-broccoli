import {
  CLAIM_FAMILIES,
  determinationOptions,
  toolNavByLane
} from "./fraudAcademyEngine.js";
import {
  getCreditDeterminationOptions,
  isCreditDecisionRailCase
} from "./creditDecisionRail.js";
import { validateCustomerToolHistoryCoverage } from "./customerToolHistory.js";

export const SOURCE_HIERARCHY = [
  {
    name: "Fraud Academy Bible v2.1 / v2 working bible",
    role: "Current consolidated product and build map",
    codingUse: "Use first for source hierarchy, lane purity, evidence-first flow, and commercialization-safe product direction."
  },
  {
    name: "fraud training",
    role: "Master training and design bible",
    codingUse: "Use for approved workspaces, investigation sequence, claim-specific tools, and no-spoiler training behavior."
  },
  {
    name: "Fraud Academy Project Chat Audit",
    role: "Corrected design decisions and chat-to-build map",
    codingUse: "Use for mobile-first workstation layout, cute neon styling, and workflow order when older files conflict."
  },
  {
    name: "Fraud Academy Training Matrix",
    role: "Scenario and lesson source",
    codingUse: "Use for lane-specific case generation, realistic fictional evidence, and learning path coverage."
  },
  {
    name: "Credit Risk Lane and Interactive Investigator Web App Design Report",
    role: "Credit lane architecture",
    codingUse: "Use for support / do-not-support / more-info credit decisions, reason-code narrative, SLA/document clock, and credit-safe wording."
  },
  {
    name: "Global Banking and Fintech Fraud Management Report",
    role: "Modern fraud taxonomy and operations expansion",
    codingUse: "Use for future APP scam, money mule, wallet/token, API/vendor/insider, SOP, KPI, and policy-library expansion."
  },
  {
    name: "Fraud Academy Final Deep Research Packet",
    role: "Expanded bank / fintech fraud coverage",
    codingUse: "Use as a research backstop for new lanes, evidence expectations, policy guardrails, and investigator playbooks."
  },
  {
    name: "Fraud Academy Build Tracker",
    role: "Live change log and blocker tracker",
    codingUse: "Update after every focused build pass with what changed, what was checked, blockers, and next step."
  },
  {
    name: "fraud pic visual references",
    role: "Visual style lock",
    codingUse: "Keep dark purple/pink neon, glassy rounded panels, mobile-first dashboard feel, and cute/chill workstation charm."
  }
];

export const CORE_BUILD_RULES = [
  "All customer, business, device, IP, account, and document data must be fictional or masked.",
  "Evidence tools must show records and context, never the final answer.",
  "Determination and Luna / senior review must stay locked until the learner chooses an outcome and writes justification.",
  "Claim lanes must keep their own tools, documents, inputs, and outputs.",
  "Credit risk and business bust-out must not use pay / deny reimbursement wording as their primary decision rail.",
  "Customer 360 is the permanent dossier; search-style lookups belong in the lane tools.",
  "Reports are detailed internal-bank-style previews for report-heavy searches, while tools can remain snapshot + search workspaces.",
  "Every generated tool should carry Customer 360 relationship, profile-change, prior-claim, and lookup context.",
  "The UI should stay professional, mobile-first, neon, bubbly, and investigator-workstation flavored."
];

const REQUIRED_LANES = [
  "ATO",
  "FRAUD_CHARGEBACK",
  "NON_FRAUD_CHARGEBACK",
  "FIRST_PARTY",
  "PAYROLL",
  "BEC",
  "CREDIT_RISK",
  "BUSINESS_BUSTOUT",
  "APPLICATION",
  "ACH_WIRE_CHECK"
];

const FORBIDDEN_CREDIT_DECISION_TERMS = [
  "pay claim",
  "deny claim",
  "reimburse",
  "refund claim"
];

export function validateFraudAcademyGuardrails() {
  const warnings = [];
  const missingLanes = REQUIRED_LANES.filter((lane) => !CLAIM_FAMILIES[lane]);
  const customerHistoryCoverage = validateCustomerToolHistoryCoverage(toolNavByLane);

  if (missingLanes.length) {
    warnings.push(`Missing required lane families: ${missingLanes.join(", ")}`);
  }

  Object.entries(toolNavByLane).forEach(([lane, tools]) => {
    if (!Array.isArray(tools) || tools.length === 0) {
      warnings.push(`${lane} has no visible tool navigation.`);
      return;
    }

    const ids = tools.map((tool) => tool.id).filter(Boolean);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) {
      warnings.push(`${lane} has duplicate tool IDs: ${Array.from(new Set(duplicates)).join(", ")}`);
    }
  });

  REQUIRED_LANES.forEach((lane) => {
    const standardOptions = determinationOptions[lane] || [];
    if (!standardOptions.length && !isCreditDecisionRailCase(lane)) {
      warnings.push(`${lane} has no lane determination options.`);
    }
  });

  ["CREDIT_RISK", "BUSINESS_BUSTOUT"].forEach((lane) => {
    const creditOptions = getCreditDeterminationOptions(lane);
    if (!creditOptions.length) {
      warnings.push(`${lane} is missing credit decision rail options.`);
      return;
    }

    const unsafe = creditOptions.filter((option) => {
      const normalized = option.toLowerCase();
      return FORBIDDEN_CREDIT_DECISION_TERMS.some((term) => normalized.includes(term));
    });

    if (unsafe.length) {
      warnings.push(`${lane} credit rail contains claim-reimbursement wording: ${unsafe.join(", ")}`);
    }
  });

  if (!customerHistoryCoverage.ok) {
    warnings.push(`Customer profile history missing from tool IDs: ${customerHistoryCoverage.missing.join(", ")}`);
  }

  return {
    ok: warnings.length === 0,
    warnings,
    checkedAt: new Date().toISOString(),
    sourceHierarchy: SOURCE_HIERARCHY.map((source) => source.name),
    ruleCount: CORE_BUILD_RULES.length,
    laneCount: Object.keys(CLAIM_FAMILIES).length,
    toolLaneCount: Object.keys(toolNavByLane).length,
    customerHistoryCoverage
  };
}

export function buildGuardrailSummary() {
  const status = validateFraudAcademyGuardrails();

  return {
    title: "Fraud Academy build guardrails",
    statusLabel: status.ok ? "Ready" : "Needs review",
    ...status
  };
}
