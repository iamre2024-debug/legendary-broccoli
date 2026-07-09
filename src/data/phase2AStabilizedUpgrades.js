import {
  caseTemplates,
  determinationOptions,
  normalIndicatorBank,
  suspiciousIndicatorBank
} from "./fraudAcademyEngine.js";

const BEC_OUTCOMES = [
  "Payment Instructions Verified",
  "Hold Payment Pending Trusted Callback",
  "Reject Payment Instruction Change",
  "Recall / Recovery Review",
  "Escalate to Cyber / AML Review",
  "Insufficient Evidence"
];

const SHARED_SUSPICIOUS = [
  "First-seen device near loss event",
  "Password reset before money movement",
  "MFA sent to newly changed phone/email",
  "Device/IP inconsistent with customer history",
  "Repeated similar prior claims",
  "Bank account ownership mismatch",
  "Velocity spike outside normal behavior"
];

const LANE_SUSPICIOUS = {
  ATO: [
    "Profile change immediately before attempted funds movement",
    "New device, new IP, and new destination appear in one session",
    "Customer lockout follows credential reset or MFA destination change"
  ],
  FRAUD_CHARGEBACK: [
    "Card-present use after reported loss window",
    "Merchant authorization conflicts with customer possession timeline",
    "Disputed spend clusters after last valid card use"
  ],
  NON_FRAUD_CHARGEBACK: [
    "Merchant support missing for final amount or refund promise",
    "Customer participated but billing terms remain unsupported",
    "Receipt, invoice, or policy evidence does not answer reason code"
  ],
  FIRST_PARTY: [
    "Digital goods used after purchase from household or known device",
    "Prior similar claims repeat across same merchant category",
    "Customer story conflicts with delivery, redemption, or usage evidence"
  ],
  PAYROLL: [
    "Direct deposit destination changed close to payroll release",
    "Requested destination is prepaid, fintech, or first seen today",
    "Trusted callback not completed before payroll action"
  ],
  BEC: [
    "Look-alike domain or reply-to mismatch",
    "New beneficiary or payment instruction outside vendor master history",
    "Urgent same-day payment pressure before trusted callback",
    "Invoice appears real but payment destination changed"
  ],
  CREDIT_RISK: [
    "Verified deposits do not support stated income",
    "DTI changes materially when using verified income",
    "High utilization or recent inquiries indicate repayment stress"
  ],
  BUSINESS_BUSTOUT: [
    "Credit appetite exceeds verified business revenue",
    "Operating address or owner profile is thin for requested exposure",
    "Rapid credit stacking follows a dormant operating period"
  ],
  APPLICATION: [
    "New email, first-seen device, and thin address cluster together",
    "Document address conflicts with application without support",
    "Phone or email age is too new to stabilize identity profile"
  ],
  ACH_WIRE_CHECK: [
    "Positive Pay exception conflicts with issued file",
    "Payee, endorsement, or bank-of-first-deposit mismatch",
    "Payment velocity spikes outside business history"
  ]
};

const LANE_NORMAL = {
  ATO: ["Known device and normal market align with customer story", "Profile change confirmed through trusted channel"],
  FRAUD_CHARGEBACK: ["Card reported promptly after loss", "Entry mode and location fit the customer timeline"],
  NON_FRAUD_CHARGEBACK: ["Merchant refund terms are documented", "Customer statement, receipt, and authorization line up"],
  FIRST_PARTY: ["No repeated pattern across merchants", "Usage evidence does not conflict with customer statement"],
  PAYROLL: ["Verified callback completed using trusted employee record", "Destination account has prior payroll history"],
  BEC: ["Known vendor contact confirms instructions using trusted record", "Prior beneficiary remains unchanged in vendor master"],
  CREDIT_RISK: ["Verified income supports requested exposure", "Payment history remains stable"],
  BUSINESS_BUSTOUT: ["KYB, owner KYC, and revenue support align", "Business operating history supports requested credit"],
  APPLICATION: ["Identity data matches application", "Address proof resolves document mismatch"],
  ACH_WIRE_CHECK: ["Issued file, image, and endorsement align", "Treasury callback verifies the item"]
};

function uniquePush(target, items) {
  for (const item of items) {
    if (!target.includes(item)) target.push(item);
  }
}

function patchIndicatorBanks() {
  uniquePush(suspiciousIndicatorBank, [
    ...SHARED_SUSPICIOUS,
    ...Object.values(LANE_SUSPICIOUS).flat()
  ]);
  uniquePush(normalIndicatorBank, [
    "Known device",
    "Known location",
    "Consistent customer timeline",
    "Complete documentation",
    "Verified callback completed",
    "Account relationship is long-standing",
    "Merchant refund terms are documented",
    "Payment history is stable",
    "Identity data matches application",
    "Destination account previously used",
    ...Object.values(LANE_NORMAL).flat()
  ]);
}

function linkRowsFor(lane) {
  const base = [
    { k: "Customer / business node", v: "Primary profile remains the anchor record", flag: "neutral" },
    { k: "Link search fields", v: "Training ID, phone, email, device, IP, address, destination ID, merchant, business, and admin user", flag: "neutral" },
    { k: "Ring control", v: "Same data reused across unrelated profiles must be documented before escalation", flag: "caution" }
  ];
  const byLane = {
    ATO: [
      { k: "Device to IP", v: "First-seen Android and Phoenix IP appear together before profile change", flag: "caution" },
      { k: "Profile to destination", v: "New phone and new destination were added inside the same suspicious session", flag: "caution" }
    ],
    BEC: [
      { k: "Domain to beneficiary", v: "Look-alike vendor domain introduces first-seen fintech destination", flag: "caution" },
      { k: "Vendor master comparison", v: "Prior trusted beneficiary remains Wells Fargo business checking", flag: "good" }
    ],
    PAYROLL: [
      { k: "Employee to destination", v: "Existing employee has long payroll history to prior bank, not new prepaid account", flag: "caution" },
      { k: "Admin action link", v: "Legitimate admin processed unverified email request before callback", flag: "neutral" }
    ],
    ACH_WIRE_CHECK: [
      { k: "Item to deposit bank", v: "Exception item connects to fintech bank-of-first-deposit", flag: "caution" },
      { k: "Payee to issued file", v: "Payee and check number do not map to issued-file record", flag: "caution" }
    ],
    BUSINESS_BUSTOUT: [
      { k: "Business to owner", v: "Owner KYC passes, but operating address and revenue support remain thin", flag: "neutral" },
      { k: "Business to credit velocity", v: "Recent credit stacking connects to revenue mismatch", flag: "caution" }
    ],
    APPLICATION: [
      { k: "Applicant to device", v: "New device, new email, and thin address appear together", flag: "caution" },
      { k: "Identity to document", v: "Name/DOB fit while address still needs support", flag: "neutral" }
    ]
  };
  return [...base, ...(byLane[lane] || [
    { k: "Transaction to merchant", v: "Merchant, authorization, prior claims, and documents must agree before final action", flag: "neutral" },
    { k: "Evidence gap", v: "Missing document or report link should be requested, not guessed", flag: "caution" }
  ])];
}

function patchLinkAnalysis(caseItem) {
  const linkTool = caseItem.tools?.link;
  if (!linkTool) return;
  linkTool.title = "Link Analysis / Ring Map";
  linkTool.summary = "Relationship map across repeated training IDs, phone, email, device, IP, address, destination ID, merchant, business, and admin-user links.";
  linkTool.rows = linkRowsFor(caseItem.lane);
  linkTool.timeline = [
    { time: "Record", text: "Anchor the case on the customer, business, employee, vendor, or payment item", flag: "neutral" },
    { time: "Expand", text: "Collect reusable identifiers from the lane-specific tools", flag: "neutral" },
    { time: "Search", text: "Compare each identifier against prior fictional profiles and cases", flag: "neutral" },
    { time: "History", text: "Document first-seen, prior-good, or repeated-use context", flag: "neutral" },
    { time: "Link Analysis", text: "Map shared data only after evidence supports the relationship", flag: "caution" },
    { time: "Generate Report", text: "Produce a fictional masked link report without revealing determination", flag: "neutral" }
  ];
  linkTool.relatedDocuments = [
    "Masked Link Analysis Report",
    "Prior Case Relationship Search",
    "Destination ID Reuse Report",
    "Device / IP Reuse Report",
    "Case Timeline"
  ];
  linkTool.nextActions = [
    "Search every repeated identifier before escalation",
    "Separate same-household, same-business, and unrelated shared-data links",
    "Document whether the link supports a ring, a normal relationship, or an unresolved gap"
  ];
  linkTool.riskSignals = [
    "Shared destination ID across unrelated profiles",
    "Same device or IP reused with new contact data",
    "Business or vendor payment instruction changes tied to first-seen identifiers"
  ];
  linkTool.trainingTip = "Fraud rings are stopped by repeated data links, but every link needs context before it becomes an escalation.";
}

function patchDocumentInbox(caseItem) {
  caseItem.documents = {
    ...caseItem.documents,
    "Requested Documents Inbox": caseItem.documents?.["Requested Documents Inbox"] || [
      "Open request tracker",
      "Pending customer or business upload",
      "Document review notes live in Summary"
    ]
  };
}

function patchBecCase(caseItem) {
  if (caseItem.lane !== "BEC") return;
  caseItem.correctDetermination = "Hold Payment Pending Trusted Callback";
  caseItem.expectedIndicators = [
    "Look-alike domain or reply-to mismatch",
    "New beneficiary or payment instruction outside vendor master history",
    "Urgent same-day payment pressure before trusted callback"
  ];
  caseItem.debrief = "BEC analysis centers on requester identity, trusted callback, and destination control. The safest defensible decision is to hold payment pending trusted callback before release or recovery escalation.";
  caseItem.documents = {
    ...caseItem.documents,
    "Requested Documents Inbox": [
      "Trusted vendor callback result pending",
      "Vendor master beneficiary comparison",
      "Email header and domain lookup packet",
      "Recovery / recall worksheet if funds release"
    ]
  };
}

function applyPhase2AUpgrades() {
  determinationOptions.BEC = BEC_OUTCOMES;
  patchIndicatorBanks();
  for (const caseItem of caseTemplates) {
    patchLinkAnalysis(caseItem);
    patchDocumentInbox(caseItem);
    patchBecCase(caseItem);
  }
}

applyPhase2AUpgrades();

export const phase2AStatus = {
  label: "Phase 2A lane accuracy + tool depth upgrades applied",
  becOutcomes: BEC_OUTCOMES,
  laneIndicatorFamilies: Object.keys(LANE_SUSPICIOUS),
  linkAnalysisPattern: "Record → Expand → Search → History → Link Analysis → Generate Report"
};
