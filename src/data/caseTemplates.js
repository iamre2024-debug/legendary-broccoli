export const CLAIM_FAMILIES = {
  ATO: "Account Takeover Claim",
  FRAUD_CHARGEBACK: "Fraud Chargeback Claim",
  NON_FRAUD_CHARGEBACK: "Non-Fraud Chargeback Claim",
  FIRST_PARTY: "First-Party Fraud Claim",
  PAYROLL: "Payroll / Direct Deposit Change Claim",
  BEC: "Email Fraud / BEC Claim",
  CREDIT_RISK: "Credit Risk Review",
  BUSINESS_BUSTOUT: "Business Loan / Bust-Out Review",
  APPLICATION: "Application Verification Review"
};

export const universalPages = [
  { id: "dashboard", label: "Dashboard", icon: "✦" },
  { id: "queue", label: "Case Queue", icon: "☰" },
  { id: "briefing", label: "Case Briefing", icon: "☾" },
  { id: "workspace", label: "Workspace", icon: "✧" },
  { id: "customer360", label: "Customer 360", icon: "◌" },
  { id: "evidence", label: "Evidence Center", icon: "▣" },
  { id: "timeline", label: "Timeline", icon: "⌁" },
  { id: "summary", label: "Investigation Summary", icon: "✎" },
  { id: "indicators", label: "Indicators Review", icon: "◇" },
  { id: "determination", label: "Determination", icon: "✓" },
  { id: "debrief", label: "Case Debrief", icon: "☽" },
  { id: "learning", label: "Learning Center", icon: "☆" }
];

export const toolNavByLane = {
  ATO: [
    { id: "login", label: "Login History", icon: "⌁" },
    { id: "session", label: "Session History", icon: "⟡" },
    { id: "device", label: "Device Intelligence", icon: "◉" },
    { id: "ip", label: "IP Intelligence", icon: "⌖" },
    { id: "mfa", label: "MFA History", icon: "✦" },
    { id: "financial", label: "Financial Investigation", icon: "◍" },
    { id: "identity", label: "Identity Intel", icon: "◎" },
    { id: "link", label: "Link Analysis", icon: "⌘" }
  ],
  FRAUD_CHARGEBACK: [
    { id: "transaction", label: "Transaction Details", icon: "◍" },
    { id: "authorization", label: "Authorization Review", icon: "✓" },
    { id: "merchant", label: "Merchant Evidence", icon: "▧" },
    { id: "merchantHistory", label: "Merchant History", icon: "⌁" },
    { id: "priorClaims", label: "Prior Claims", icon: "◇" },
    { id: "reasonCode", label: "Reason Code Guide", icon: "§" }
  ],
  NON_FRAUD_CHARGEBACK: [
    { id: "transaction", label: "Transaction Details", icon: "◍" },
    { id: "merchant", label: "Merchant Evidence", icon: "▧" },
    { id: "receipt", label: "Receipt / Invoice", icon: "□" },
    { id: "fulfillment", label: "Delivery / Return / Refund", icon: "▤" },
    { id: "terms", label: "Terms / Policy Review", icon: "§" },
    { id: "reasonCode", label: "Reason Code Guide", icon: "§" }
  ],
  PAYROLL: [
    { id: "payrollProfile", label: "Payroll Profile", icon: "◍" },
    { id: "employee", label: "Employee Profile", icon: "◎" },
    { id: "bank", label: "Bank Verification", icon: "▣" },
    { id: "changeRequest", label: "Change Request Review", icon: "✎" },
    { id: "admin", label: "Admin Activity", icon: "⌁" },
    { id: "callback", label: "Callback Verification", icon: "☏" },
    { id: "payrollRun", label: "Payroll Run Status", icon: "✓" },
    { id: "link", label: "Link Analysis", icon: "⌘" }
  ],
  BEC: [
    { id: "emailHeaders", label: "Email Headers", icon: "✉" },
    { id: "domain", label: "Domain Lookup", icon: "⌖" },
    { id: "sender", label: "Sender Analysis", icon: "◎" },
    { id: "beneficiary", label: "Beneficiary Review", icon: "▣" },
    { id: "bank", label: "Bank Verification", icon: "▣" },
    { id: "paymentTimeline", label: "Payment Timeline", icon: "⌁" },
    { id: "callback", label: "Callback Verification", icon: "☏" },
    { id: "link", label: "Link Analysis", icon: "⌘" }
  ],
  CREDIT_RISK: [
    { id: "income", label: "Income Verification", icon: "◍" },
    { id: "employment", label: "Employment Verification", icon: "◎" },
    { id: "dti", label: "DTI Calculator", icon: "%" },
    { id: "creditReport", label: "Credit Report Summary", icon: "▤" },
    { id: "financial", label: "Cash Flow Review", icon: "◌" },
    { id: "bankStatements", label: "Bank Statements", icon: "□" },
    { id: "paymentHistory", label: "Payment History", icon: "✓" },
    { id: "utilization", label: "Credit Utilization", icon: "◍" },
    { id: "inquiries", label: "Recent Inquiries", icon: "⌁" },
    { id: "bank", label: "Bank Verification", icon: "▣" }
  ],
  BUSINESS_BUSTOUT: [
    { id: "kyb", label: "KYB Review", icon: "▧" },
    { id: "businessRegistration", label: "Business Registration", icon: "□" },
    { id: "ownerKyc", label: "Owner KYC", icon: "◎" },
    { id: "revenue", label: "Revenue / Cash Flow", icon: "◌" },
    { id: "creditReport", label: "Credit Report", icon: "▤" }
  ],
  APPLICATION: [
    { id: "profileVerify", label: "Profile Verify", icon: "◎" },
    { id: "driverLicense", label: "Driver License Review", icon: "□" },
    { id: "selfie", label: "Selfie Verification", icon: "◉" },
    { id: "address", label: "Address Verification", icon: "⌂" },
    { id: "phone", label: "Phone Verification", icon: "☏" },
    { id: "email", label: "Email Verification", icon: "✉" },
    { id: "device", label: "Device Search", icon: "◉" },
    { id: "ip", label: "IP Intelligence", icon: "⌖" },
    { id: "identity", label: "Identity Intel", icon: "◎" }
  ]
};

export const determinationOptions = {
  ATO: ["Support Customer Claim", "Do Not Support Customer Claim", "Insufficient Evidence", "Escalate Investigation"],
  FRAUD_CHARGEBACK: ["Pay Claim", "Deny Claim", "Partial Pay", "Request More Evidence", "Escalate Dispute Review"],
  NON_FRAUD_CHARGEBACK: ["Pay Claim", "Deny Claim", "Partial Pay", "Request More Evidence", "Escalate Dispute Review"],
  FIRST_PARTY: ["Support Customer Claim", "Do Not Support Customer Claim", "Insufficient Evidence", "Escalate Investigation"],
  PAYROLL: ["Allow Change / Continue Payroll", "Pause Direct Deposit Change", "Remove Pending Payroll Destination", "Stop Payroll Run", "Hold Account Pending Verification", "Escalate to Senior Investigator", "Refer to Cyber / ATO Review"],
  BEC: ["Allow Change / Continue Payment", "Pause Payment", "Hold Account Pending Verification", "Escalate to Senior Investigator", "Refer to Cyber / ATO Review"],
  CREDIT_RISK: ["Approve Loan", "Deny Loan", "Approve With Conditions", "Request Additional Documents", "Escalate to Credit Risk Review", "Hold Application"],
  BUSINESS_BUSTOUT: ["Approve Application", "Deny Application", "Approve With Restrictions", "Request Documents", "Hold Pending Verification", "Escalate to Credit Risk", "Refer to Fraud Review"],
  APPLICATION: ["Approve Application", "Deny Application", "Request Additional Documents", "Hold Pending Verification", "Refer to Fraud Review"]
};

export const suspiciousIndicatorBank = [
  "First-seen device near loss event",
  "Password reset before money movement",
  "MFA sent to newly changed phone/email",
  "New beneficiary or payroll destination",
  "Device/IP inconsistent with customer history",
  "Strong proof of delivery conflicts with claim",
  "Repeated similar prior claims",
  "Bank account ownership mismatch",
  "High DTI or unsupported income",
  "Payment or payroll amount outside normal pattern",
  "Callback could not verify the requested change",
  "Recent credit draw followed by reduced deposits"
];

export const normalIndicatorBank = [
  "Known device",
  "Known location",
  "Customer contacted merchant first",
  "Consistent customer timeline",
  "Trusted payee or beneficiary",
  "Complete documentation",
  "Stable income deposits",
  "No prior dispute pattern",
  "Verified callback completed",
  "Account relationship is long-standing",
  "Merchant refund terms are documented",
  "Payment history is stable"
];

const products = [
  { product: "Checking", status: "Open", balance: "$2,486.42", limit: "N/A", standing: "No NSF in last 90 days" },
  { product: "Savings", status: "Open", balance: "$840.10", limit: "N/A", standing: "Stable" },
  { product: "Debit Card", status: "Active", balance: "Linked to checking", limit: "Daily POS $3,000", standing: "No restrictions" },
  { product: "Credit Card", status: "Open", balance: "$414.22", limit: "$2,500", standing: "Minimum paid on time" },
  { product: "Digital Banking", status: "Active", balance: "N/A", limit: "Profile controlled", standing: "MFA enabled" }
];

function profile(name, index = 0, extra = {}) {
  return {
    name,
    customerId: `FA-${730000 + index}`,
    maskedId: `***-**-${1200 + index}`,
    dob: index === 3 ? "Business profile" : `0${(index % 8) + 1}/1${index % 9}/19${82 + index}`,
    customerSince: `${2018 + index}-04-14`,
    relationshipLength: `${3 + index} years`,
    state: ["TX", "GA", "AZ", "TX", "NC"][index] || "TX",
    language: "English",
    preferredContact: "Mobile app secure message",
    verificationStatus: "Standard profile verification passed",
    accountStanding: index === 4 ? "Watch for payment stress" : "Good standing",
    products: extra.products || products,
    normalBehavior: {
      loginLocation: index % 2 === 0 ? "Dallas, TX metro" : "Atlanta, GA metro",
      device: "Trusted iPhone, Safari mobile",
      deposits: index === 3 ? "Business ACH and payroll funding" : "Biweekly payroll ACH",
      spending: "Grocery, fuel, subscriptions, and card-present retail"
    },
    profileChanges: extra.profileChanges || [
      { time: "2026-07-11 08:16", event: "Email review", oldValue: "No change", newValue: "No change", channel: "Mobile app", source: "Trusted device", device: "Known iPhone", ip: "198.51.100.24", mfa: "Push approved", notes: "Routine profile review" }
    ],
    priorClaims: [
      { date: "2025-12-08", type: "Card dispute", result: "Paid after merchant non-response" },
      { date: "2024-10-22", type: "Travel alert", result: "No fraud claim filed" }
    ],
    recentContact: [{ date: "2026-07-13", channel: "Secure message", note: "Customer asked about current case status." }]
  };
}

const toolCopy = {
  login: ["Login History", "Authentication events only. Review who logged in, from where, on what device, and whether access fits the customer baseline."],
  session: ["Session History", "Shows what happened after authentication: profile, security, payee, wallet, and money movement actions."],
  device: ["Device Intelligence", "Compares current device to known/trusted devices, first-seen date, browser, OS, and linked profiles."],
  ip: ["IP Intelligence", "Reviews IP location, network type, prior use, and velocity compared with normal customer behavior."],
  mfa: ["MFA History", "Reviews OTP, push, SMS, and security prompts around the claim window."],
  financial: ["Financial Investigation", "Does the money make sense? Reviews account overview, deposits, spending, cash, digital payments, linked accounts, merchant intelligence, and behavior trends."],
  identity: ["Identity Intel / People Search", "Fictional identity report with address, phones, emails, associates, businesses, property, license, credit summary, and public records sections."],
  link: ["Link Analysis", "Maps customer, device, IP, bank, payee, merchant, and business relationships."],
  transaction: ["Transaction Details", "Reviews posted transaction, authorization path, merchant descriptor, channel, amount, and timing."],
  authorization: ["Authorization Review", "Reviews entry mode, approved amount, clearing amount, and network data."],
  merchant: ["Merchant Evidence", "Reviews merchant response, receipt, descriptor, order proof, refund proof, and policy evidence."],
  merchantHistory: ["Merchant History", "Reviews customer history with the merchant or merchant category."],
  priorClaims: ["Prior Claims Pattern", "Reviews past claim count, type, outcome, and repeated patterns."],
  reasonCode: ["Reason Code Guide", "Explains dispute lane, evidence needed, and decision options."],
  receipt: ["Receipt / Invoice", "Reviews invoice, posted amount, receipt details, and refund proof."],
  fulfillment: ["Delivery / Return / Refund Review", "Reviews delivery, return tracking, cancellation, and refund evidence."],
  terms: ["Terms / Policy Review", "Reviews merchant terms, cancellation policy, refund policy, and disclosure."],
  payrollProfile: ["Payroll Profile", "Reviews payroll history, normal employee count, average pay, and run timing."],
  employee: ["Employee Profile", "Reviews employee relationship, prior deposits, contact path, and profile consistency."],
  bank: ["Bank Account Verification", "Compares old/prior account against new destination account, owner match, account status, first seen date, and recoverability."],
  changeRequest: ["Change Request Review", "Reviews who requested the payroll or vendor change and by what channel."],
  admin: ["Admin Activity", "Reviews admin login, MFA, and portal changes tied to payroll or business updates."],
  callback: ["Callback Verification Log", "Tracks trusted callback attempts and outcomes."],
  payrollRun: ["Payroll Run Status", "Shows whether funds have released and what hold actions are available."],
  income: ["Income Verification", "Compares claimed income or revenue against deposits, documents, and history."],
  employment: ["Employment Verification", "Reviews employment status, tenure, and verification source."],
  dti: ["DTI Calculator", "Reviews debt-to-income and ability to repay."],
  creditReport: ["Credit Report Summary", "Fictional credit summary with utilization, inquiries, derogatory items, and accounts."],
  bankStatements: ["Bank Statements", "Reviews deposit trend, balances, overdrafts, and cash flow."],
  paymentHistory: ["Payment History", "Reviews existing loan and card payment behavior."],
  utilization: ["Credit Utilization", "Reviews revolving usage and credit stress."],
  inquiries: ["Recent Inquiries", "Reviews recent application activity."]
};

function tools() {
  const result = {};
  Object.entries(toolCopy).forEach(([id, [title, summary]]) => {
    result[id] = {
      title,
      summary,
      fields: [
        ["Record type", title],
        ["Evidence mode", "Evidence only, no final verdict"],
        ["Claim lane fit", "Shown only when relevant to the active claim"],
        ["Training status", "Detailed fictional record"]
      ],
      timeline: ["Record opened", "Evidence compared to case briefing", "Investigator marks reviewed"],
      trainingTip: "Use this tool to compare evidence against the customer story. Do not decide the case inside the tool."
    };
  });
  result.transaction.fields = [["Merchant", "MX TAXI SERVICIOS"], ["Quoted amount", "$20.00 equivalent"], ["Posted amount", "$50.00"], ["Card entry", "Chip read / card-present"], ["Wallet token", "Not involved"]];
  result.authorization.fields = [["Entry mode", "Chip read"], ["Amount at authorization", "$50.00"], ["Wallet token", "Not involved"], ["Lost/stolen lane", "No"], ["ATO lane", "No suspicious access tied to this charge"]];
  result.bank.fields = [["Prior bank", "Bank of America traditional checking, good standing"], ["New bank", "Green Dot prepaid debit, owner match pending"], ["Prior payroll use", "18 deposits"], ["First seen", "Same day as change"], ["Recoverability", "Limited once funds release"]];
  result.financial.fields = [["Available balance", "$2,486.42"], ["Recent deposits", "Stable or under review by lane"], ["Digital payments", "Review if money moved"], ["Cash activity", "No unusual ATM pattern unless noted"], ["Trend", "Compare with normal behavior"]];
  return result;
}

const commonDocs = {
  "Uploaded Documents": ["Customer or business statement"],
  "Merchant / Third-Party Documents": [],
  "Payroll / Business Documents": [],
  "Card / Check Documents": [],
  "Policies / Terms": ["Relevant policy checklist"]
};

export const caseTemplates = [
  {
    id: "ATO-SEED",
    lane: "ATO",
    title: "Account Takeover Claim",
    subtype: "Profile change before disputed activity",
    priority: "High",
    exposure: "$1,850.00",
    status: "Active",
    assignedDate: "2026-07-13",
    reportedDate: "2026-07-13 09:12",
    issueStart: "2026-07-12 22:35",
    summary: "Customer reports being unable to access online banking after receiving password reset and MFA text alerts late at night. Customer states they did not request the reset, did not recognize the device or location, and later noticed an external transfer attempt after contact information changed.",
    statement: "I woke up to messages about a password reset and a code. I did not ask for that. When I tried to log in, my password did not work. My phone number looked changed and I saw a transfer I did not make.",
    intakeQuestions: ["When did you first notice the problem?", "Were you locked out?", "Did you receive password reset alerts?", "Did you receive MFA/OTP alerts?", "Did you click a suspicious link, text, or email?", "Did someone call pretending to be the bank?", "Did you share a code?", "Do you recognize the login device?", "Do you recognize the login location?", "Did your phone, email, password, MFA, payee, wallet, or external account change?", "What activity are you disputing?"],
    intakeAnswers: { "First noticed": "2026-07-13 around 6:30 AM", "Locked out": "Yes", "Code shared": "Customer denies sharing code", "Recognizes device/location": "No", "Disputed activity": "External transfer attempt and profile changes" },
    profile: profile("Maya Ellison", 0, { profileChanges: [{ time: "2026-07-12 22:47", event: "Mobile phone changed", oldValue: "(***) ***-0148", newValue: "(***) ***-8842", channel: "Online banking", source: "First-seen Android device", device: "DEV-FIC-91A7", ip: "203.0.113.77", mfa: "SMS OTP", notes: "Change occurred minutes before transfer attempt" }] }),
    suggestedTools: ["Customer 360", "Login History", "Session History", "Device Intelligence", "IP Intelligence", "MFA History", "Financial Investigation"],
    tools: tools(),
    documents: { ...commonDocs, "Policies / Terms": ["Digital banking access terms", "External transfer hold policy"] },
    timeline: [["2026-07-12 22:35", "Failed login attempts begin"], ["2026-07-12 22:41", "Successful login from first-seen device"], ["2026-07-12 22:47", "Mobile phone changed"], ["2026-07-12 22:56", "Transfer attempt held"], ["2026-07-13 09:12", "Customer reports lockout and dispute"]],
    expectedIndicators: ["First-seen device near loss event", "Password reset before money movement", "MFA sent to newly changed phone/email", "New beneficiary or payroll destination"],
    correctDetermination: "Support Customer Claim",
    debrief: "Senior review focuses on the sequence: failed logins, first-seen device, phone change, external account add, then transfer attempt. The strongest reasoning compares access behavior to Customer 360 history before deciding."
  },
  {
    id: "FCB-SEED",
    lane: "FRAUD_CHARGEBACK",
    title: "Fraud Chargeback Claim",
    subtype: "Incorrect amount / merchant possession",
    priority: "Medium",
    exposure: "$50.00",
    status: "Active",
    assignedDate: "2026-07-13",
    reportedDate: "2026-07-13 08:30",
    issueStart: "2026-07-11 19:14",
    summary: "Customer reports a taxi in Mexico quoted the equivalent of $20.00, but the final posted amount was $50.00. Customer states the card was handed to the driver during payment and noticed the higher amount later.",
    statement: "The taxi driver said it would be about twenty dollars. I gave him my card to pay, and later my account showed fifty dollars. I had my card before and after the ride. I am disputing the amount, not saying my online banking was hacked.",
    intakeQuestions: ["What amount were you quoted?", "What amount posted to the account?", "Did you hand your card to the merchant?", "Did you receive a receipt?", "Was tip, tax, currency conversion, or service fee explained?", "Did you contact the merchant?", "Did the merchant promise a refund?", "Were there duplicate charges?", "Were you traveling at the time?", "Did the merchant keep the card out of view?", "Did you authorize the final amount shown?"],
    intakeAnswers: { "Quoted amount": "$20.00 equivalent", "Posted amount": "$50.00", "Receipt": "No clear receipt", "Traveling": "Yes, Mexico", "Merchant contacted": "No contact information available" },
    profile: profile("Alina Soto", 2),
    suggestedTools: ["Customer 360", "Transaction Details", "Authorization Review", "Merchant Evidence", "Reason Code Guide"],
    tools: tools(),
    documents: { ...commonDocs, "Uploaded Documents": ["Customer travel statement"], "Card / Check Documents": ["Card authorization record"], "Policies / Terms": ["Incorrect amount dispute evidence checklist"] },
    timeline: [["2026-07-11 19:14", "Taxi transaction authorized for $50.00"], ["2026-07-12 09:20", "Customer reviews posted amount"], ["2026-07-13 08:30", "Customer files amount dispute"], ["2026-07-13 09:10", "Merchant evidence request opened"]],
    expectedIndicators: ["Customer contacted merchant first", "Consistent customer timeline"],
    correctDetermination: "Request More Evidence",
    debrief: "Senior review keeps this case in the chargeback lane. There is no ATO story here. The best next work is receipt, merchant response, amount evidence, and reason code review."
  },
  {
    id: "NCB-SEED",
    lane: "NON_FRAUD_CHARGEBACK",
    title: "Non-Fraud Chargeback Claim",
    subtype: "Refund not received after duplicate billing",
    priority: "Medium",
    exposure: "$118.90",
    status: "Active",
    assignedDate: "2026-07-14",
    reportedDate: "2026-07-14 11:20",
    issueStart: "2026-07-06 16:10",
    summary: "Customer reports a merchant billed twice for the same service and promised a refund for the duplicate charge. Customer states the service was received, but the duplicate credit has not posted after several business days.",
    statement: "I am not saying someone stole my card. I paid for the service, but the merchant charged me twice. They told me the second charge would be refunded and I still do not see the credit.",
    intakeQuestions: ["Which charge is disputed?", "Was the service received?", "Did the merchant confirm duplicate billing?", "When did the merchant promise the refund?", "Did you receive written refund confirmation?", "Has any partial credit posted?", "Did you contact the merchant again?", "Do the two charges have the same date, amount, and descriptor?", "Do merchant terms mention refund timing?"],
    intakeAnswers: { "Service received": "Yes", "Duplicate charges": "Two $118.90 charges", "Refund promised": "Yes, by email", "Refund posted": "No" },
    profile: profile("Jordan Pierce", 1),
    suggestedTools: ["Customer 360", "Transaction Details", "Merchant Evidence", "Receipt / Invoice", "Delivery / Return / Refund", "Terms / Policy Review", "Reason Code Guide"],
    tools: tools(),
    documents: { ...commonDocs, "Uploaded Documents": ["Customer email with refund promise"], "Merchant / Third-Party Documents": ["Merchant invoice", "Duplicate billing statement"], "Policies / Terms": ["Merchant refund policy"] },
    timeline: [["2026-07-06 16:10", "First service charge posted"], ["2026-07-06 16:12", "Second matching charge posted"], ["2026-07-07 10:18", "Merchant promised refund"], ["2026-07-14 11:20", "Customer files non-fraud chargeback"]],
    expectedIndicators: ["Customer contacted merchant first", "Complete documentation", "Consistent customer timeline"],
    correctDetermination: "Pay Claim",
    debrief: "Senior review treats this as a non-fraud chargeback. The work is lighter than ATO because the customer admits participation and disputes duplicate billing and missing refund."
  },
  {
    id: "PAY-SEED",
    lane: "PAYROLL",
    title: "Payroll / Direct Deposit Change Claim",
    subtype: "Existing employee destination changed before payroll run",
    priority: "High",
    exposure: "$3,050.00",
    status: "Active",
    assignedDate: "2026-07-15",
    reportedDate: "2026-07-15 10:02",
    issueStart: "2026-07-15 08:44",
    summary: "Business payroll admin received an email requesting an existing employee direct deposit change before payroll release. The employee has been paid to the same Bank of America account for 18 payroll cycles, but the new destination is a Green Dot prepaid account first seen today.",
    statement: "The request looked like it came from our employee, so the payroll admin updated the account. We have not released payroll yet. We need to know if we should pause the change until we verify by phone.",
    intakeQuestions: ["Who requested the change?", "Was the employee/vendor new or existing?", "Was the bank account used before?", "Was the request made by email, portal, phone, or admin user?", "Who can verify by phone using trusted contact information?", "Does the payroll amount match normal history?", "Was the business owner, accountant, HR, or payroll admin contacted?", "Was the new account traditional bank, prepaid, fintech, or payroll card?"],
    intakeAnswers: { "Requester": "Email displaying employee name", "Employee status": "Existing employee", "Prior bank": "Bank of America", "New bank": "Green Dot prepaid debit", "Callback": "Pending" },
    profile: profile("Northstar Floral LLC", 3, { products: [{ product: "Business Checking", status: "Open", balance: "$68,405.20", limit: "N/A", standing: "No NSF" }, { product: "Payroll Product", status: "Active", balance: "N/A", limit: "Payroll release limit $85,000", standing: "Normal run timing" }, { product: "Digital Banking", status: "Active", balance: "N/A", limit: "Admin controlled", standing: "MFA enabled" }, { product: "Business Credit Card", status: "Open", balance: "$4,310.18", limit: "$25,000", standing: "Current" }] }),
    suggestedTools: ["Payroll Profile", "Employee Profile", "Bank Verification", "Change Request Review", "Admin Activity", "Callback Verification", "Payroll Run Status"],
    tools: tools(),
    documents: { ...commonDocs, "Uploaded Documents": ["Payroll change request email"], "Payroll / Business Documents": ["Direct deposit change form", "Payroll register"], "Policies / Terms": ["Direct deposit change verification control"] },
    timeline: [["2026-07-15 08:44", "Email request received"], ["2026-07-15 09:05", "Payroll admin updates destination"], ["2026-07-15 09:40", "Payroll run queued"], ["2026-07-15 10:24", "Trusted callback pending"]],
    expectedIndicators: ["New beneficiary or payroll destination", "Bank account ownership mismatch", "Callback could not verify the requested change", "Payment or payroll amount outside normal pattern"],
    correctDetermination: "Pause Direct Deposit Change",
    debrief: "Senior review focuses on prevention. Because payroll has not released and the new prepaid account is first seen, the safest training action is to pause until trusted callback verification confirms the change."
  },
  {
    id: "CR-SEED",
    lane: "CREDIT_RISK",
    title: "Credit Risk Review",
    subtype: "Existing customer personal loan increase",
    priority: "Medium",
    exposure: "$9,500.00",
    status: "Active",
    assignedDate: "2026-07-15",
    reportedDate: "2026-07-15 12:04",
    issueStart: "2026-07-15 12:04",
    summary: "Existing customer requests a $9,500 personal loan while revolving utilization is high and recent deposit activity is lower than stated income. The account relationship is established, but repayment capacity and documentation need review before approval.",
    statement: "I am requesting a personal loan to consolidate bills. My income is stable, but my last few deposits were lower because of reduced hours. I can provide updated paystubs if needed.",
    intakeQuestions: ["Is this a new or existing loan/card request?", "What income or revenue was claimed?", "Has income/revenue recently changed?", "Are there NSF, overdraft, or late payment signs?", "Are there recent inquiries or new accounts?", "Is there bankruptcy or public record history?", "Is the requested amount normal for the customer/business relationship?", "Are balances, credit limits, utilization, and payment history stable?"],
    intakeAnswers: { "Request type": "Existing customer personal loan", "Claimed income": "$92,000 annually", "Recent change": "Reduced hours", "Overdraft": "Two overdrafts in last 45 days", "Bankruptcy": "No" },
    profile: profile("Andre Coleman", 4),
    suggestedTools: ["Income Verification", "Employment Verification", "DTI Calculator", "Credit Report Summary", "Cash Flow Review", "Bank Statements", "Payment History", "Credit Utilization", "Recent Inquiries"],
    tools: tools(),
    documents: { ...commonDocs, "Uploaded Documents": ["Loan application", "Paystub uploaded"], "Payroll / Business Documents": ["Employment verification request"], "Policies / Terms": ["Personal loan underwriting checklist"] },
    timeline: [["2026-07-15 12:04", "Loan application submitted"], ["2026-07-15 12:10", "Credit report pulled"], ["2026-07-15 12:18", "Cash flow review opened"], ["2026-07-15 12:30", "Income verification pending"]],
    expectedIndicators: ["High DTI or unsupported income", "Recent credit draw followed by reduced deposits"],
    correctDetermination: "Request Additional Documents",
    debrief: "Senior review separates credit risk from fraud. The relationship may be real, but high utilization, lower deposits, and elevated DTI support more documentation before approval."
  }
];

const generatorNames = ["Nova Reed", "Cassian Bell", "Riley Monroe", "Harper Vale", "Selene Brooks", "Atlas Morgan", "Ivy Stone", "Rowan Tate"];
const businessNames = ["Brightline Goods LLC", "Cedar Payroll Group", "Moonlit Market LLC", "Silver Creek Services", "Luna Logistics Co."];
const priorities = ["Low", "Medium", "High"];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomMoney(min = 35, max = 9800) {
  const value = Math.floor(min + Math.random() * (max - min));
  return `$${value.toLocaleString()}.00`;
}

export function generateCase(templateLane = "RANDOM") {
  const pool = templateLane === "RANDOM" ? caseTemplates : caseTemplates.filter((template) => template.lane === templateLane);
  const template = clone(pick(pool.length ? pool : caseTemplates));
  const sequence = Math.floor(Math.random() * 9999);
  const name = template.lane === "PAYROLL" || template.lane === "BEC" || template.lane === "BUSINESS_BUSTOUT" ? pick(businessNames) : pick(generatorNames);

  template.id = `${template.lane}-${Date.now().toString(36).toUpperCase()}-${sequence}`;
  template.status = "Active";
  template.priority = pick(priorities);
  template.exposure = randomMoney(template.lane.includes("CHARGEBACK") ? 35 : 450, template.lane === "CREDIT_RISK" ? 25000 : 12000);
  template.assignedDate = new Date().toISOString().slice(0, 10);
  template.reportedDate = new Date().toLocaleString();
  template.issueStart = new Date(Date.now() - Math.floor(Math.random() * 72) * 3600000).toLocaleString();
  template.profile.name = name;
  template.profile.customerId = `FA-${Math.floor(100000 + Math.random() * 899999)}`;
  return template;
}

export function getDeterminationOptions(lane) {
  return determinationOptions[lane] || determinationOptions.ATO;
}

export function getVisibleNav(lane) {
  return [...universalPages.slice(0, 5), ...(toolNavByLane[lane] || []), ...universalPages.slice(5)];
}
