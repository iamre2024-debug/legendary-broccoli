export function attachProfileSearchDirectory(profile = {}, scenario = {}) {
  const lane = scenario.lane || "ATO";
  const isPayrollOrBec = ["PAYROLL", "BEC", "BUSINESS_BUSTOUT"].includes(lane);
  const employeeDirectory = isPayrollOrBec ? buildEmployeeDirectory(profile, lane) : profile.employeeDirectory || [];
  const bankAccounts = buildBankAccounts(profile, lane, employeeDirectory);
  const searchableEntities = buildSearchableEntities(profile, employeeDirectory, bankAccounts, lane);

  return {
    ...profile,
    employeeDirectory,
    bankAccounts,
    searchableEntities,
    searchDirectoryReportSeeds: [
      `Customer/business lookup: ${profile.customerId || "customer ID pending"} · ${profile.maskedId || "masked ID pending"}`,
      `Employee directory records: ${employeeDirectory.length} fictional employee/vendor profile(s) available when lane requires it.`,
      `Bank account records: ${bankAccounts.length} fictional destination/prior account record(s) available for Bank Verification and Link Analysis.`,
      "Searchable entities are fictional/masked and should be used as lookup inputs, not final answers."
    ]
  };
}

function buildEmployeeDirectory(profile, lane) {
  const employerId = profile.customerId || "FA-BUSINESS";
  const employerName = profile.name || "Training Business";
  const primary = {
    employeeId: "EMP-1042",
    name: "Nia Carter",
    role: lane === "BEC" ? "AP specialist / vendor contact" : "Customer service associate",
    status: "Active",
    tenure: "18 payroll cycles",
    trustedPhone: "(555) 312-4418",
    trustedEmail: "nia.carter@example.test",
    employerId,
    employerName,
    priorBankAccountId: "BANK-PRIOR-7712",
    requestedBankAccountId: "BANK-NEW-8839",
    verificationStatus: "Trusted callback pending",
    notes: "Fictional employee record. Use trusted contact path, not incoming request details."
  };

  const secondary = {
    employeeId: "EMP-2088",
    name: "Malik Reed",
    role: "Payroll admin",
    status: "Active admin",
    tenure: "2 years",
    trustedPhone: "(555) 418-2206",
    trustedEmail: "malik.reed@example.test",
    employerId,
    employerName,
    priorBankAccountId: "BANK-ADMIN-5510",
    requestedBankAccountId: "No pending change",
    verificationStatus: "Admin activity review required",
    notes: "Fictional admin profile for portal activity comparison."
  };

  return [primary, secondary];
}

function buildBankAccounts(profile, lane, employeeDirectory = []) {
  const ownerName = maskBusinessOwner(profile.name || "Training Customer");
  const employee = employeeDirectory[0] || {};
  const accountStanding = profile.accountStanding || "Standing pending";

  const priorEmployeeBank = {
    bankAccountId: "BANK-PRIOR-7712",
    ownerName: employee.name || ownerName,
    ownerType: "Employee payroll destination",
    bankName: "Fictional National Bank",
    routingMasked: "0310****9",
    accountMasked: "****7712",
    accountType: "Checking",
    firstSeen: "2025-01-10",
    priorUse: "18 successful payroll cycles",
    ownershipMatch: "Matches employee profile",
    recoverability: "Normal payroll reversal path if not released",
    status: "Known prior account"
  };

  const requestedEmployeeBank = {
    bankAccountId: "BANK-NEW-8839",
    ownerName: employee.name || ownerName,
    ownerType: "Requested payroll/vendor destination",
    bankName: lane === "BEC" ? "Fictional Fintech Bank" : "Fictional Prepaid Program Bank",
    routingMasked: "1210****4",
    accountMasked: "****8839",
    accountType: lane === "BEC" ? "Business checking claimed" : "Prepaid payroll card",
    firstSeen: "2026-07-15",
    priorUse: "No prior use in this customer profile",
    ownershipMatch: "Needs verification",
    recoverability: "Limited if funds are released",
    status: "First-seen destination"
  };

  const customerFundingBank = {
    bankAccountId: "BANK-CUST-4201",
    ownerName: profile.name || ownerName,
    ownerType: "Customer/business funding account",
    bankName: "Fictional Treasury Bank",
    routingMasked: "1110****2",
    accountMasked: "****4201",
    accountType: "Business checking / funding",
    firstSeen: "2021-04-14",
    priorUse: "Normal deposits, ACH, card settlement, or payroll funding",
    ownershipMatch: accountStanding,
    recoverability: "Depends on payment rail and release state",
    status: "Customer 360 funding account"
  };

  return [priorEmployeeBank, requestedEmployeeBank, customerFundingBank];
}

function buildSearchableEntities(profile, employeeDirectory, bankAccounts, lane) {
  const keys = profile.lookupKeys || {};
  const customerEntities = [
    entity("Customer ID", profile.customerId, "Open Customer 360 and lane tools."),
    entity("Masked ID", profile.maskedId || keys.maskedId, "Run Identity/Profile Verify search."),
    entity("Phone", keys.phone || profile.phone, "Run Phone Verification or trusted callback comparison."),
    entity("Email", keys.email || profile.email, "Run Email Verification or sender/domain comparison."),
    entity("Device ID", keys.caseDeviceId, "Run Device Intelligence and Link Analysis."),
    entity("IP", keys.caseIp, "Run IP Intelligence and prior-session search.")
  ];

  const employeeEntities = employeeDirectory.flatMap((employee) => [
    entity("Employee ID", employee.employeeId, "Open Employee Profile and payroll/admin review."),
    entity("Employee trusted phone", employee.trustedPhone, "Use for callback verification only."),
    entity("Employee trusted email", employee.trustedEmail, "Compare against incoming request sender."),
    entity("Requested bank account", employee.requestedBankAccountId, "Open Bank Verification and Link Analysis.")
  ]);

  const bankEntities = bankAccounts.map((account) => entity("Bank account", account.bankAccountId, `${account.bankName} · ${account.accountMasked} · ${account.status}`));

  return [...customerEntities, ...employeeEntities, ...bankEntities].filter((item) => item.value);
}

function entity(type, value, use) {
  return { type, value, use };
}

function maskBusinessOwner(value) {
  const parts = String(value).split(/\s+/).filter(Boolean);
  if (parts.length < 2) return value;
  return `${parts[0]} ${parts[1][0]}.`;
}
