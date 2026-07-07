export const MATRIX_SCENARIO_VERSION = "matrix-v0.1.0";

export const MATRIX_SCENARIO_FIELDS = [
  "scenarioId",
  "claimFamily",
  "lane",
  "subtype",
  "difficulty",
  "plainEnglishMeaning",
  "howItHappens",
  "intakeQuestions",
  "expectedEvidence",
  "toolkitTools",
  "documents",
  "timelinePattern",
  "commonMistake",
  "miniExample",
  "taxonomyTags"
];

const policyDocs = ["Training policy checklist", "Fictional internal handling guide"];

export const matrixScenarioRegistry = [
  scenario({
    scenarioId: "ATO-OTP-PROFILE-001",
    claimFamily: "Account Takeover Claim",
    lane: "ATO",
    subtype: "OTP phishing with profile change",
    difficulty: "Intermediate",
    plainEnglishMeaning: "A fictional customer reports lockout after a reset, profile change, and attempted transfer.",
    howItHappens: "Credential theft or social engineering can lead to login, MFA friction, profile edits, and new money-movement setup.",
    intakeQuestions: ["When did you first notice the access issue?", "Do you recognize the device or location?", "Did anyone ask you for a code?"],
    expectedEvidence: ["login", "session", "device", "ip", "mfa", "financial", "identity", "link"],
    toolkitTools: ["login", "session", "device", "ip", "mfa", "financial", "identity", "link"],
    documents: documentPacket({ policies: ["Digital banking access terms", "External transfer hold policy"] }),
    timelinePattern: ["Failed attempts", "Successful login", "Profile change", "MFA challenge", "Transfer attempt"],
    commonMistake: "Treating a single IP result as the whole case instead of reviewing the sequence.",
    miniExample: "The learner should compare login, MFA, profile change, device, IP, and money movement before deciding.",
    taxonomyTags: taxonomy("unauthorized", "login", "ACH", ["identity", "cyber compromise"], "victim")
  }),
  scenario({
    scenarioId: "FCB-CNP-WALLET-001",
    claimFamily: "Fraud Chargeback Claim",
    lane: "FRAUD_CHARGEBACK",
    subtype: "Card-not-present wallet transaction",
    difficulty: "Foundational",
    plainEnglishMeaning: "A fictional cardholder disputes online activity and the learner reviews authorization and merchant evidence.",
    howItHappens: "Unauthorized or disputed card use may involve e-commerce, token metadata, device context, and merchant proof.",
    intakeQuestions: ["Was the card in your possession?", "Do you recognize the merchant?", "Did anyone in the household use the account?"],
    expectedEvidence: ["transaction", "authorization", "merchant", "merchantHistory", "priorClaims", "reasonCode"],
    toolkitTools: ["transaction", "authorization", "merchant", "merchantHistory", "priorClaims", "reasonCode"],
    documents: documentPacket({ thirdParty: ["Merchant response packet"], card: ["Authorization log"] }),
    timelinePattern: ["Authorization", "Posting", "Customer report", "Merchant response"],
    commonMistake: "Skipping the reason code and treating every card dispute like account takeover.",
    miniExample: "The learner reviews entry mode, token data, merchant proof, and prior activity without revealing the final outcome.",
    taxonomyTags: taxonomy("unauthorized", "transaction", "card", ["behavior", "dispute"], "victim")
  }),
  scenario({
    scenarioId: "NFCB-INCORRECT-AMOUNT-001",
    claimFamily: "Non-Fraud Chargeback Claim",
    lane: "NON_FRAUD_CHARGEBACK",
    subtype: "Incorrect amount dispute",
    difficulty: "Foundational",
    plainEnglishMeaning: "A fictional customer says the posted amount is higher than the disclosed or expected amount.",
    howItHappens: "Billing, tip, tax, currency, duplicate, or merchant posting issues can create a non-fraud dispute path.",
    intakeQuestions: ["What amount did you agree to pay?", "Do you have a receipt or invoice?", "Did you contact the merchant first?"],
    expectedEvidence: ["transaction", "merchant", "receipt", "fulfillment", "terms", "reasonCode"],
    toolkitTools: ["transaction", "merchant", "receipt", "fulfillment", "terms", "reasonCode"],
    documents: documentPacket({ thirdParty: ["Receipt / invoice viewer", "Merchant response packet"], policies: ["Reason code guide"] }),
    timelinePattern: ["Purchase", "Posted amount", "Merchant contact", "Dispute intake"],
    commonMistake: "Using stolen-card language when the lane is really billing or service dispute evidence.",
    miniExample: "The learner compares receipt, merchant terms, and posted amount without asking irrelevant stolen-card questions.",
    taxonomyTags: taxonomy("authorized", "dispute", "card", ["billing", "merchant evidence"], "victim")
  }),
  scenario({
    scenarioId: "FPF-DIGITAL-GOODS-001",
    claimFamily: "First-Party Fraud Claim",
    lane: "FIRST_PARTY",
    subtype: "Digital goods used after dispute",
    difficulty: "Intermediate",
    plainEnglishMeaning: "A fictional dispute includes usage evidence that may conflict with the customer statement.",
    howItHappens: "A real customer or household user may dispute activity after receiving or using goods or services.",
    intakeQuestions: ["Who has access to the device or account?", "Were the goods or service used?", "Have similar claims happened before?"],
    expectedEvidence: ["transaction", "device", "merchantHistory", "priorClaims", "financial", "reasonCode"],
    toolkitTools: ["transaction", "device", "merchantHistory", "priorClaims", "financial", "reasonCode"],
    documents: documentPacket({ thirdParty: ["Usage or redemption log", "Merchant evidence packet"] }),
    timelinePattern: ["Purchase", "Usage event", "Customer dispute", "Merchant proof"],
    commonMistake: "Calling the customer dishonest too early instead of documenting what the evidence supports.",
    miniExample: "The learner weighs merchant usage, device match, prior claims, and statement consistency.",
    taxonomyTags: taxonomy("unclear", "dispute", "card", ["first-party", "behavior"], "both")
  }),
  scenario({
    scenarioId: "PAYROLL-BANK-CHANGE-001",
    claimFamily: "Payroll / Direct Deposit Change Claim",
    lane: "PAYROLL",
    subtype: "Existing employee destination change",
    difficulty: "Intermediate",
    plainEnglishMeaning: "A fictional payroll destination change arrives close to payroll release and needs trusted verification.",
    howItHappens: "A spoofed or compromised request can redirect payroll to a first-seen account if controls are weak.",
    intakeQuestions: ["Who submitted the change?", "Was trusted callback completed?", "Can the payroll run still be held?"],
    expectedEvidence: ["payrollProfile", "employee", "bank", "changeRequest", "admin", "callback", "payrollRun", "link"],
    toolkitTools: ["payrollProfile", "employee", "bank", "changeRequest", "admin", "callback", "payrollRun", "link"],
    documents: documentPacket({ payroll: ["Payroll change request packet", "Callback verification log", "Payroll run status report"] }),
    timelinePattern: ["Change request", "Admin review", "Bank comparison", "Trusted callback", "Hold or release decision"],
    commonMistake: "Trusting the incoming email or form instead of using a trusted callback source.",
    miniExample: "The learner compares old and new bank accounts, employee history, admin activity, and callback status.",
    taxonomyTags: taxonomy("authorized", "servicing/account management", "payroll", ["social engineering", "payment diversion"], "unknown")
  }),
  scenario({
    scenarioId: "BEC-VENDOR-REDIRECT-001",
    claimFamily: "Email Fraud / BEC Claim",
    lane: "BEC",
    subtype: "Vendor payment redirection",
    difficulty: "Advanced",
    plainEnglishMeaning: "A fictional vendor bank change request may involve look-alike email, beneficiary change, and urgent payment pressure.",
    howItHappens: "Mailbox compromise or spoofing can redirect payments to a new beneficiary before normal verification catches up.",
    intakeQuestions: ["Was the sender domain expected?", "Was vendor master data changed?", "Was callback made using trusted records?"],
    expectedEvidence: ["emailHeaders", "domain", "sender", "beneficiary", "bank", "paymentTimeline", "callback", "link"],
    toolkitTools: ["emailHeaders", "domain", "sender", "beneficiary", "bank", "paymentTimeline", "callback", "link"],
    documents: documentPacket({ thirdParty: ["Email header report", "Domain lookup report", "Beneficiary verification report"] }),
    timelinePattern: ["Invoice update", "Domain review", "Beneficiary change", "Payment hold", "Trusted callback"],
    commonMistake: "Letting urgency replace verification discipline.",
    miniExample: "The learner reviews email, domain, beneficiary, bank, callback, and payment sequence before final action.",
    taxonomyTags: taxonomy("authorized", "transaction", "wire", ["vendor compromise", "social engineering"], "victim")
  }),
  scenario({
    scenarioId: "CREDIT-CLI-STRESS-001",
    claimFamily: "Credit Risk Review",
    lane: "CREDIT_RISK",
    subtype: "Existing account line increase stress",
    difficulty: "Intermediate",
    plainEnglishMeaning: "A fictional existing credit customer shows repayment stress after requesting or receiving exposure.",
    howItHappens: "Credit risk can surface through utilization, cash-flow strain, returned payments, income gaps, and recent inquiries.",
    intakeQuestions: ["Is this a new request or existing account review?", "Which documents are complete?", "Are reason codes needed?"],
    expectedEvidence: ["income", "employment", "dti", "creditReport", "financial", "bankStatements", "paymentHistory", "utilization", "inquiries", "bank"],
    toolkitTools: ["income", "employment", "dti", "creditReport", "financial", "bankStatements", "paymentHistory", "utilization", "inquiries", "bank"],
    documents: documentPacket({ uploaded: ["Paystub", "Bank statement"], policies: ["Credit reason-code checklist"] }),
    timelinePattern: ["Credit request", "Income review", "Utilization change", "Payment pattern review", "Credit decision rail"],
    commonMistake: "Using fraud reimbursement language inside a credit-risk decision.",
    miniExample: "The learner reviews ability-to-repay facts and missing-doc status without treating stress as automatic fraud.",
    taxonomyTags: taxonomy("authorized", "servicing/account management", "credit", ["credit stress", "behavior"], "unknown")
  }),
  scenario({
    scenarioId: "BUSINESS-BUSTOUT-001",
    claimFamily: "Business Loan / Bust-Out Review",
    lane: "BUSINESS_BUSTOUT",
    subtype: "Sleeper LLC sudden draw",
    difficulty: "Advanced",
    plainEnglishMeaning: "A fictional business relationship looks stable before rapid draw activity and revenue support questions.",
    howItHappens: "A business may build credibility, request or receive exposure, then accelerate usage when repayment support weakens.",
    intakeQuestions: ["Is the entity active and controlled by stated owners?", "Do revenue and bank deposits support the request?", "Are linked entities relevant?"],
    expectedEvidence: ["kyb", "businessRegistration", "ownerKyc", "revenue", "creditReport", "bankStatements"],
    toolkitTools: ["kyb", "businessRegistration", "ownerKyc", "revenue", "creditReport", "bankStatements"],
    documents: documentPacket({ payroll: ["KYB report", "Business registration extract", "Owner KYC packet", "Revenue cash-flow review"] }),
    timelinePattern: ["Entity review", "Owner KYC", "Revenue comparison", "Credit exposure", "Draw activity"],
    commonMistake: "Approving or denying based on one business record instead of entity, owner, revenue, and cash-flow fit.",
    miniExample: "The learner checks legal entity status, UBO context, revenue evidence, and credit exposure changes.",
    taxonomyTags: taxonomy("authorized", "onboarding", "loan", ["business verification", "credit stress", "first-party"], "unknown")
  }),
  scenario({
    scenarioId: "APP-ID-DEVICE-IP-001",
    claimFamily: "Application Verification Review",
    lane: "APPLICATION",
    subtype: "ID mismatch with new device and IP",
    difficulty: "Intermediate",
    plainEnglishMeaning: "A fictional application has identity consistency gaps, a new device, and IP context that need review.",
    howItHappens: "Synthetic, stolen, or thin identity applications can combine plausible ID data with weak contact, address, device, or IP history.",
    intakeQuestions: ["What identity fields match?", "Which contact points are newly seen?", "What documents are still pending?"],
    expectedEvidence: ["profileVerify", "driverLicense", "selfie", "address", "phone", "email", "device", "ip", "identity"],
    toolkitTools: ["profileVerify", "driverLicense", "selfie", "address", "phone", "email", "device", "ip", "identity"],
    documents: documentPacket({ uploaded: ["Government ID", "Proof of address"], thirdParty: ["People Search report", "Device/IP report"] }),
    timelinePattern: ["Application intake", "ID review", "Contact verification", "Device/IP review", "Document request"],
    commonMistake: "Treating identity match as proof that there is no risk or treating one mismatch as a final answer.",
    miniExample: "The learner reviews ID, liveness, address, phone, email, device, IP, and People Search context.",
    taxonomyTags: taxonomy("unclear", "onboarding", "card", ["identity", "document risk"], "unknown")
  }),
  scenario({
    scenarioId: "ACH-CHECK-POSITIVE-PAY-001",
    claimFamily: "ACH / Wire / Check Review",
    lane: "ACH_WIRE_CHECK",
    subtype: "Positive Pay payee mismatch",
    difficulty: "Intermediate",
    plainEnglishMeaning: "A fictional check or payment exception needs image, payee, endorsement, bank, and velocity review.",
    howItHappens: "Check or payment fraud may involve altered payee details, mismatch to issued file, deposit path anomalies, or rapid linked activity.",
    intakeQuestions: ["Does the item match the issued file?", "What does the check image show?", "Is the destination or endorsement expected?"],
    expectedEvidence: ["transaction", "bank", "positivePay", "checkImage", "endorsement", "velocity", "link"],
    toolkitTools: ["transaction", "bank", "positivePay", "checkImage", "endorsement", "velocity", "link"],
    documents: documentPacket({ card: ["Check image front/back", "Positive Pay exception report", "Endorsement review"] }),
    timelinePattern: ["Item presented", "Positive Pay exception", "Image review", "Endorsement review", "Hold or return path"],
    commonMistake: "Skipping image and endorsement review because the transaction row looks complete.",
    miniExample: "The learner reviews issued-file match, check image, endorsement, bank verification, velocity, and linked accounts.",
    taxonomyTags: taxonomy("unauthorized", "transaction", "check", ["document risk", "payment fraud"], "victim")
  })
];

export function getMatrixScenariosForLane(lane = "RANDOM") {
  if (lane === "RANDOM") return matrixScenarioRegistry;
  return matrixScenarioRegistry.filter((scenario) => scenario.lane === lane);
}

export function getScenarioForLane(lane = "RANDOM", seed = 0) {
  const scenarios = getMatrixScenariosForLane(lane);
  const fallback = matrixScenarioRegistry;
  const pool = scenarios.length ? scenarios : fallback;
  return pool[Math.abs(seed) % pool.length];
}

export function buildScenarioProvenance(scenario) {
  return {
    version: MATRIX_SCENARIO_VERSION,
    scenarioId: scenario.scenarioId,
    lane: scenario.lane,
    source: "Fraud Academy normalized Training Matrix foundation",
    safety: "Fictional, masked, training-only scenario metadata"
  };
}

export function validateMatrixScenarioRegistry() {
  const missingFields = [];
  const missingTools = [];
  const lanes = new Set();

  matrixScenarioRegistry.forEach((scenarioItem) => {
    lanes.add(scenarioItem.lane);
    MATRIX_SCENARIO_FIELDS.forEach((field) => {
      if (!(field in scenarioItem)) missingFields.push(`${scenarioItem.scenarioId}:${field}`);
    });
    if (!scenarioItem.toolkitTools.length) missingTools.push(scenarioItem.scenarioId);
  });

  return {
    version: MATRIX_SCENARIO_VERSION,
    totalScenarios: matrixScenarioRegistry.length,
    lanes: [...lanes],
    missingFields,
    missingTools,
    readyForGeneratorAdapter: missingFields.length === 0 && missingTools.length === 0
  };
}

function scenario(config) {
  return {
    ...config,
    correctDetermination: "Hidden until debrief",
    debriefLogic: "Resolved by evidence sequence, lane-specific documents, and defensible written justification. Do not show during active investigation.",
    provenance: {
      version: MATRIX_SCENARIO_VERSION,
      safety: "Fictional training data only"
    }
  };
}

function documentPacket({ uploaded = [], thirdParty = [], payroll = [], card = [], policies = [] } = {}) {
  return {
    "Uploaded Documents": uploaded,
    "Merchant / Third-Party Documents": thirdParty,
    "Payroll / Business Documents": payroll,
    "Card / Check Documents": card,
    "Policies / Terms": [...policyDocs, ...policies]
  };
}

function taxonomy(authorizationType, lifecycleStage, productRail, riskPattern, customerRole) {
  return {
    authorizationType,
    lifecycleStage,
    productRail,
    riskPattern,
    customerRole
  };
}
