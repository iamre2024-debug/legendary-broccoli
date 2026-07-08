const TOOL_IO_CONTRACTS = {
  login: contract("Customer ID, date range, login event, device ID, IP", "Login events with timestamp, device, IP, browser, MFA result, and baseline fit."),
  session: contract("Customer ID, session ID, login event", "Session actions in order, including profile edits, enrollment attempts, and money movement."),
  device: contract("Device ID, customer ID, lane baseline", "Trusted/first-seen status, linked profiles, unusual browser, emulator/root context, and normal-device comparison."),
  ip: contract("IP address, customer ID, session window", "Prior sessions, linked profiles, region, proxy/VPN note, ASN-style context, and normal-location fit."),
  mfa: contract("Customer ID, login/session event, profile change event", "OTP/push/enrollment events, destination status, challenge result, and sequence impact."),
  financial: contract("Customer ID, account/product IDs, transaction window", "Deposits, cash flow, merchant behavior, linked-account movement, and lane-specific financial fit."),
  identity: contract("Masked ID, name, DOB/business profile, address, phone, email", "Fictional identity/background search sections with match, mismatch, and open-question context."),
  link: contract("Customer ID plus device, IP, account, merchant, beneficiary, or business identifiers", "Connected-record map showing relationships, repeated values, and cross-profile links without a verdict."),
  transaction: contract("Transaction/payment ID, customer ID, posted/auth date", "Posted activity, amount, descriptor, channel, account relationship, and timing context."),
  authorization: contract("Authorization ID, card/payment token, transaction timestamp", "Entry mode, approval result, auth metadata, token/device context, and dispute-relevant evidence."),
  merchant: contract("Merchant name/descriptor, transaction ID, customer dispute lane", "Merchant response, refund/service proof, descriptor context, and unresolved evidence gaps."),
  merchantHistory: contract("Merchant name/category and customer ID", "Prior merchant activity, usage pattern, refund history, and whether current use fits normal behavior."),
  priorClaims: contract("Customer ID and claim history window", "Prior claim list with dates, types, outcomes, and pattern context without labeling the current claim."),
  reasonCode: contract("Claim lane, transaction type, merchant evidence, customer statement", "Reason-code options, required evidence, deadlines/checklist context, and lane-safe next steps."),
  receipt: contract("Receipt/invoice image or values, transaction amount, merchant record", "Receipt, invoice, tip, tax, currency, and fee comparison against posted amount."),
  fulfillment: contract("Order/delivery/refund IDs, merchant packet, customer statement", "Delivery, return, cancellation, refund, proof-of-service, and missing-evidence status."),
  terms: contract("Merchant/service policy, disclosure date, customer statement", "Terms, cancellation/refund policy, disclosure fit, and reason-code relevance."),
  payrollProfile: contract("Business/customer ID, payroll run window, employee count", "Normal payroll cycle, run amount, funding pattern, payroll controls, and timing context."),
  employee: contract("Employee ID/profile, employer ID, trusted contact path", "Employee relationship, deposit history, contact path, and profile consistency."),
  bank: contract("Bank account/routing token, customer/business ID, destination account", "Ownership, prior use, bank type, first-seen timing, recoverability, and callback relevance."),
  changeRequest: contract("Change request ID, channel, requester, old/new values", "Request trail, approvals, requester identity, old/new destination, and verification state."),
  admin: contract("Admin/user ID, portal activity window, business profile", "Admin access, role, portal actions, MFA/context, and unusual timing without assuming safety."),
  callback: contract("Trusted contact source, callback attempt log, requester details", "Attempt outcomes, trusted-source comparison, challenge-response status, and release/hold relevance."),
  payrollRun: contract("Payroll run ID, funding account, release deadline", "Queued/released/held status, recovery window, release controls, and impacted amount."),
  emailHeaders: contract("Email header fields, sender, reply-to, routing data", "SPF/DKIM/DMARC, routing clues, from/reply-to comparison, and mailbox/domain risk context."),
  domain: contract("Domain, sender email, known vendor/customer contact", "Domain age, look-alike pattern, DNS/registrar/reputation clues, and trusted-record comparison."),
  sender: contract("Sender email, message body signals, prior communication history", "Sender behavior, tone/urgency, mailbox clues, and known-contact comparison."),
  beneficiary: contract("Beneficiary name/account, prior destination, payment instruction", "Owner match, prior use, bank type, first-seen status, and destination risk context."),
  paymentTimeline: contract("Payment request ID, approval steps, callback status", "Request-to-release sequence, holds, approvals, callback events, and recovery timing."),
  income: contract("Claimed income, deposits, paystub/employer evidence", "Income comparison, verified deposits, missing documents, employer fit, and credit-safe output."),
  employment: contract("Employer name, tenure/status evidence, contact source", "Employment status, tenure, verification source, and unresolved employment questions."),
  dti: contract("Verified income, debt obligations, requested exposure", "Debt-to-income calculation, policy threshold context, and ability-to-repay evidence."),
  creditReport: contract("Masked consumer/business credit file, inquiry/tradeline data", "Score band, tradelines, inquiries, utilization, derogatory items, and reason-code support."),
  bankStatements: contract("Statement period, account IDs, deposit/NSF data", "Deposits, balances, overdrafts, returned items, cash-flow support, and missing statement gaps."),
  paymentHistory: contract("Existing credit/loan account, payment dates, due dates", "Repayment stability, late/returned payments, hardship signals, and credit action context."),
  utilization: contract("Credit limits, balances, draw/usage history", "Utilization trend, stress indicators, exposure fit, and reduce/maintain context."),
  inquiries: contract("Credit pulls/applications by date", "Recent inquiry velocity, new account search behavior, and application-timing context."),
  kyb: contract("Business name, EIN, address, owner profile", "Entity status, operating history, address/ownership fit, and KYB gaps."),
  businessRegistration: contract("Secretary-of-State-style entity record, business address", "Registration status, filing age, entity type, address fit, and document gap status."),
  ownerKyc: contract("Owner/UBO masked ID, address, contact, business role", "Beneficial owner identity, contact/address match, watchlist-style context, and UBO gaps."),
  revenue: contract("Business deposits, claimed revenue, invoices/statements", "Revenue support, deposit trend, cash-flow strength, draws/NSFs, and exposure fit."),
  profileVerify: contract("Application identity fields, contact points, device/IP context", "Profile match, mismatches, new contact points, device/IP fit, and document requests."),
  driverLicense: contract("Government ID image/OCR/barcode fields", "OCR/barcode consistency, expiration, address match, tamper signals, and review status."),
  selfie: contract("Selfie/liveness capture and ID comparison", "Liveness, face match, quality, replay risk, and manual review status."),
  address: contract("Applicant/customer address and proof document", "Deliverability, tenure, utility proof, mail-drop risk, and first-seen timing."),
  phone: contract("Phone number, carrier/line metadata, profile history", "Line type, carrier, owner match, porting age, and first-seen context."),
  email: contract("Email address, domain age, exposure/profile linkage", "Email age, domain, exposure hints, profile links, and verification status."),
  positivePay: contract("Issued check file, presented item, payee/amount/check number", "Issued-file comparison, exception status, payee/amount/check-number match, and return/hold context."),
  checkImage: contract("Front check image fields, MICR, amount, payee, signature", "Image review, MICR/payee/amount/signature comparison, and alteration clues."),
  endorsement: contract("Back check image, endorser, deposit bank/account", "Endorsement, deposit path, account fit, and ownership/mismatch context."),
  velocity: contract("Customer/account activity window, amount/frequency thresholds", "Frequency, amount spikes, new payees, timing clusters, and baseline comparison.")
};

export function resolveToolIoContract(toolId) {
  return TOOL_IO_CONTRACTS[toolId] || contract("Active case ID, Customer 360 profile, lane-specific evidence key", "Evidence rows, timeline context, related documents, next actions, and no final verdict.");
}

export function toolIoRowsForTool(toolId) {
  const io = resolveToolIoContract(toolId);
  return [
    row("Expected input", io.input, "neutral"),
    row("Expected output", io.output, "neutral")
  ];
}

export function validateToolIoCoverage(toolNavByLane = {}) {
  const configuredTools = [...new Set(Object.values(toolNavByLane).flat().map((tool) => tool.id).filter(Boolean))];
  const missing = configuredTools.filter((toolId) => !TOOL_IO_CONTRACTS[toolId]);
  const incomplete = configuredTools.filter((toolId) => {
    const contract = resolveToolIoContract(toolId);
    return !contract.input || !contract.output || contract.input.length < 10 || contract.output.length < 10;
  });

  return {
    ok: missing.length === 0 && incomplete.length === 0,
    totalToolsChecked: configuredTools.length,
    missing,
    incomplete
  };
}

function contract(input, output) {
  return { input, output };
}

function row(k, v, flag = "neutral") {
  return { k, v, flag };
}
