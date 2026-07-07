const TEST_NET_IPS = ["198.51.100", "203.0.113", "192.0.2"];
const STATES = ["TX", "GA", "AZ", "NC", "FL", "IL", "OH", "VA"];
const CONSUMER_NAMES = ["Maya Ellison", "Alina Soto", "Jordan Pierce", "Andre Coleman", "Devon Lewis", "Riley Monroe", "Harper Vale", "Selene Brooks"];
const BUSINESS_NAMES = ["Northstar Floral LLC", "Blue Wren Events", "Brightline Goods LLC", "Cedar Payroll Group", "Moonlit Market LLC", "Silver Creek Services"];

const ADDRESS_BANK = [
  "4187 Willow Bend Dr, Dallas, TX 75231",
  "922 Mason Ridge Ln, Plano, TX 75074",
  "1440 Cedar Gate Ave, Charlotte, NC 28205",
  "8306 Moonlit Way, Phoenix, AZ 85016",
  "2711 Coral Vine St, Tampa, FL 33607"
];

export function buildCustomerProfileSpine(scenario = {}, baseCase = {}) {
  const lane = scenario.lane || baseCase.lane || "ATO";
  const key = `${scenario.scenarioId || baseCase.id || lane}:${scenario.subtype || baseCase.subtype || "case"}`;
  const seed = hashNumber(key);
  const isBusiness = ["BUSINESS_BUSTOUT", "BEC", "PAYROLL"].includes(lane);
  const baseProfile = baseCase.profile || {};
  const name = baseProfile.name || pick(isBusiness ? BUSINESS_NAMES : CONSUMER_NAMES, seed);
  const state = baseProfile.state || pick(STATES, seed + 2);
  const last4 = String(2100 + (seed % 6800)).padStart(4, "0");
  const dob = isBusiness ? "Business profile" : baseProfile.dob || `${pad(1 + (seed % 9))}/${pad(10 + (seed % 18))}/19${76 + (seed % 20)}`;
  const fakeSsn = isBusiness ? `EIN-${10 + (seed % 80)}-${1000000 + (seed % 8999999)}` : `900-${pad(10 + (seed % 80))}-${last4}`;
  const normalIp = `${TEST_NET_IPS[0]}.${24 + (seed % 120)}`;
  const caseIp = `${TEST_NET_IPS[1]}.${31 + (seed % 160)}`;
  const trustedDevice = pick(["iPhone 14 · Safari", "Pixel 8 · Chrome", "MacBook Air · Safari", "Galaxy S23 · Chrome"], seed + 3);
  const caseDevice = pick(["Android Chrome first-seen", "Windows Edge first-seen", "iPhone 15 Safari first-seen", "Unknown mobile browser"], seed + 4);
  const phone = `(555) ${pad(210 + (seed % 690))}-${String(1000 + (seed % 8999))}`;
  const email = `${slug(name)}@example.test`;
  const address = baseProfile.address || pick(ADDRESS_BANK, seed + 5);

  const lookupKeys = {
    trainingFullSsnOrEin: fakeSsn,
    maskedId: isBusiness ? maskEin(fakeSsn) : `***-**-${last4}`,
    dob,
    address,
    phone,
    email,
    trustedDeviceId: `DEV-TRUST-${String(seed % 9999).padStart(4, "0")}`,
    caseDeviceId: `DEV-CASE-${String((seed * 7) % 9999).padStart(4, "0")}`,
    normalIp,
    caseIp
  };

  const loginSessions = buildLoginSessions({ lane, seed, normalIp, caseIp, trustedDevice, caseDevice });
  const profileChanges = buildProfileChanges({ lane, seed, lookupKeys, caseDevice, caseIp, fallback: baseProfile.profileChanges });
  const products = buildProducts({ lane, isBusiness, baseProducts: baseProfile.products });

  return {
    ...baseProfile,
    name,
    customerId: baseProfile.customerId || `FA-${730000 + (seed % 89999)}`,
    maskedId: lookupKeys.maskedId,
    dob,
    address,
    state,
    phone,
    email,
    customerSince: baseProfile.customerSince || `${2016 + (seed % 8)}-04-14`,
    relationshipLength: baseProfile.relationshipLength || `${2 + (seed % 9)} years`,
    language: baseProfile.language || "English",
    preferredContact: baseProfile.preferredContact || "Mobile app secure message",
    verificationStatus: baseProfile.verificationStatus || "Standard profile verification passed",
    accountStanding: baseProfile.accountStanding || accountStandingFor(lane),
    products,
    normalBehavior: {
      ...baseProfile.normalBehavior,
      loginLocation: baseProfile.normalBehavior?.loginLocation || (isBusiness ? "Business office and owner home market" : `${cityForState(state)} regular market`),
      device: baseProfile.normalBehavior?.device || trustedDevice,
      deposits: baseProfile.normalBehavior?.deposits || (isBusiness ? "Business ACH, card settlement, and payroll funding" : "Biweekly payroll ACH"),
      spending: baseProfile.normalBehavior?.spending || "Grocery, fuel, subscriptions, card-present retail, and digital wallet spend"
    },
    profileChanges,
    priorClaims: baseProfile.priorClaims || buildPriorClaims(lane, seed),
    recentContact: baseProfile.recentContact || [{ date: "2026-07-13", channel: "Secure message", note: "Customer asked about current case status." }],
    lookupKeys,
    loginSessions,
    deviceInventory: [
      { deviceId: lookupKeys.trustedDeviceId, device: trustedDevice, trust: "Trusted", firstSeen: "2024-05-12", linkedProfiles: "1 customer profile", notes: "Normal Customer 360 baseline" },
      { deviceId: lookupKeys.caseDeviceId, device: caseDevice, trust: lane === "FIRST_PARTY" ? "Previously seen in household" : "First-seen in case window", firstSeen: "2026-07-15", linkedProfiles: lane === "APPLICATION" ? "2 application profiles in training data" : "No trusted household link", notes: "Compare to claim timeline before deciding" }
    ],
    ipHistory: [
      { ip: normalIp, count: 14, region: `${cityForState(state)} regular market`, otherProfiles: 0, proxy: "No proxy indicator shown in training data" },
      { ip: caseIp, count: 8, region: lane === "ATO" ? "Dallas region mismatch review" : `${cityForState(state)} region`, otherProfiles: lane === "APPLICATION" ? 2 : 1, proxy: "No proxy indicator shown in training data" }
    ],
    reportSeeds: buildReportSeeds({ lane, scenario, lookupKeys, loginSessions }),
    backgroundReportOutline: [
      "Identity and contact match summary",
      "Address, phone, email, and masked SSN/EIN lookup trail",
      "Login, IP, and device comparison against Customer 360 baseline",
      "Product relationship, prior claims, and money movement context",
      "Open evidence gaps and lane-specific next review steps"
    ]
  };
}

export function profileRowsForTool(toolId, profile = {}) {
  const keys = profile.lookupKeys || {};
  const rows = {
    login: [
      row("Searchable login event", firstLogin(profile), "neutral"),
      row("Customer baseline", `${profile.normalBehavior?.loginLocation || "Baseline pending"} · ${profile.normalBehavior?.device || "Device pending"}`, "good")
    ],
    session: [
      row("Session lookup key", keys.caseDeviceId, "neutral"),
      row("Profile-event link", profile.profileChanges?.[0]?.event || "No profile event in packet", "neutral")
    ],
    device: [
      row("Trusted device", `${keys.trustedDeviceId} · ${profile.normalBehavior?.device || "Baseline device"}`, "good"),
      row("Case device", `${keys.caseDeviceId} · ${profile.deviceInventory?.[1]?.device || "Case device"}`, "caution"),
      row("Device link search", profile.deviceInventory?.[1]?.linkedProfiles || "No linked profile count provided", "neutral")
    ],
    ip: [
      row("Normal IP baseline", `${keys.normalIp} · ${profile.ipHistory?.[0]?.count || 0} prior sessions`, "good"),
      row("IP Lookup result", `${keys.caseIp} appeared in ${profile.ipHistory?.[1]?.count || 0} prior sessions, ${profile.ipHistory?.[1]?.otherProfiles || 0} other customer profile(s), ${profile.ipHistory?.[1]?.region || "region pending"}, ${profile.ipHistory?.[1]?.proxy || "proxy unknown"}`, "neutral")
    ],
    identity: identityRows(profile),
    profileVerify: identityRows(profile),
    phone: [row("Phone lookup", `${keys.phone} · fictional carrier record tied to ${maskName(profile.name)}`, "neutral")],
    email: [row("Email lookup", `${keys.email} · domain example.test reserved for training`, "neutral")],
    financial: [row("Customer relationship", `${profile.relationshipLength} · ${profile.accountStanding}`, "neutral")],
    bank: [row("Bank/customer lookup", `${profile.customerId} · ${keys.maskedId} · ${profile.accountStanding}`, "neutral")],
    ownerKyc: identityRows(profile),
    kyb: [row("Business profile lookup", `${profile.name} · ${keys.maskedId} · ${profile.address}`, "neutral")],
    businessRegistration: [row("Entity address", profile.address, "neutral")],
    payrollProfile: [row("Employer/customer spine", `${profile.name} · ${profile.customerId}`, "neutral")],
    employee: [row("Employee identity spine", `${maskName(profile.name)} · ${keys.maskedId} · ${keys.phone}`, "neutral")]
  };

  return rows[toolId] || [];
}

function buildLoginSessions({ lane, seed, normalIp, caseIp, trustedDevice, caseDevice }) {
  const date = "07/15/2025";
  const normalEvent = `${date}, 10:24 PM, IP ${normalIp}, ${trustedDevice}, MFA passed`;
  const caseEvent = `${date}, 10:${pad(30 + (seed % 20))} PM, IP ${caseIp}, ${caseDevice}, ${lane === "ATO" ? "MFA challenged" : "MFA passed"}`;
  return [
    { time: `${date}, 10:24 PM`, ip: normalIp, device: trustedDevice, mfa: "MFA passed", eventText: normalEvent, baseline: true },
    { time: `${date}, 10:${pad(30 + (seed % 20))} PM`, ip: caseIp, device: caseDevice, mfa: lane === "ATO" ? "MFA challenged" : "MFA passed", eventText: caseEvent, baseline: false }
  ];
}

function buildProfileChanges({ lane, seed, lookupKeys, caseDevice, caseIp, fallback }) {
  if (Array.isArray(fallback) && fallback.length) return fallback;
  const caseChange = {
    time: "2026-07-15 22:47",
    event: lane === "PAYROLL" ? "Direct deposit destination review" : lane === "BEC" ? "Vendor beneficiary review" : "Profile contact review",
    oldValue: lane === "ATO" ? "Known mobile ending 0188" : "No change confirmed",
    newValue: lane === "ATO" ? `New mobile ending ${String(1000 + (seed % 8999)).slice(-4)}` : "Pending trusted-source verification",
    channel: "Digital banking",
    source: caseDevice,
    device: lookupKeys.caseDeviceId,
    ip: caseIp,
    mfa: lane === "ATO" ? "SMS challenge after profile edit" : "Verification pending",
    notes: "Fictional training event. Review sequence before determination."
  };
  return [caseChange];
}

function buildProducts({ lane, isBusiness, baseProducts }) {
  if (Array.isArray(baseProducts) && baseProducts.length) return baseProducts;
  if (isBusiness) {
    return [
      { product: "Business Checking", status: "Open", balance: "$28,640.22", limit: "N/A", standing: "ACH activity present" },
      { product: "Business Credit Line", status: lane === "BUSINESS_BUSTOUT" ? "Review" : "Open", balance: "$41,200.00", limit: "$50,000", standing: "Exposure review required" },
      { product: "Treasury / Wires", status: "Active", balance: "N/A", limit: "Dual control expected", standing: "Callback rule applies" }
    ];
  }
  return [
    { product: "Checking", status: "Open", balance: "$2,486.42", limit: "N/A", standing: "No NSF in last 90 days" },
    { product: "Savings", status: "Open", balance: "$840.10", limit: "N/A", standing: "Stable" },
    { product: "Debit Card", status: "Active", balance: "Linked to checking", limit: "Daily POS $3,000", standing: "No restrictions" },
    { product: "Credit Card", status: lane === "CREDIT_RISK" ? "Review" : "Open", balance: lane === "CREDIT_RISK" ? "$2,331.10" : "$414.22", limit: "$2,500", standing: lane === "CREDIT_RISK" ? "Utilization review required" : "Minimum paid on time" },
    { product: "Digital Banking", status: "Active", balance: "N/A", limit: "Profile controlled", standing: "MFA enabled" }
  ];
}

function buildPriorClaims(lane, seed) {
  if (lane === "FIRST_PARTY") return [
    { date: "2026-01-19", type: "Digital goods dispute", result: "Merchant proof reviewed" },
    { date: "2025-08-03", type: "Subscription billing dispute", result: "Credit issued after cancellation proof" }
  ];
  return [
    { date: "2025-12-08", type: "Card dispute", result: "Paid after merchant non-response" },
    { date: "2024-10-22", type: "Travel alert", result: "No fraud claim filed" },
    { date: "2024-03-17", type: "Profile assistance", result: `Contact method confirmed through training key ${seed % 1000}` }
  ];
}

function buildReportSeeds({ lane, scenario, lookupKeys, loginSessions }) {
  return [
    { label: "SSN/EIN + DOB lookup", value: `${lookupKeys.trainingFullSsnOrEin} · ${lookupKeys.dob}`, use: "Return fictional name, address, phone, email, and account profile match." },
    { label: "IP lookup", value: lookupKeys.caseIp, use: "Return prior sessions, other profile links, region, and proxy note." },
    { label: "Device lookup", value: lookupKeys.caseDeviceId, use: "Return trust status, first-seen date, linked profiles, and baseline comparison." },
    { label: "Login event lookup", value: loginSessions[1]?.eventText, use: `Compare the event to ${scenario.claimFamily || lane} timeline without revealing the answer.` }
  ];
}

function identityRows(profile) {
  const keys = profile.lookupKeys || {};
  return [
    row("Training SSN/EIN lookup", `${keys.trainingFullSsnOrEin} · ${keys.dob}`, "neutral"),
    row("Linked profile", `${profile.name} · ${profile.address} · ${keys.phone}`, "neutral"),
    row("Masked customer ID", `${profile.customerId} · ${keys.maskedId}`, "good")
  ];
}

function firstLogin(profile) {
  return profile.loginSessions?.[1]?.eventText || profile.loginSessions?.[0]?.eventText || "No login session generated";
}

function accountStandingFor(lane) {
  if (lane === "CREDIT_RISK") return "Credit exposure review required";
  if (lane === "BUSINESS_BUSTOUT") return "Business exposure and revenue review required";
  if (["PAYROLL", "BEC"].includes(lane)) return "Trusted callback required before release";
  return "Good standing";
}

function row(k, v, flag = "neutral") {
  return { k, v, flag };
}

function hashNumber(value) {
  return String(value).split("").reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) % 100000, 17);
}

function pick(list, seed) {
  return list[Math.abs(seed) % list.length];
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function slug(value = "customer") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") || "customer";
}

function cityForState(state) {
  return ({ TX: "Dallas, TX", GA: "Atlanta, GA", AZ: "Phoenix, AZ", NC: "Charlotte, NC", FL: "Tampa, FL", IL: "Chicago, IL", OH: "Columbus, OH", VA: "Richmond, VA" })[state] || "Primary market";
}

function maskEin(value = "EIN-00-0000000") {
  return value.replace(/(EIN-\d{2}-)\d+(\d{4})$/, "$1***$2");
}

function maskName(value = "Customer") {
  const parts = String(value).split(/\s+/).filter(Boolean);
  if (parts.length < 2) return value;
  return `${parts[0]} ${parts[1][0]}.`;
}
