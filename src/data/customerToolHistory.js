export function fullHistoryRowsForTool(toolId, profile = {}, existingRows = []) {
  const baseRows = commonHistoryRows(profile);
  const specificRows = specificHistoryRows(toolId, profile);
  const directoryRows = searchDirectoryRows(profile, toolId);
  return uniqueRows([...existingRows, ...baseRows, ...specificRows, ...directoryRows]);
}

export function validateCustomerToolHistoryCoverage(toolNavByLane = {}) {
  const sampleProfile = {
    customerId: "FA-COVERAGE",
    name: "Training Customer",
    maskedId: "***-**-0199",
    customerSince: "2020-04-14",
    relationshipLength: "6 years",
    accountStanding: "Good standing",
    preferredContact: "Mobile app secure message",
    normalBehavior: {
      loginLocation: "Dallas, TX regular market",
      device: "Trusted iPhone 14 · Safari",
      deposits: "Biweekly payroll ACH",
      spending: "Card-present retail and recurring subscriptions"
    },
    lookupKeys: {
      maskedId: "***-**-0199",
      dob: "Training DOB",
      phone: "(555) 210-0199",
      email: "training.customer@example.test",
      trustedDeviceId: "DEV-TRUST-0199",
      caseDeviceId: "DEV-CASE-0199",
      normalIp: "198.51.100.24",
      caseIp: "203.0.113.77"
    },
    profileChanges: [{ time: "2026-07-15 22:47", event: "Profile contact review", channel: "Digital banking", ip: "203.0.113.77", notes: "Fictional training event." }],
    priorClaims: [{ date: "2025-12-08", type: "Card dispute", result: "Paid after merchant non-response" }],
    recentContact: [{ date: "2026-07-13", channel: "Secure message", note: "Customer asked about current case status." }],
    products: [{ product: "Checking", standing: "No NSF in last 90 days" }, { product: "Credit Card", standing: "Minimum paid on time" }],
    loginSessions: [{ eventText: "07/15/2025, 10:24 PM, IP 198.51.100.24, iPhone 14, Safari, MFA passed" }],
    deviceInventory: [{}, { linkedProfiles: "1 other training profile" }],
    ipHistory: [{ count: 14 }, { count: 8, otherProfiles: 1, region: "Dallas region", proxy: "No proxy indicator shown in training data" }],
    employeeDirectory: [{ employeeId: "EMP-1042", name: "Nia Carter", priorBankAccountId: "BANK-PRIOR-7712", requestedBankAccountId: "BANK-NEW-8839", trustedPhone: "(555) 312-4418", trustedEmail: "nia.carter@example.test", verificationStatus: "Trusted callback pending" }],
    bankAccounts: [{ bankAccountId: "BANK-NEW-8839", bankName: "Fictional Bank", accountMasked: "****8839", ownershipMatch: "Needs verification", status: "First-seen destination" }],
    searchableEntities: [{ type: "Employee ID", value: "EMP-1042", use: "Open Employee Profile." }, { type: "Bank account", value: "BANK-NEW-8839", use: "Open Bank Verification." }]
  };

  const configuredTools = [...new Set(Object.values(toolNavByLane).flat().map((tool) => tool.id).filter(Boolean))];
  const missing = configuredTools.filter((toolId) => fullHistoryRowsForTool(toolId, sampleProfile).length < 4);

  return {
    ok: missing.length === 0,
    totalToolsChecked: configuredTools.length,
    missing
  };
}

function commonHistoryRows(profile) {
  return [
    row("Customer 360 spine", `${profile.customerId || "Customer ID pending"} · ${profile.name || "Name pending"} · ${profile.maskedId || "Masked ID pending"}`, "neutral"),
    row("Relationship history", `${profile.customerSince || "Since date pending"} · ${profile.relationshipLength || "relationship length pending"} · ${profile.accountStanding || "standing pending"}`, "neutral"),
    row("Profile change history", profile.profileChanges?.[0] ? `${profile.profileChanges[0].time} · ${profile.profileChanges[0].event} · ${profile.profileChanges[0].notes}` : "No profile change history in packet", "neutral"),
    row("Prior claims/contact", `${summarizePriorClaims(profile)} · ${summarizeRecentContact(profile)}`, "neutral")
  ];
}

function specificHistoryRows(toolId, profile) {
  const keys = profile.lookupKeys || {};
  const rows = {
    login: [row("Searchable login event", firstLogin(profile), "neutral"), row("Customer baseline", `${profile.normalBehavior?.loginLocation || "Baseline pending"} · ${profile.normalBehavior?.device || "Device pending"}`, "good")],
    session: [row("Session lookup key", keys.caseDeviceId, "neutral"), row("Profile-event link", profile.profileChanges?.[0]?.event || "No profile event in packet", "neutral")],
    device: [row("Trusted device", `${keys.trustedDeviceId} · ${profile.normalBehavior?.device || "Baseline device"}`, "good"), row("Case device", `${keys.caseDeviceId} · ${profile.deviceInventory?.[1]?.linkedProfiles || "linked profile count pending"}`, "neutral")],
    ip: [row("Normal IP baseline", `${keys.normalIp} · ${profile.ipHistory?.[0]?.count || 0} prior sessions`, "good"), row("IP Lookup result", `${keys.caseIp} appeared in ${profile.ipHistory?.[1]?.count || 0} prior sessions, ${profile.ipHistory?.[1]?.otherProfiles || 0} other customer profile(s), ${profile.ipHistory?.[1]?.region || "region pending"}, ${profile.ipHistory?.[1]?.proxy || "proxy unknown"}`, "neutral")],
    mfa: [row("MFA/profile link", `${profile.profileChanges?.[0]?.event || "profile event pending"} · ${firstLogin(profile)}`, "neutral")],
    link: [row("Linked evidence spine", `${profile.customerId} · ${keys.caseDeviceId} · ${keys.caseIp} · ${keys.maskedId}`, "neutral")],
    identity: identityRows(profile),
    profileVerify: identityRows(profile),
    driverLicense: identityRows(profile),
    selfie: [row("Applicant identity spine", `${maskName(profile.name)} · ${keys.maskedId} · liveness compared to fictional ID packet`, "neutral")],
    address: [row("Address lookup", `${profile.address || keys.address || "address pending"} · customer since ${profile.customerSince || "pending"}`, "neutral")],
    phone: [row("Phone lookup", `${keys.phone} · fictional carrier record tied to ${maskName(profile.name)}`, "neutral")],
    email: [row("Email lookup", `${keys.email} · domain example.test reserved for training`, "neutral")],
    financial: [row("Customer relationship", `${profile.relationshipLength} · ${profile.accountStanding}`, "neutral")],
    bank: [row("Bank/customer lookup", `${profile.customerId} · ${keys.maskedId} · ${profile.accountStanding}`, "neutral"), ...bankRows(profile)],
    ownerKyc: identityRows(profile),
    kyb: [row("Business profile lookup", `${profile.name} · ${keys.maskedId} · ${profile.address || "address pending"}`, "neutral")],
    businessRegistration: [row("Entity address", profile.address || "address pending", "neutral")],
    payrollProfile: [row("Employer/customer spine", `${profile.name} · ${profile.customerId}`, "neutral"), ...employeeRows(profile)],
    employee: [row("Employee identity spine", employeeSummary(profile), "neutral"), ...employeeRows(profile), ...bankRows(profile)],
    transaction: [row("Transaction customer fit", productStanding(profile), "neutral")],
    authorization: [row("Authorization baseline", `${profile.normalBehavior?.device || "Device pending"} · ${profile.normalBehavior?.loginLocation || "Market pending"}`, "neutral")],
    merchant: [row("Merchant/contact history", summarizePriorClaims(profile), "neutral")],
    merchantHistory: [row("Prior merchant/claim pattern", summarizePriorClaims(profile), "neutral")],
    priorClaims: priorClaimRows(profile),
    reasonCode: [row("Reason-code context", `${profile.customerId} · prior claims: ${profile.priorClaims?.length || 0} · current lane controls outcome`, "neutral")],
    receipt: [row("Receipt comparison profile", `${profile.name} · normal spending: ${profile.normalBehavior?.spending || "spending baseline pending"}`, "neutral")],
    fulfillment: [row("Fulfillment/customer contact", summarizeRecentContact(profile), "neutral")],
    terms: [row("Policy review context", `${profile.relationshipLength} relationship · ${profile.accountStanding}`, "neutral")],
    changeRequest: [row("Change request spine", profile.profileChanges?.[0] ? `${profile.profileChanges[0].event} · ${profile.profileChanges[0].channel} · ${profile.profileChanges[0].ip}` : "No change event generated", "neutral"), ...employeeRows(profile), ...bankRows(profile)],
    admin: [row("Admin/customer baseline", `${profile.customerId} · trusted contact path: ${profile.preferredContact}`, "neutral")],
    callback: [row("Trusted callback source", `${profile.preferredContact} · ${keys.phone} · do not rely on incoming message only`, "neutral"), ...employeeRows(profile)],
    payrollRun: [row("Payroll/account standing", `${profile.accountStanding} · products: ${productNames(profile)}`, "neutral"), ...employeeRows(profile), ...bankRows(profile)],
    emailHeaders: [row("Known email/contact", `${keys.email} · trusted contact source remains Customer 360`, "neutral")],
    domain: [row("Domain/contact comparison", `${keys.email} · compare sender domain to existing profile`, "neutral")],
    sender: [row("Sender history profile", summarizeRecentContact(profile), "neutral"), ...employeeRows(profile)],
    beneficiary: [row("Beneficiary/customer link", `${profile.customerId} · ${keys.maskedId} · new destination must compare to prior products`, "neutral"), ...bankRows(profile)],
    paymentTimeline: [row("Payment timeline baseline", `${profile.relationshipLength} · ${profile.accountStanding} · ${profile.normalBehavior?.deposits || "deposit baseline pending"}`, "neutral"), ...bankRows(profile)],
    income: [row("Income/deposit baseline", `${profile.normalBehavior?.deposits || "deposit baseline pending"} · ${profile.accountStanding}`, "neutral")],
    employment: [row("Employment/contact spine", `${maskName(profile.name)} · ${keys.phone} · ${keys.email}`, "neutral"), ...employeeRows(profile)],
    dti: [row("Credit relationship context", `${profile.relationshipLength} · ${productNames(profile)}`, "neutral")],
    creditReport: [row("Credit profile context", `${keys.maskedId} · ${profile.accountStanding} · prior claims ${profile.priorClaims?.length || 0}`, "neutral")],
    bankStatements: [row("Cash-flow history", `${profile.normalBehavior?.deposits || "deposits pending"} · ${profile.normalBehavior?.spending || "spending pending"}`, "neutral"), ...bankRows(profile)],
    paymentHistory: [row("Payment history profile", productStanding(profile), "neutral")],
    utilization: [row("Exposure/utilization profile", productStanding(profile), "neutral")],
    inquiries: [row("Application velocity context", `${profile.customerId} · ${keys.maskedId} · compare inquiries to relationship length ${profile.relationshipLength}`, "neutral")],
    revenue: [row("Business revenue baseline", `${profile.normalBehavior?.deposits || "business deposits pending"} · ${profile.accountStanding}`, "neutral")],
    positivePay: [row("Issued-file customer spine", `${profile.customerId} · ${profile.name} · ${profile.accountStanding}`, "neutral"), ...bankRows(profile)],
    checkImage: [row("Check image profile context", `${profile.name} · ${keys.maskedId} · compare payee/signature to fictional account history`, "neutral"), ...bankRows(profile)],
    endorsement: [row("Endorsement/customer link", `${profile.customerId} · destination ownership should match prior relationship`, "neutral"), ...bankRows(profile)],
    velocity: [row("Velocity baseline", `${profile.normalBehavior?.spending || "spending pending"} · ${profile.normalBehavior?.deposits || "deposits pending"}`, "neutral"), ...bankRows(profile)]
  };

  return rows[toolId] || fallbackToolRows(toolId, profile);
}

function searchDirectoryRows(profile, toolId) {
  const entities = profile.searchableEntities || [];
  const isSearchHeavy = ["employee", "bank", "link", "callback", "beneficiary", "changeRequest", "payrollRun", "paymentTimeline", "positivePay", "checkImage", "endorsement", "velocity"].includes(toolId);
  if (!isSearchHeavy || !entities.length) return [];
  return entities.slice(0, 8).map((entity) => row(`Search ${entity.type}`, `${entity.value} · ${entity.use}`, "neutral"));
}

function employeeRows(profile) {
  const employees = profile.employeeDirectory || [];
  return employees.slice(0, 3).map((employee) => row(`Employee ${employee.employeeId}`, `${employee.name} · ${employee.role || "role pending"} · ${employee.verificationStatus || "verification pending"} · prior bank ${employee.priorBankAccountId || "pending"} · requested bank ${employee.requestedBankAccountId || "pending"}`, "neutral"));
}

function bankRows(profile) {
  const accounts = profile.bankAccounts || [];
  return accounts.slice(0, 4).map((account) => row(`Bank ${account.bankAccountId}`, `${account.bankName} · ${account.accountMasked} · ${account.ownerType || "owner type pending"} · ${account.ownershipMatch || "ownership pending"} · ${account.status || "status pending"}`, account.status === "First-seen destination" ? "caution" : "neutral"));
}

function employeeSummary(profile) {
  const employee = profile.employeeDirectory?.[0];
  if (!employee) return `${maskName(profile.name)} · employee directory pending`;
  return `${employee.employeeId} · ${employee.name} · ${employee.trustedPhone} · ${employee.trustedEmail}`;
}

function identityRows(profile) {
  const keys = profile.lookupKeys || {};
  return [
    row("Training identity lookup", `${keys.maskedId} · ${keys.dob || "DOB/profile date pending"}`, "neutral"),
    row("Linked profile", `${profile.name} · ${profile.address || "address pending"} · ${keys.phone}`, "neutral"),
    row("Masked customer ID", `${profile.customerId} · ${keys.maskedId}`, "good")
  ];
}

function priorClaimRows(profile) {
  const claims = profile.priorClaims || [];
  return claims.length ? claims.slice(0, 3).map((claim) => row(`Prior claim ${claim.date}`, `${claim.type} · ${claim.result}`, "neutral")) : [row("Prior claims", "No prior claims generated", "neutral")];
}

function fallbackToolRows(toolId, profile) {
  return [
    row("Tool/customer history link", `${toolId} reviews must compare against ${profile.customerId || "Customer 360"} baseline before determination.`, "neutral"),
    row("Lookup keys available", `${profile.lookupKeys?.maskedId || "masked ID pending"} · ${profile.lookupKeys?.caseDeviceId || "device pending"} · ${profile.lookupKeys?.caseIp || "IP pending"}`, "neutral")
  ];
}

function firstLogin(profile) {
  return profile.loginSessions?.[1]?.eventText || profile.loginSessions?.[0]?.eventText || "No login session generated";
}

function summarizePriorClaims(profile) {
  const claim = profile.priorClaims?.[0];
  return claim ? `${claim.date} ${claim.type}: ${claim.result}` : "No prior claim history generated";
}

function summarizeRecentContact(profile) {
  const contact = profile.recentContact?.[0];
  return contact ? `${contact.date} ${contact.channel}: ${contact.note}` : "No recent contact generated";
}

function productNames(profile) {
  return (profile.products || []).map((product) => product.product).slice(0, 4).join(", ") || "No products generated";
}

function productStanding(profile) {
  return (profile.products || []).map((product) => `${product.product}: ${product.standing}`).slice(0, 3).join(" · ") || "Product standing pending";
}

function uniqueRows(rows = []) {
  const seen = new Set();
  return rows.filter((item) => {
    const key = `${item.k}|${item.v}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function row(k, v, flag = "neutral") {
  return { k, v, flag };
}

function maskName(value = "Customer") {
  const parts = String(value).split(/\s+/).filter(Boolean);
  if (parts.length < 2) return value;
  return `${parts[0]} ${parts[1][0]}.`;
}
