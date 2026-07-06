export const CLAIM_FAMILIES = {
  ATO: "Account Takeover Claim",
  FRAUD_CHARGEBACK: "Fraud Chargeback Claim",
  NON_FRAUD_CHARGEBACK: "Non-Fraud Chargeback Claim",
  FIRST_PARTY: "First-Party Fraud Claim",
  PAYROLL: "Payroll / Direct Deposit Change Claim",
  BEC: "Email Fraud / BEC Claim",
  CREDIT_RISK: "Credit Risk Review",
  BUSINESS_BUSTOUT: "Business Loan / Bust-Out Review",
  APPLICATION: "Application Verification Review",
  ACH_WIRE_CHECK: "ACH / Wire / Check Review"
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
  FIRST_PARTY: [
    { id: "transaction", label: "Transaction Details", icon: "◍" },
    { id: "device", label: "Device / Usage Match", icon: "◉" },
    { id: "merchantHistory", label: "Merchant Usage", icon: "⌁" },
    { id: "priorClaims", label: "Prior Claims Pattern", icon: "◇" },
    { id: "financial", label: "Financial Pattern", icon: "◌" },
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
    { id: "creditReport", label: "Credit Report", icon: "▤" },
    { id: "bankStatements", label: "Bank Statements", icon: "□" }
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
  ],
  ACH_WIRE_CHECK: [
    { id: "transaction", label: "Payment Details", icon: "◍" },
    { id: "bank", label: "Bank Account Verification", icon: "▣" },
    { id: "positivePay", label: "Positive Pay", icon: "✓" },
    { id: "checkImage", label: "Check Image", icon: "□" },
    { id: "endorsement", label: "Endorsement Review", icon: "✎" },
    { id: "velocity", label: "Velocity Review", icon: "⌁" },
    { id: "link", label: "Link Analysis", icon: "⌘" }
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
  APPLICATION: ["Approve Application", "Deny Application", "Request Additional Documents", "Hold Pending Verification", "Refer to Fraud Review"],
  ACH_WIRE_CHECK: ["Pay Claim", "Deny Claim", "Request More Evidence", "Hold Payment", "Escalate Investigation"]
};

export const suspiciousIndicatorBank = [
  "First-seen device near loss event",
  "Password reset before money movement",
  "MFA sent to newly changed phone/email",
  "New beneficiary or payroll destination",
  "Device/IP inconsistent with customer history",
  "Repeated similar prior claims",
  "Bank account ownership mismatch",
  "High DTI or unsupported income",
  "Callback could not verify the requested change",
  "Look-alike domain or reply-to mismatch",
  "First-seen fintech or prepaid destination",
  "Velocity spike outside normal behavior"
];

export const normalIndicatorBank = [
  "Known device",
  "Known location",
  "Consistent customer timeline",
  "Complete documentation",
  "Verified callback completed",
  "Account relationship is long-standing",
  "Merchant refund terms are documented",
  "Payment history is stable",
  "Identity data matches application",
  "Destination account previously used"
];

const names = ["Maya Ellison", "Alina Soto", "Jordan Pierce", "Andre Coleman", "Devon Lewis", "Cassian Bell", "Riley Monroe", "Harper Vale", "Selene Brooks", "Ivy Stone", "Rowan Tate", "Nova Reed"];
const businesses = ["Northstar Floral LLC", "Blue Wren Events", "Brightline Goods LLC", "Cedar Payroll Group", "Moonlit Market LLC", "Silver Creek Services", "Luna Logistics Co.", "Cedar Ridge Dental"];
const priorities = ["Low", "Medium", "High", "Critical"];
const states = ["TX", "GA", "AZ", "NC", "FL", "IL"];

const commonDocs = {
  "Uploaded Documents": ["Customer or business statement"],
  "Merchant / Third-Party Documents": [],
  "Payroll / Business Documents": [],
  "Card / Check Documents": [],
  "Policies / Terms": ["Relevant policy checklist"]
};

function row(k, v, flag = "neutral") { return { k, v, flag }; }
function t(time, text, flag = "neutral") { return [time, text, flag]; }
function money(min = 35, max = 12000) { return `$${Math.floor(min + Math.random() * (max - min)).toLocaleString()}.00`; }
function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function profile(name = pick(names), index = 0, extra = {}) {
  return {
    name,
    customerId: `FA-${Math.floor(730000 + Math.random() * 89999)}`,
    maskedId: `***-**-${1200 + index}`,
    dob: extra.business ? "Business profile" : `0${(index % 8) + 1}/1${index % 9}/19${82 + index}`,
    customerSince: `${2017 + (index % 7)}-04-14`,
    relationshipLength: `${2 + (index % 8)} years`,
    state: pick(states),
    language: "English",
    preferredContact: "Mobile app secure message",
    verificationStatus: "Standard profile verification passed",
    accountStanding: extra.accountStanding || "Good standing",
    products: extra.products || [
      { product: "Checking", status: "Open", balance: "$2,486.42", limit: "N/A", standing: "No NSF in last 90 days" },
      { product: "Savings", status: "Open", balance: "$840.10", limit: "N/A", standing: "Stable" },
      { product: "Debit Card", status: "Active", balance: "Linked to checking", limit: "Daily POS $3,000", standing: "No restrictions" },
      { product: "Credit Card", status: "Open", balance: "$414.22", limit: "$2,500", standing: "Minimum paid on time" },
      { product: "Digital Banking", status: "Active", balance: "N/A", limit: "Profile controlled", standing: "MFA enabled" }
    ],
    normalBehavior: {
      loginLocation: extra.business ? "Business office and owner home market" : "Dallas, TX metro",
      device: "Trusted iPhone, Safari mobile",
      deposits: extra.business ? "Business ACH, card settlement, and payroll funding" : "Biweekly payroll ACH",
      spending: "Grocery, fuel, subscriptions, card-present retail, and digital wallet spend"
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

const richTools = {
  login: {
    title: "Login History",
    summary: "Authentication timeline with device, location, and MFA context.",
    rows: [row("22:35", "Failed password attempts from Phoenix, AZ ASN 64513", "caution"), row("22:41", "Successful login from first-seen Android Chrome", "caution"), row("22:47", "Profile phone changed in same session", "caution"), row("09:12", "Customer reports lockout from normal Dallas market", "good")],
    timeline: [t("22:35", "Failed login velocity begins", "caution"), t("22:41", "Successful login from first-seen device", "caution"), t("22:47", "Phone number changed", "caution"), t("09:12", "Customer calls support", "good")],
    trainingTip: "Sequence matters. ATO is usually proven by order of access events, not one field alone."
  },
  session: {
    title: "Session History",
    summary: "Actions performed after authentication.",
    rows: [row("Session length", "23 minutes", "neutral"), row("Security center", "Password reset and alert preference opened", "caution"), row("External account", "New destination added", "caution"), row("Transfer attempt", "Held by risk rule", "good")],
    timeline: [t("22:42", "Security center opened", "caution"), t("22:48", "External account enrollment started", "caution"), t("22:56", "Transfer attempt held", "good")],
    trainingTip: "Authentication tells you entry. Session history tells you intent."
  },
  device: {
    title: "Device Intelligence",
    summary: "Device fingerprint, trust status, emulator/root, and linked profile signals.",
    rows: [row("Device ID", "DEV-FIC-91A7 Android Chrome", "caution"), row("First seen", "Same day as disputed activity", "caution"), row("Trusted history", "No prior trusted sessions", "caution"), row("Linked profiles", "No confirmed link to customer household", "neutral"), row("Emulator/root", "No emulator or root indicators", "good")],
    timeline: [t("First seen", "Device first appears in case window", "caution"), t("Comparison", "Normal device is trusted iPhone", "caution")],
    trainingTip: "A new device is not automatic fraud. Compare it to Customer 360 and activity sequence."
  },
  ip: {
    title: "IP Intelligence",
    summary: "Network, geolocation, ASN, proxy, and velocity review.",
    rows: [row("IP", "203.0.113.77", "neutral"), row("Geo", "Phoenix, AZ", "caution"), row("Normal market", "Dallas, TX", "good"), row("ASN", "Mobile carrier gateway", "neutral"), row("Proxy/VPN", "No confirmed VPN", "good"), row("Velocity", "Two states in 38 minutes", "caution")],
    trainingTip: "IP mismatch is a signal. It becomes stronger when paired with new device and profile change."
  },
  mfa: {
    title: "MFA History",
    summary: "OTP, push, SMS, and alert destination review.",
    rows: [row("OTP method", "SMS", "neutral"), row("OTP destination", "Newly changed mobile number", "caution"), row("Push approvals", "No trusted device approval after change", "caution"), row("Customer statement", "Denies sharing code", "neutral")],
    timeline: [t("22:39", "OTP sent", "neutral"), t("22:47", "MFA destination changed", "caution"), t("22:56", "Transfer challenge sent", "caution")],
    trainingTip: "MFA can be bypassed by social engineering or profile change. Do not treat MFA pass as automatic customer liability."
  },
  financial: {
    title: "Financial Investigation",
    summary: "Money movement, deposits, cash activity, digital payments, linked accounts, and behavior trends.",
    rows: [row("Available balance", "$2,486.42", "neutral"), row("Recent deposits", "Biweekly ACH stable", "good"), row("New external account", "First seen during case window", "caution"), row("Digital payments", "No normal pattern to new destination", "caution"), row("Cash activity", "No unusual ATM pattern", "good"), row("Trend", "Outflow request outside normal behavior", "caution")],
    trainingTip: "Ask if the money makes sense for the person, business, timing, and account history."
  },
  identity: {
    title: "Identity Intel / People Search",
    summary: "Fictional identity dossier with masked records and evidence explorer.",
    rows: [row("Name/DOB", "Matches customer profile", "good"), row("Address history", "Current Dallas address seen for 4 years", "good"), row("Phone history", "Prior mobile tied to customer, new number not observed", "caution"), row("Email history", "Known email consistent", "good"), row("Public records", "No bankruptcy or watchlist match", "good")],
    trainingTip: "Identity consistency does not prove or disprove fraud. It gives baseline context."
  },
  link: {
    title: "Link Analysis",
    summary: "Relationship map across customer, device, IP, destination account, merchant, and business.",
    rows: [row("Customer to trusted device", "Strong historical link", "good"), row("Customer to new device", "No prior link", "caution"), row("New device to destination", "Same session added account and attempted transfer", "caution"), row("Destination account", "First seen in fraud case data", "caution")],
    trainingTip: "Link analysis is strongest when it shows the chain of control."
  },
  transaction: {
    title: "Transaction Details",
    summary: "Posted transaction, merchant descriptor, amount, channel, and timing.",
    rows: [row("Merchant", "MX TAXI SERVICIOS", "neutral"), row("Quoted amount", "$20.00 equivalent", "neutral"), row("Posted amount", "$50.00", "caution"), row("Channel", "Card-present", "neutral"), row("Wallet token", "Not involved", "good"), row("Duplicate", "No duplicate found", "good")],
    timeline: [t("19:14", "Taxi transaction authorized", "neutral"), t("09:20", "Customer noticed amount mismatch", "neutral"), t("08:30", "Dispute filed", "neutral")],
    trainingTip: "For amount disputes, do not ask ATO or wallet questions unless the evidence points there."
  },
  authorization: {
    title: "Authorization Review",
    summary: "Entry mode, approved amount, clearing amount, token, AVS/CVV/3DS, and EMV data.",
    rows: [row("Entry mode", "Chip read", "good"), row("Authorization amount", "$50.00", "neutral"), row("Clearing amount", "$50.00", "neutral"), row("EMV result", "Chip data present", "good"), row("Lost/stolen indicators", "Not indicated by story", "good")],
    trainingTip: "Authorization tells how the transaction was accepted, not whether the merchant disclosed the amount."
  },
  merchant: {
    title: "Merchant Evidence",
    summary: "Merchant response, receipt, invoice, descriptor, order proof, refund proof, and policy evidence.",
    rows: [row("Response status", "Merchant response pending", "neutral"), row("Receipt", "No clear receipt uploaded", "caution"), row("Policy", "Taxi fare disclosure unavailable", "caution"), row("Refund proof", "No merchant refund found", "neutral")],
    trainingTip: "Merchant evidence should answer the exact dispute reason, not every fraud question."
  },
  merchantHistory: {
    title: "Merchant History",
    summary: "Customer history with merchant, category, or service usage.",
    rows: [row("Merchant prior use", "No prior transactions with exact descriptor", "neutral"), row("Category history", "Travel taxi activity during trip", "good"), row("Prior disputes", "No repeated taxi pattern", "good"), row("Usage after claim", "None", "neutral")],
    trainingTip: "Merchant history is context. It does not replace reason-code evidence."
  },
  priorClaims: {
    title: "Prior Claims Pattern",
    summary: "Past claims, outcomes, and repeated behavior patterns.",
    rows: [row("2025-12", "Card dispute paid after merchant non-response", "neutral"), row("2024-10", "Travel alert, no fraud claim", "good"), row("Pattern score", "No repeated high-risk dispute pattern", "good")],
    trainingTip: "Prior claims can reveal patterns, but each claim still needs evidence."
  },
  reasonCode: {
    title: "Reason Code Guide",
    summary: "Dispute lane, needed evidence, and output options.",
    rows: [row("Dispute lane", "Incorrect amount / duplicate / unauthorized based on subtype", "neutral"), row("Needed evidence", "Receipt, merchant response, authorization, customer statement", "neutral"), row("Irrelevant evidence", "ATO tools unless account access changed", "good"), row("Output", "Pay, deny, partial, request evidence, or escalate", "neutral")],
    trainingTip: "The reason code decides what proof matters. Keep the lane clean."
  },
  receipt: {
    title: "Receipt / Invoice",
    summary: "Receipt amount, invoice terms, credits, tax, tip, and service fees.",
    rows: [row("Receipt status", "Not provided", "caution"), row("Quoted amount", "$20.00 equivalent", "neutral"), row("Posted amount", "$50.00", "caution"), row("Tip/service fee", "Not disclosed in documents", "caution")],
    trainingTip: "Receipt review is a document problem, not a cyber problem."
  },
  fulfillment: {
    title: "Delivery / Return / Refund Review",
    summary: "Delivery, return tracking, cancellation, refund, and credit evidence.",
    rows: [row("Service received", "Customer confirms service received", "good"), row("Refund promised", "Merchant email indicates refund pending", "neutral"), row("Credit posted", "No credit located", "caution"), row("Return tracking", "Not applicable", "neutral")],
    trainingTip: "Non-fraud claims often turn on policy and follow-through."
  },
  terms: {
    title: "Terms / Policy Review",
    summary: "Merchant terms, cancellation policy, refund policy, and disclosure evidence.",
    rows: [row("Cancellation policy", "Not applicable", "neutral"), row("Refund timing", "3 to 5 business days claimed", "neutral"), row("Disclosure", "No fare disclosure provided", "caution"), row("Customer notice", "Customer says final amount not shown", "neutral")],
    trainingTip: "Terms matter when the customer participated but disputes billing, quality, or refund."
  },
  payrollProfile: {
    title: "Payroll Profile",
    summary: "Payroll history, run timing, normal employee count, and pay amount context.",
    rows: [row("Payroll cycle", "Biweekly Friday", "good"), row("Employee count", "42 active employees", "neutral"), row("Normal run", "$78,400 to $84,900", "good"), row("Current run", "$82,310 queued", "good"), row("Change timing", "2 hours before release", "caution")],
    trainingTip: "Payroll risk is prevention-first when funds have not released."
  },
  employee: {
    title: "Employee Profile",
    summary: "Employee relationship, prior deposits, contact path, and profile consistency.",
    rows: [row("Employee status", "Existing employee", "good"), row("Tenure", "3 years", "good"), row("Prior bank", "Bank of America checking", "good"), row("New account", "Green Dot prepaid", "caution"), row("Trusted phone", "On file, callback pending", "neutral")],
    trainingTip: "Existing employee does not make a new bank destination automatically safe."
  },
  bank: {
    title: "Bank Account Verification",
    summary: "Old account vs new destination, owner match, account type, status, first seen, and recoverability.",
    rows: [row("Prior bank", "Bank of America traditional checking, 18 prior deposits", "good"), row("New bank", "Green Dot prepaid debit", "caution"), row("Owner match", "Pending or unable to verify", "caution"), row("First seen", "Same day as change", "caution"), row("Recoverability", "Limited once funds release", "caution")],
    trainingTip: "A bank account can be real and still be the wrong destination."
  },
  changeRequest: {
    title: "Change Request Review",
    summary: "Requester, channel, content, approvals, and change trail.",
    rows: [row("Request channel", "Email to payroll admin", "neutral"), row("Requester", "Employee display name", "neutral"), row("Reply-to", "External look-alike address", "caution"), row("Approval", "Admin updated before callback", "caution")],
    timeline: [t("08:44", "Change request email received", "neutral"), t("09:05", "Admin updated account", "caution"), t("10:24", "Callback pending", "neutral")],
    trainingTip: "Display name is not verification. Trusted callback matters."
  },
  admin: {
    title: "Admin Activity",
    summary: "Admin login, MFA, IP, and portal changes tied to payroll or business updates.",
    rows: [row("Admin", "Payroll user p-admin-04", "neutral"), row("Login location", "Known office IP", "good"), row("MFA", "Push approved on trusted device", "good"), row("Action", "Direct deposit destination changed", "neutral"), row("Review need", "Was request verified before action?", "caution")],
    trainingTip: "A legitimate admin login can still process a fraudulent request."
  },
  callback: {
    title: "Callback Verification Log",
    summary: "Trusted callback attempts and outcomes.",
    rows: [row("Trusted number", "Phone from employee/vendor master record", "good"), row("Attempt 1", "No answer", "caution"), row("Attempt 2", "Voicemail left", "neutral"), row("Change confirmed", "Not confirmed", "caution"), row("Recommended control", "Pause pending change", "neutral")],
    trainingTip: "Callback must use known contact information, not the email thread."
  },
  payrollRun: {
    title: "Payroll Run Status",
    summary: "Release status, hold options, and possible recovery actions.",
    rows: [row("Run status", "Queued, not released", "good"), row("Release window", "Today 3:00 PM CT", "neutral"), row("Hold available", "Yes", "good"), row("Stop payroll", "Available before release", "good"), row("Recoverability", "Drops after funds release", "caution")],
    trainingTip: "If funds have not moved, prevention beats recovery."
  },
  emailHeaders: {
    title: "Email Headers",
    summary: "SPF, DKIM, DMARC, routing, From, Reply-To, and mailbox clues.",
    rows: [row("From", "billing@metroprintsupply.co", "caution"), row("Reply-To", "payables@metroprintsupply.co", "caution"), row("Known domain", "metroprintsupply.com", "good"), row("SPF", "Pass for look-alike domain", "neutral"), row("DMARC alignment", "Aligned to new domain, not vendor domain", "caution")],
    trainingTip: "Passing SPF on a look-alike domain is not the same as trusted vendor identity."
  },
  domain: {
    title: "Domain Lookup",
    summary: "Domain age, look-alike pattern, registrar, reputation, and DNS clues.",
    rows: [row("Domain", "metroprintsupply.co", "caution"), row("Real vendor", "metroprintsupply.com", "good"), row("Age", "9 days", "caution"), row("Registrar privacy", "Enabled", "neutral"), row("MX records", "New hosted mailbox", "caution")],
    trainingTip: "Aged domain and known relationship are stronger than a matching display name."
  },
  sender: {
    title: "Sender Analysis",
    summary: "Known sender behavior, style, timing, and mailbox rule clues.",
    rows: [row("Normal sender", "ap@metroprintsupply.com", "good"), row("Current sender", "billing@metroprintsupply.co", "caution"), row("Tone", "Urgent same-day payment request", "caution"), row("Prior bank changes", "None in 18 months", "good")],
    trainingTip: "BEC often hides inside normal business processes with one changed destination."
  },
  beneficiary: {
    title: "Beneficiary Review",
    summary: "Destination beneficiary, bank type, prior use, owner, and payment risk.",
    rows: [row("Prior beneficiary", "Wells Fargo business checking", "good"), row("New beneficiary", "Cash App / Sutton Bank", "caution"), row("Owner match", "Unable to verify", "caution"), row("Prior use", "None", "caution"), row("Recovery", "Limited once ACH releases", "caution")],
    trainingTip: "The beneficiary is often where BEC becomes visible."
  },
  paymentTimeline: {
    title: "Payment Timeline",
    summary: "Request, approval, payment, hold, callback, and release events.",
    rows: [row("09:02", "Vendor request received", "neutral"), row("09:14", "AP clerk opens bank change", "neutral"), row("09:22", "Manager asks for callback", "good"), row("09:45", "Payment placed on hold", "good")],
    timeline: [t("09:02", "Payment redirection request arrives", "caution"), t("09:22", "Trusted callback requested", "good"), t("09:45", "Payment hold placed", "good")],
    trainingTip: "Payment timeline helps decide if you can prevent loss or need recovery escalation."
  },
  income: {
    title: "Income Verification",
    summary: "Claimed income, deposits, paystubs, employer, and consistency review.",
    rows: [row("Claimed income", "$92,000 annually", "neutral"), row("Deposit average", "$5,210 monthly", "caution"), row("Paystub uploaded", "Yes, one recent stub", "neutral"), row("Employer match", "Pending verification", "caution"), row("Income trend", "Down 18% over 60 days", "caution")],
    trainingTip: "Credit risk needs supported income, not just stated income."
  },
  employment: {
    title: "Employment Verification",
    summary: "Employment status, tenure, source, and verification outcome.",
    rows: [row("Employer", "Riverside Medical Admin", "neutral"), row("Tenure", "2 years 4 months", "good"), row("Status", "Active per uploaded paystub", "neutral"), row("Verification source", "Employer callback pending", "caution")],
    trainingTip: "Use trusted verification channels when documents and cash flow do not fully align."
  },
  dti: {
    title: "DTI Calculator",
    summary: "Debt-to-income and ability-to-repay view.",
    rows: [row("Gross monthly income", "$7,666", "neutral"), row("Verified monthly income", "$5,210", "caution"), row("Monthly debt", "$2,640", "neutral"), row("DTI using claimed income", "34%", "good"), row("DTI using verified deposits", "51%", "caution")],
    trainingTip: "The same application can look different when you use verified income."
  },
  creditReport: {
    title: "Credit Report Summary",
    summary: "Fictional credit file summary with tradelines, utilization, inquiries, and derogatory items.",
    rows: [row("Score band", "Prime-minus training band", "neutral"), row("Utilization", "82% revolving", "caution"), row("Recent inquiries", "3 in 60 days", "caution"), row("Derogatory", "No bankruptcy", "good"), row("New accounts", "1 retail card opened", "caution")],
    trainingTip: "Credit file stress is not fraud by itself. It informs approval conditions."
  },
  bankStatements: {
    title: "Bank Statements",
    summary: "Statement-level deposits, balances, overdrafts, and cash flow.",
    rows: [row("Average balance", "$1,140", "neutral"), row("Overdrafts", "Two in last 45 days", "caution"), row("Payroll deposits", "Lower last 2 cycles", "caution"), row("Returned items", "None", "good")],
    trainingTip: "Statements can confirm income trend and repayment capacity."
  },
  paymentHistory: {
    title: "Payment History",
    summary: "Existing loan and card payment behavior.",
    rows: [row("Late payments", "None in 12 months", "good"), row("Minimum-only", "4 recent cycles", "caution"), row("AutoPay", "Enabled", "good"), row("Returned payment", "None", "good")],
    trainingTip: "Stable payment history can support conditions even when utilization is high."
  },
  utilization: {
    title: "Credit Utilization",
    summary: "Revolving balance, limits, and credit stress.",
    rows: [row("Current utilization", "82%", "caution"), row("Previous 90 days", "61% average", "caution"), row("Highest line", "$7,500", "neutral"), row("Balance transfer", "Requested in application purpose", "neutral")],
    trainingTip: "Utilization trend matters more than a single balance snapshot."
  },
  inquiries: {
    title: "Recent Inquiries",
    summary: "Recent application activity and new account search behavior.",
    rows: [row("30 days", "1 inquiry", "neutral"), row("60 days", "3 inquiries", "caution"), row("New accounts", "1 opened", "caution"), row("Industry", "Retail and personal loan", "neutral")],
    trainingTip: "Inquiries can show credit-seeking velocity, not automatic fraud."
  },
  kyb: {
    title: "KYB Review",
    summary: "Business legitimacy, registration, address, ownership, and operating history.",
    rows: [row("Business status", "Active LLC", "good"), row("Formation age", "14 months", "neutral"), row("Operating address", "Commercial mailbox listed", "caution"), row("NAICS", "Online retail", "neutral"), row("Revenue support", "Bank deposits inconsistent", "caution")],
    trainingTip: "KYB asks whether the business exists, operates, and fits the requested credit."
  },
  businessRegistration: {
    title: "Business Registration",
    summary: "Secretary of State style registration and filing review.",
    rows: [row("SOS status", "Active", "good"), row("Registered agent", "Third-party agent service", "neutral"), row("Address", "Virtual office suite", "caution"), row("Filing history", "No annual report yet", "neutral")],
    trainingTip: "An active registration is only one piece of business legitimacy."
  },
  ownerKyc: {
    title: "Owner KYC",
    summary: "Beneficial owner identity, contact, address, and watchlist screening.",
    rows: [row("Owner name", "Matches application", "good"), row("Masked SSN", "Issued before DOB window check passed", "good"), row("Address", "Thin file at business address", "caution"), row("OFAC", "No match", "good")],
    trainingTip: "Owner KYC supports KYB but does not validate revenue alone."
  },
  revenue: {
    title: "Revenue / Cash Flow",
    summary: "Business deposits, settlement history, revenue claims, and cash-flow fit.",
    rows: [row("Claimed revenue", "$68,000 monthly", "neutral"), row("Verified deposits", "$31,400 monthly average", "caution"), row("Large draws", "Three draws after credit line approval request", "caution"), row("NSF", "One business NSF", "caution")],
    trainingTip: "Bust-out risk often shows as credit appetite outrunning real cash flow."
  },
  profileVerify: {
    title: "Profile Verify",
    summary: "Applicant identity profile consistency.",
    rows: [row("Name", "Matches application", "good"), row("DOB", "Matches ID", "good"), row("SSN pattern", "Valid format, masked", "good"), row("Address", "Recent first seen", "caution"), row("Email age", "12 days", "caution")],
    trainingTip: "Application review is about consistency across identity, device, and documents."
  },
  driverLicense: {
    title: "Driver License Review",
    summary: "Document OCR, MRZ/barcode, expiration, and selfie comparison.",
    rows: [row("OCR name", "Matches application", "good"), row("Barcode", "Readable", "good"), row("Expiration", "Valid", "good"), row("Address", "Differs from application", "caution"), row("Tamper signals", "None detected in training image", "good")],
    trainingTip: "A valid ID can still conflict with address or device evidence."
  },
  selfie: {
    title: "Selfie Verification",
    summary: "Liveness, face match, and capture quality.",
    rows: [row("Liveness", "Passed", "good"), row("Face match", "Medium confidence", "neutral"), row("Lighting", "Acceptable", "good"), row("Replay risk", "None detected", "good")],
    trainingTip: "Selfie is one control. It should align with the full application profile."
  },
  address: {
    title: "Address Verification",
    summary: "Residential address, mailing address, property, and delivery signals.",
    rows: [row("Application address", "Dallas apartment", "neutral"), row("USPS deliverable", "Yes", "good"), row("First seen", "3 months", "neutral"), row("Utility bill", "Not uploaded", "caution"), row("Mail drop", "No", "good")],
    trainingTip: "Address proof should fit identity history and document evidence."
  },
  phone: {
    title: "Phone Verification",
    summary: "Phone ownership, carrier, age, VoIP, and risk signals.",
    rows: [row("Line type", "Mobile", "good"), row("Carrier", "Major carrier", "good"), row("First seen", "18 months", "good"), row("Recent port", "No", "good"), row("Owner match", "Partial match", "neutral")],
    trainingTip: "Phone age and ownership can be a stabilizing signal in application review."
  },
  email: {
    title: "Email Verification",
    summary: "Email age, domain, breach, and profile link review.",
    rows: [row("Domain", "Consumer webmail", "neutral"), row("Age", "12 days", "caution"), row("Breach exposure", "No training hit", "good"), row("Name match", "Username partially matches", "neutral")],
    trainingTip: "New email plus new device plus thin address is more meaningful than new email alone."
  },
  positivePay: {
    title: "Positive Pay",
    summary: "Issued check file comparison, payee, amount, check number, and exception status.",
    rows: [row("Check number", "1842", "neutral"), row("Issued file", "No matching issued item", "caution"), row("Payee", "Altered from vendor master", "caution"), row("Amount", "$4,880.00", "neutral"), row("Exception", "Open review", "caution")],
    trainingTip: "Positive Pay exceptions need image and endorsement review before a final action."
  },
  checkImage: {
    title: "Check Image",
    summary: "Front image, MICR, payee, amount, signature, and alteration review.",
    rows: [row("MICR", "Readable", "good"), row("Payee", "Mismatch from issued file", "caution"), row("Amount box", "$4,880.00", "neutral"), row("Signature", "Requires comparison", "neutral"), row("Alteration", "Possible payee overwrite", "caution")],
    trainingTip: "Image review is evidence, not a handwriting verdict by itself."
  },
  endorsement: {
    title: "Endorsement Review",
    summary: "Back image, endorsement name, deposit account, and bank-of-first-deposit clues.",
    rows: [row("Endorsement", "For mobile deposit only", "neutral"), row("Endorser", "Name mismatch", "caution"), row("Deposit bank", "Fintech partner bank", "caution"), row("Repeat device", "No prior link", "caution")],
    trainingTip: "Endorsement tells where the item went and whether the payee story fits."
  },
  velocity: {
    title: "Velocity Review",
    summary: "Payment activity frequency, amount spikes, and timing clusters.",
    rows: [row("Daily items", "6 checks today vs 1 average", "caution"), row("Amount spike", "3.4x normal daily outflow", "caution"), row("New payees", "4 first-time payees", "caution"), row("Prior behavior", "Low check usage", "good")],
    trainingTip: "Velocity is stronger when paired with image, payee, and bank verification evidence."
  }
};

function tools(overrides = {}) {
  return clone({ ...richTools, ...overrides });
}

function baseCase({ lane, id, title, subtype, priority = "Medium", exposure = "$1,250.00", summary, statement, intakeQuestions, intakeAnswers, profileData, suggestedTools, documents, timeline, expectedIndicators, correctDetermination, debrief, toolOverrides }) {
  return {
    id,
    lane,
    title,
    subtype,
    priority,
    exposure,
    status: "Active",
    assignedDate: "2026-07-15",
    reportedDate: "2026-07-15 09:12",
    issueStart: "2026-07-14 20:20",
    summary,
    statement,
    intakeQuestions,
    intakeAnswers,
    profile: profileData,
    suggestedTools,
    tools: tools(toolOverrides),
    documents: { ...commonDocs, ...documents },
    timeline,
    expectedIndicators,
    correctDetermination,
    debrief
  };
}

const atoQuestions = ["When did you first notice the problem?", "Were you locked out?", "Did you receive password reset alerts?", "Did you receive MFA/OTP alerts?", "Did you click a suspicious link, text, or email?", "Did someone call pretending to be the bank?", "Did you share a code?", "Do you recognize the login device?", "Do you recognize the login location?", "Did your phone, email, password, MFA, payee, wallet, or external account change?", "What activity are you disputing?"];
const chargebackAmountQuestions = ["What amount were you quoted?", "What amount posted to the account?", "Did you hand your card to the merchant?", "Did you receive a receipt?", "Was tip, tax, currency conversion, or service fee explained?", "Did you contact the merchant?", "Did the merchant promise a refund?", "Were there duplicate charges?", "Were you traveling at the time?", "Did the merchant keep the card out of view?", "Did you authorize the final amount shown?"];
const lostCardQuestions = ["Was the card lost or stolen?", "When did you last have the card?", "Was the card in your possession?", "Did anyone else have access to the card?", "Was the PIN written on or near the card?", "What was your last valid transaction?", "When did you report the card lost/stolen?"];
const payrollQuestions = ["Who requested the change?", "Was the employee/vendor new or existing?", "Was the bank account used before?", "Was the request made by email, portal, phone, or admin user?", "Who can verify by phone using trusted contact information?", "Does the payroll amount match normal history?", "Was the business owner, accountant, HR, or payroll admin contacted?", "Was the new account traditional bank, prepaid, fintech, or payroll card?"];
const creditQuestions = ["Is this a new or existing loan/card request?", "What income or revenue was claimed?", "Has income/revenue recently changed?", "Are there NSF, overdraft, or late payment signs?", "Are there recent inquiries or new accounts?", "Is there bankruptcy or public record history?", "Is the requested amount normal for the customer/business relationship?", "Are balances, credit limits, utilization, and payment history stable?"];

export const caseTemplates = [
  baseCase({
    id: "ATO-SEED", lane: "ATO", title: "Account Takeover Claim", subtype: "Profile change before disputed activity", priority: "High", exposure: "$1,850.00",
    summary: "Customer reports being unable to access online banking after receiving password reset and MFA text alerts late at night. Customer states they did not request the reset, did not recognize the device or location, and later noticed an external transfer attempt after contact information changed.",
    statement: "I woke up to messages about a password reset and a code. I did not ask for that. When I tried to log in, my password did not work. My phone number looked changed and I saw a transfer I did not make.",
    intakeQuestions: atoQuestions,
    intakeAnswers: { "First noticed": "2026-07-13 around 6:30 AM", "Locked out": "Yes", "Code shared": "Customer denies sharing code", "Recognizes device/location": "No", "Disputed activity": "External transfer attempt and profile changes" },
    profileData: profile("Maya Ellison", 0, { profileChanges: [{ time: "2026-07-12 22:47", event: "Mobile phone changed", oldValue: "(***) ***-0148", newValue: "(***) ***-8842", channel: "Online banking", source: "First-seen Android device", device: "DEV-FIC-91A7", ip: "203.0.113.77", mfa: "SMS OTP", notes: "Change occurred minutes before transfer attempt" }] }),
    suggestedTools: ["Customer 360", "Login History", "Session History", "Device Intelligence", "IP Intelligence", "MFA History", "Financial Investigation"],
    documents: { "Policies / Terms": ["Digital banking access terms", "External transfer hold policy"] },
    timeline: [["2026-07-12 22:35", "Failed login attempts begin"], ["2026-07-12 22:41", "Successful login from first-seen device"], ["2026-07-12 22:47", "Mobile phone changed"], ["2026-07-12 22:56", "Transfer attempt held"], ["2026-07-13 09:12", "Customer reports lockout and dispute"]],
    expectedIndicators: ["First-seen device near loss event", "Password reset before money movement", "MFA sent to newly changed phone/email"],
    correctDetermination: "Support Customer Claim",
    debrief: "Senior review focuses on sequence: failed logins, first-seen device, phone change, external account add, then transfer attempt."
  }),
  baseCase({
    id: "FCB-LOST-SEED", lane: "FRAUD_CHARGEBACK", title: "Fraud Chargeback Claim", subtype: "Lost card retail use", priority: "Medium", exposure: "$612.44",
    summary: "Customer states their debit card was lost after grocery shopping. Two retail purchases posted later that evening at stores the customer does not recognize.",
    statement: "I had my card at the grocery store, then later I could not find it. I did not make the two evening charges and I reported the card missing once I noticed.",
    intakeQuestions: lostCardQuestions,
    intakeAnswers: { "Card status": "Lost", "Last valid transaction": "FreshMart Grocery 2:16 PM", "PIN written near card": "No", "Report time": "8:42 PM", "Disputed activity": "Two card-present retail purchases" },
    profileData: profile("Devon Lewis", 5),
    suggestedTools: ["Transaction Details", "Authorization Review", "Merchant Evidence", "Prior Claims", "Reason Code Guide"],
    documents: { "Card / Check Documents": ["Card authorization record", "Merchant receipt copy"], "Merchant / Third-Party Documents": ["Merchant response letter"] },
    timeline: [["14:16", "Last valid grocery purchase"], ["18:42", "First disputed retail purchase"], ["19:05", "Second disputed retail purchase"], ["20:42", "Card reported lost"]],
    expectedIndicators: ["Device/IP inconsistent with customer history"],
    correctDetermination: "Pay Claim",
    debrief: "Lost-card fraud analysis should focus on card possession timeline, entry mode, merchant proof, and report timing."
  }),
  baseCase({
    id: "NCB-AMOUNT-SEED", lane: "NON_FRAUD_CHARGEBACK", title: "Non-Fraud Chargeback Claim", subtype: "Incorrect amount / merchant possession", priority: "Medium", exposure: "$50.00",
    summary: "Customer reports a taxi in Mexico quoted the equivalent of $20.00, but the final posted amount was $50.00. Customer states the card was handed to the driver during payment and noticed the higher amount later.",
    statement: "The taxi driver said it would be about twenty dollars. I gave him my card to pay, and later my account showed fifty dollars. I had my card before and after the ride.",
    intakeQuestions: chargebackAmountQuestions,
    intakeAnswers: { "Quoted amount": "$20.00 equivalent", "Posted amount": "$50.00", "Receipt": "No clear receipt", "Traveling": "Yes, Mexico", "Merchant contacted": "No contact information available" },
    profileData: profile("Alina Soto", 2),
    suggestedTools: ["Customer 360", "Transaction Details", "Receipt / Invoice", "Merchant Evidence", "Reason Code Guide"],
    documents: { "Uploaded Documents": ["Customer travel statement"], "Card / Check Documents": ["Card authorization record"], "Policies / Terms": ["Incorrect amount dispute evidence checklist"] },
    timeline: [["2026-07-11 19:14", "Taxi transaction authorized for $50.00"], ["2026-07-12 09:20", "Customer reviews posted amount"], ["2026-07-13 08:30", "Customer files amount dispute"]],
    expectedIndicators: ["Consistent customer timeline"],
    correctDetermination: "Request More Evidence",
    debrief: "This stays in the non-fraud chargeback lane. PIN, Apple Pay, and ATO questions would be irrelevant without supporting facts."
  }),
  baseCase({
    id: "FPF-SEED", lane: "FIRST_PARTY", title: "First-Party Fraud Claim", subtype: "Digital goods used after dispute", priority: "High", exposure: "$389.97",
    summary: "Customer denies several digital gaming purchases, but merchant logs show the same household device accessed and consumed the items after purchase.",
    statement: "I do not recognize these gaming gift card purchases. I need the money returned.",
    intakeQuestions: ["Do you recognize the merchant?", "Does anyone in the household use the account?", "Were digital goods received or used?", "Have you disputed similar purchases before?", "Did you contact the merchant?"],
    intakeAnswers: { "Household users": "Customer says child has console access", "Merchant contact": "No", "Digital goods": "Customer denies use", "Prior similar disputes": "Two in 90 days" },
    profileData: profile("Riley Monroe", 6),
    suggestedTools: ["Transaction Details", "Device / Usage Match", "Merchant Usage", "Prior Claims Pattern", "Reason Code Guide"],
    documents: { "Merchant / Third-Party Documents": ["Merchant usage log", "Digital item redemption report"], "Policies / Terms": ["Digital goods dispute checklist"] },
    timeline: [["20:11", "Digital goods purchase"], ["20:18", "Items redeemed from household console"], ["20:50", "Second purchase and redemption"], ["Next day", "Customer files dispute"]],
    expectedIndicators: ["Repeated similar prior claims", "Strong proof of delivery conflicts with claim"],
    correctDetermination: "Do Not Support Customer Claim",
    debrief: "First-party review should compare customer statement against usage, device, delivery, and prior pattern evidence."
  }),
  baseCase({
    id: "PAY-SEED", lane: "PAYROLL", title: "Payroll / Direct Deposit Change Claim", subtype: "Existing employee destination changed before payroll run", priority: "High", exposure: "$3,050.00",
    summary: "Business payroll admin received an email requesting an existing employee direct deposit change before payroll release. The employee has been paid to the same Bank of America account for 18 payroll cycles, but the new destination is a Green Dot prepaid account first seen today.",
    statement: "The request looked like it came from our employee, so the payroll admin updated the account. We have not released payroll yet. We need to know if we should pause the change until we verify by phone.",
    intakeQuestions: payrollQuestions,
    intakeAnswers: { "Requester": "Email displaying employee name", "Employee status": "Existing employee", "Prior bank": "Bank of America", "New bank": "Green Dot prepaid debit", "Callback": "Pending" },
    profileData: profile("Northstar Floral LLC", 3, { business: true, products: [{ product: "Business Checking", status: "Open", balance: "$68,405.20", limit: "N/A", standing: "No NSF" }, { product: "Payroll Product", status: "Active", balance: "N/A", limit: "Payroll release limit $85,000", standing: "Normal run timing" }, { product: "Digital Banking", status: "Active", balance: "N/A", limit: "Admin controlled", standing: "MFA enabled" }] }),
    suggestedTools: ["Payroll Profile", "Employee Profile", "Bank Verification", "Change Request Review", "Admin Activity", "Callback Verification", "Payroll Run Status"],
    documents: { "Uploaded Documents": ["Payroll change request email"], "Payroll / Business Documents": ["Direct deposit change form", "Payroll register"], "Policies / Terms": ["Direct deposit change verification control"] },
    timeline: [["08:44", "Email request received"], ["09:05", "Payroll admin updates destination"], ["09:40", "Payroll run queued"], ["10:24", "Trusted callback pending"]],
    expectedIndicators: ["New beneficiary or payroll destination", "Bank account ownership mismatch", "Callback could not verify the requested change"],
    correctDetermination: "Pause Direct Deposit Change",
    debrief: "Because payroll has not released and the new prepaid account is first seen, pause until trusted callback verification confirms the change."
  }),
  baseCase({
    id: "BEC-SEED", lane: "BEC", title: "Email Fraud / BEC Claim", subtype: "Vendor payment redirection", priority: "Critical", exposure: "$18,770.00",
    summary: "A vendor emailed updated ACH instructions for an invoice. The AP clerk noticed the tone felt urgent and the new account was a fintech account instead of the vendor's prior business checking account.",
    statement: "The vendor says their bank changed and asked for same-day payment. The invoice is real, but the destination account is new.",
    intakeQuestions: payrollQuestions,
    intakeAnswers: { "Requester": "Vendor contact by email", "Vendor status": "Existing vendor", "Prior bank": "Wells Fargo business checking", "New bank": "Cash App / Sutton Bank", "Callback": "Requested, not completed" },
    profileData: profile("Blue Wren Events", 7, { business: true }),
    suggestedTools: ["Email Headers", "Domain Lookup", "Sender Analysis", "Beneficiary Review", "Bank Verification", "Payment Timeline", "Callback Verification"],
    documents: { "Uploaded Documents": ["Vendor bank change email"], "Payroll / Business Documents": ["Vendor master record", "Invoice packet"], "Policies / Terms": ["Vendor payment change control"] },
    timeline: [["09:02", "Vendor bank-change email received"], ["09:22", "AP manager requests callback"], ["09:45", "Payment placed on hold"]],
    expectedIndicators: ["Look-alike domain or reply-to mismatch", "New beneficiary or payroll destination", "Callback could not verify the requested change"],
    correctDetermination: "Pause Payment",
    debrief: "BEC analysis centers on requester identity and destination control. Pause payment until verified through known contact information."
  }),
  baseCase({
    id: "CR-SEED", lane: "CREDIT_RISK", title: "Credit Risk Review", subtype: "Existing customer personal loan increase", priority: "Medium", exposure: "$9,500.00",
    summary: "Existing customer requests a personal loan while revolving utilization is high and recent deposit activity is lower than stated income. The account relationship is established, but repayment capacity and documentation need review before approval.",
    statement: "I am requesting a personal loan to consolidate bills. My income is stable, but my last few deposits were lower because of reduced hours.",
    intakeQuestions: creditQuestions,
    intakeAnswers: { "Request type": "Existing customer personal loan", "Claimed income": "$92,000 annually", "Recent change": "Reduced hours", "Overdraft": "Two overdrafts in last 45 days", "Bankruptcy": "No" },
    profileData: profile("Andre Coleman", 4, { accountStanding: "Watch for payment stress" }),
    suggestedTools: ["Income Verification", "Employment Verification", "DTI Calculator", "Credit Report Summary", "Cash Flow Review", "Bank Statements", "Payment History", "Credit Utilization"],
    documents: { "Uploaded Documents": ["Loan application", "Paystub uploaded"], "Payroll / Business Documents": ["Employment verification request"], "Policies / Terms": ["Personal loan underwriting checklist"] },
    timeline: [["12:04", "Loan application submitted"], ["12:10", "Credit report pulled"], ["12:18", "Cash flow review opened"], ["12:30", "Income verification pending"]],
    expectedIndicators: ["High DTI or unsupported income", "Recent credit draw followed by reduced deposits"],
    correctDetermination: "Request Additional Documents",
    debrief: "Separate credit risk from fraud. The relationship may be real, but high utilization and lower deposits support more documentation."
  }),
  baseCase({
    id: "BUS-SEED", lane: "BUSINESS_BUSTOUT", title: "Business Loan / Bust-Out Review", subtype: "Sleeper LLC sudden credit draw", priority: "High", exposure: "$42,000.00",
    summary: "Business requests a large credit line after a dormant operating period. Registration is active, but revenue deposits are thin and requested credit exceeds verified cash flow.",
    statement: "We need a larger line for inventory. Sales are growing, and we expect more orders next month.",
    intakeQuestions: creditQuestions,
    intakeAnswers: { "Business age": "14 months", "Claimed revenue": "$68,000 monthly", "Verified deposits": "$31,400 average", "Recent inquiries": "Multiple business credit apps", "Requested amount": "$42,000" },
    profileData: profile("Brightline Goods LLC", 8, { business: true }),
    suggestedTools: ["KYB Review", "Business Registration", "Owner KYC", "Revenue / Cash Flow", "Credit Report", "Bank Statements"],
    documents: { "Payroll / Business Documents": ["Articles of organization", "Business bank statements", "Owner certification"], "Policies / Terms": ["Small business credit policy"] },
    timeline: [["08:30", "Business credit app submitted"], ["08:43", "KYB status active"], ["09:05", "Revenue mismatch noted"], ["09:20", "Credit risk escalation opened"]],
    expectedIndicators: ["High DTI or unsupported income", "Velocity spike outside normal behavior"],
    correctDetermination: "Hold Pending Verification",
    debrief: "A real business can still present bust-out risk if verified revenue and credit appetite do not fit."
  }),
  baseCase({
    id: "APP-SEED", lane: "APPLICATION", title: "Application Verification Review", subtype: "ID document mismatch with new device", priority: "Medium", exposure: "$0.00",
    summary: "New applicant passes basic identity format checks, but the email is new, the address is thin, and the driver license address differs from the application.",
    statement: "I just moved and need to open an account. My ID has my previous address, but the new apartment is where I live now.",
    intakeQuestions: ["What document was uploaded?", "Does the ID match the application?", "Is the address current?", "Is phone/email verified?", "Is the device trusted or first seen?", "Is liveness complete?"],
    intakeAnswers: { "Document": "Driver license", "ID match": "Name/DOB match", "Address": "Different from application", "Email age": "12 days", "Device": "First seen" },
    profileData: profile("Harper Vale", 9),
    suggestedTools: ["Profile Verify", "Driver License Review", "Selfie Verification", "Address Verification", "Phone Verification", "Email Verification", "Device Search", "IP Intelligence", "Identity Intel"],
    documents: { "Uploaded Documents": ["Driver license image", "Selfie capture", "Proof of residence requested"], "Policies / Terms": ["KYC application checklist"] },
    timeline: [["14:12", "Application submitted"], ["14:13", "Device first seen"], ["14:15", "License OCR complete"], ["14:17", "Address proof requested"]],
    expectedIndicators: ["Device/IP inconsistent with customer history"],
    correctDetermination: "Request Additional Documents",
    debrief: "Application verification should request proof when identity fields mostly match but address and device signals are thin."
  }),
  baseCase({
    id: "ACH-SEED", lane: "ACH_WIRE_CHECK", title: "ACH / Wire / Check Review", subtype: "Positive Pay exception with payee mismatch", priority: "High", exposure: "$4,880.00",
    summary: "A business check posts as a Positive Pay exception. The check number was not in the issued file, the payee appears altered, and the endorsement bank is a fintech partner bank.",
    statement: "We do not recognize this check item. The check number is in our range, but this payee was not authorized.",
    intakeQuestions: ["Was the item issued by the business?", "Does the check number match issued file?", "Does payee match vendor records?", "Is the endorsement consistent?", "Was there recent check stock loss?", "Can treasury verify the item?"],
    intakeAnswers: { "Issued file": "No match", "Payee": "Mismatch", "Endorsement": "Fintech deposit", "Check stock loss": "Unknown", "Treasury callback": "Pending" },
    profileData: profile("Luna Logistics Co.", 10, { business: true }),
    suggestedTools: ["Payment Details", "Bank Account Verification", "Positive Pay", "Check Image", "Endorsement Review", "Velocity Review"],
    documents: { "Card / Check Documents": ["Check image front", "Check image back", "Positive Pay exception report"], "Payroll / Business Documents": ["Treasury callback log"], "Policies / Terms": ["Check fraud review procedure"] },
    timeline: [["10:05", "Check exception received"], ["10:11", "Issued file mismatch confirmed"], ["10:18", "Back image endorsement reviewed"], ["10:32", "Treasury callback pending"]],
    expectedIndicators: ["Bank account ownership mismatch", "Velocity spike outside normal behavior"],
    correctDetermination: "Hold Payment",
    debrief: "Positive Pay, check image, and endorsement evidence should be reviewed together before paying or denying the item."
  })
];

const subtypePool = {
  ATO: ["Profile change before disputed activity", "OTP phishing with new external account", "SIM swap before transfer", "Remote access session and payee add"],
  FRAUD_CHARGEBACK: ["Lost card retail use", "Stolen wallet card-present spree", "Never received card first use", "CNP digital goods denial", "Tokenized wallet fraud"],
  NON_FRAUD_CHARGEBACK: ["Incorrect amount / merchant possession", "Duplicate billing refund not received", "Canceled service billed again", "Item not as described"],
  FIRST_PARTY: ["Digital goods used after dispute", "Household member purchase denial", "Subscription remorse", "Item not received with delivery proof"],
  PAYROLL: ["Existing employee destination changed before payroll run", "Spoofed employee email request", "Compromised payroll admin portal", "Fake new-hire payroll setup"],
  BEC: ["Vendor payment redirection", "Look-alike domain invoice update", "CEO urgent wire request", "Mailbox rule forwarding and invoice change"],
  CREDIT_RISK: ["Existing customer personal loan increase", "Limit increase with rising utilization", "Income inflation review", "Balance transfer repayment stress"],
  BUSINESS_BUSTOUT: ["Sleeper LLC sudden credit draw", "Tradeline piggyback business app", "Synthetic owner identity risk", "Rapid credit-line stacking"],
  APPLICATION: ["ID document mismatch with new device", "Address cannot be verified", "Liveness review with thin profile", "VoIP phone and new email profile"],
  ACH_WIRE_CHECK: ["Positive Pay exception with payee mismatch", "ACH debit return pattern", "Wire beneficiary change", "Check image endorsement mismatch"]
};

export function generateCase(templateLane = "RANDOM") {
  const lanes = Object.keys(CLAIM_FAMILIES);
  const lane = templateLane === "RANDOM" ? pick(lanes) : templateLane;
  const pool = caseTemplates.filter((template) => template.lane === lane);
  const template = clone(pick(pool.length ? pool : caseTemplates));
  const sequence = `${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`;
  const isBusiness = ["PAYROLL", "BEC", "BUSINESS_BUSTOUT", "ACH_WIRE_CHECK"].includes(template.lane);
  const name = isBusiness ? pick(businesses) : pick(names);
  const subtype = pick(subtypePool[template.lane] || [template.subtype]);
  const exposure = template.lane === "APPLICATION" ? "$0.00" : money(template.lane.includes("CHARGEBACK") ? 35 : 450, template.lane === "CREDIT_RISK" || template.lane === "BUSINESS_BUSTOUT" ? 55000 : 15000);

  template.id = `${template.lane}-${sequence}`;
  template.subtype = subtype;
  template.status = "Active";
  template.priority = pick(priorities);
  template.exposure = exposure;
  template.assignedDate = new Date().toISOString().slice(0, 10);
  template.reportedDate = new Date().toLocaleString();
  template.issueStart = new Date(Date.now() - Math.floor(2 + Math.random() * 96) * 3600000).toLocaleString();
  template.profile.name = name;
  template.profile.customerId = `FA-${Math.floor(100000 + Math.random() * 899999)}`;
  template.summary = rewriteSummary(template, subtype, exposure);
  template.statement = rewriteStatement(template, subtype);
  template.timeline = template.timeline.map(([time, event], index) => [index === 0 ? template.issueStart : time, event.replace(template.subtype, subtype)]);
  return template;
}

function rewriteSummary(template, subtype, exposure) {
  const prefix = CLAIM_FAMILIES[template.lane];
  if (template.lane === "ATO") return `Customer reports suspicious account access tied to ${subtype.toLowerCase()}. The case exposure is ${exposure}. Review login, device, MFA, profile change, and money movement sequence before choosing a determination.`;
  if (template.lane.includes("CHARGEBACK") || template.lane === "FIRST_PARTY") return `${prefix} involving ${subtype.toLowerCase()}. The customer statement, transaction details, merchant records, and reason-code evidence must stay in the correct dispute lane. Exposure is ${exposure}.`;
  if (template.lane === "PAYROLL") return `Payroll team is reviewing ${subtype.toLowerCase()} before funds release. Compare request channel, trusted callback, employee profile, old vs new bank, and payroll run status. Exposure is ${exposure}.`;
  if (template.lane === "BEC") return `Business payment review for ${subtype.toLowerCase()}. Review email headers, domain, sender behavior, beneficiary, callback, and bank verification before payment release. Exposure is ${exposure}.`;
  if (template.lane === "CREDIT_RISK") return `Credit risk review for ${subtype.toLowerCase()}. Compare stated income, verified deposits, DTI, utilization, inquiries, and payment history before approval. Exposure is ${exposure}.`;
  if (template.lane === "BUSINESS_BUSTOUT") return `Business credit review for ${subtype.toLowerCase()}. Compare KYB, owner KYC, registration, verified revenue, cash flow, and credit appetite. Exposure is ${exposure}.`;
  if (template.lane === "APPLICATION") return `Application verification review for ${subtype.toLowerCase()}. Review identity, document, address, phone, email, device, and IP signals without using real-person data.`;
  return `${prefix} for ${subtype.toLowerCase()}. Review the lane-specific evidence before deciding.`;
}

function rewriteStatement(template, subtype) {
  if (template.lane === "ATO") return "I do not recognize the login activity or the account changes. I need help understanding what happened and stopping any transfer.";
  if (template.lane === "PAYROLL") return "The request looked normal at first, but the destination account changed. We need to verify before payroll releases.";
  if (template.lane === "BEC") return "The invoice appears real, but the payment instructions changed and the request feels urgent.";
  if (template.lane === "CREDIT_RISK") return "I am requesting credit and can provide additional documents if needed.";
  if (template.lane === "BUSINESS_BUSTOUT") return "The business needs credit for growth, and we can send more documents if requested.";
  if (template.lane === "APPLICATION") return "I am trying to open the account and can upload more proof if something does not match.";
  if (template.lane === "ACH_WIRE_CHECK") return "We do not recognize this payment item and need the bank to review the document and destination.";
  return `I am disputing this ${subtype.toLowerCase()} and want the bank to review the evidence.`;
}

export function getDeterminationOptions(lane) {
  return determinationOptions[lane] || determinationOptions.ATO;
}

export function getVisibleNav(lane) {
  return [...universalPages.slice(0, 5), ...(toolNavByLane[lane] || []), ...universalPages.slice(5)];
}
