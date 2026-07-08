export const LOOKUP_REPORT_GUARDRAIL = "Lookup reports are fictional training previews. They can return Match, Partial Match, or No Match for identity/bank records, but they do not reveal the case determination.";

export function buildLookupIndex(activeCase = {}) {
  const profile = activeCase.profile || {};
  const keys = profile.lookupKeys || {};
  const banks = Array.isArray(profile.bankAccounts) ? profile.bankAccounts : [];
  const employees = Array.isArray(profile.employeeDirectory) ? profile.employeeDirectory : [];

  return [
    {
      id: `${activeCase.id || "case"}-identity`,
      type: "Identity background lookup",
      label: "SSN/EIN + DOB profile match",
      primaryValue: `${keys.trainingFullSsnOrEin || keys.maskedId || "training ID pending"} · ${keys.dob || profile.dob || "DOB pending"}`,
      queryValues: [
        keys.trainingFullSsnOrEin,
        keys.maskedId,
        keys.dob,
        profile.dob,
        profile.customerId,
        profile.name,
        profile.address,
        keys.phone,
        keys.email,
        profile.phone,
        profile.email
      ],
      exactValues: [keys.trainingFullSsnOrEin, profile.customerId],
      partialValues: [keys.maskedId, keys.dob, profile.dob, keys.phone, keys.email, profile.address],
      reportKind: "background",
      profile,
      guardrail: LOOKUP_REPORT_GUARDRAIL
    },
    ...banks.map((account, index) => ({
      id: `${activeCase.id || "case"}-bank-${account.bankAccountId || index}`,
      type: "Bank account verification lookup",
      label: account.bankAccountId || `Bank record ${index + 1}`,
      primaryValue: `${account.bankName || "Bank pending"} · ${account.routingMasked || account.trainingRoutingNumber || "routing pending"} · ${account.accountMasked || account.trainingAccountNumber || "account pending"}`,
      queryValues: [
        account.bankAccountId,
        account.trainingRoutingNumber,
        account.trainingAccountNumber,
        account.routingMasked,
        account.accountMasked,
        account.bankName,
        account.ownerName,
        account.ownerType,
        account.status,
        account.ownershipMatch
      ],
      exactValues: [account.bankAccountId, account.trainingRoutingNumber, account.trainingAccountNumber],
      partialValues: [account.routingMasked, account.accountMasked, account.bankName, account.ownerName, account.ownerType],
      reportKind: "bank",
      account,
      profile,
      guardrail: LOOKUP_REPORT_GUARDRAIL
    })),
    ...employees.map((employee, index) => ({
      id: `${activeCase.id || "case"}-employee-${employee.employeeId || index}`,
      type: "Employee/vendor directory lookup",
      label: employee.employeeId || `Employee record ${index + 1}`,
      primaryValue: `${employee.name || "Name pending"} · ${employee.trustedPhone || "phone pending"} · ${employee.trustedEmail || "email pending"}`,
      queryValues: [employee.employeeId, employee.name, employee.trustedPhone, employee.trustedEmail, employee.priorBankAccountId, employee.requestedBankAccountId],
      exactValues: [employee.employeeId, employee.trustedPhone, employee.trustedEmail],
      partialValues: [employee.name, employee.priorBankAccountId, employee.requestedBankAccountId],
      reportKind: "employee",
      employee,
      profile,
      guardrail: LOOKUP_REPORT_GUARDRAIL
    }))
  ].filter(Boolean);
}

export function runLookupReportSearch(activeCase = {}, query = "") {
  const normalized = normalize(query);
  const index = buildLookupIndex(activeCase);

  if (!normalized) {
    return {
      query,
      status: "Ready",
      results: [],
      noMatch: false,
      examples: suggestedLookupExamples(activeCase)
    };
  }

  const scored = index
    .map((record) => ({ ...record, match: matchRecord(record, normalized) }))
    .filter((record) => record.match.status !== "No Match")
    .sort((a, b) => b.match.score - a.match.score);

  return {
    query,
    status: scored.length ? "Results Found" : "No Match",
    results: scored,
    noMatch: scored.length === 0,
    examples: suggestedLookupExamples(activeCase)
  };
}

export function buildLookupReportPreview(activeCase = {}, record = null) {
  if (!record) return null;

  const profile = record.profile || activeCase.profile || {};
  const keys = profile.lookupKeys || {};
  const sharedSections = [
    {
      title: "Profile match summary",
      items: [
        `Name: ${profile.name || "Training profile pending"}`,
        `Customer/business ID: ${profile.customerId || "pending"}`,
        `Masked ID: ${profile.maskedId || keys.maskedId || "pending"}`,
        `Address: ${profile.address || keys.address || "pending"}`,
        `Phone/email: ${keys.phone || profile.phone || "phone pending"} · ${keys.email || profile.email || "email pending"}`
      ]
    },
    {
      title: "Behavior and relationship context",
      items: [
        `Relationship: ${profile.customerSince || "since date pending"} · ${profile.relationshipLength || "length pending"}`,
        `Standing: ${profile.accountStanding || "standing pending"}`,
        `Normal behavior: ${profile.normalBehavior?.deposits || "deposit baseline pending"} · ${profile.normalBehavior?.spending || "spending baseline pending"}`
      ]
    }
  ];

  if (record.reportKind === "bank") {
    const account = record.account || {};
    return {
      title: "Bank match report preview",
      subtitle: "Routing/account lookup result for the active fictional profile.",
      matchStatus: record.match.status,
      tone: toneForMatch(record.match.status),
      sections: [
        {
          title: "Bank verification result",
          items: [
            `Bank record: ${account.bankAccountId || "pending"}`,
            `Bank: ${account.bankName || "pending"}`,
            `Owner: ${account.ownerName || "pending"} · ${account.ownerType || "owner type pending"}`,
            `Training routing/account: ${account.trainingRoutingNumber || account.routingMasked || "routing pending"} · ${account.trainingAccountNumber || account.accountMasked || "account pending"}`,
            `Masked display: ${account.routingMasked || "routing masked pending"} · ${account.accountMasked || "account masked pending"}`,
            `Ownership review: ${account.matchStatus || account.ownershipMatch || "pending"}`,
            `Status: ${account.status || "pending"}`
          ]
        },
        {
          title: "Use limits",
          items: [
            "A match supports identity or destination comparison only.",
            "A mismatch or partial match should route back to Bank Verification, Link Analysis, and trusted callback evidence.",
            LOOKUP_REPORT_GUARDRAIL
          ]
        }
      ]
    };
  }

  if (record.reportKind === "employee") {
    const employee = record.employee || {};
    return {
      title: "Employee/vendor directory report preview",
      subtitle: "Trusted-contact and bank-change comparison for payroll/BEC/business lanes.",
      matchStatus: record.match.status,
      tone: toneForMatch(record.match.status),
      sections: [
        {
          title: "Directory result",
          items: [
            `Employee/vendor: ${employee.employeeId || "pending"} · ${employee.name || "name pending"}`,
            `Role/status: ${employee.role || "role pending"} · ${employee.status || "status pending"}`,
            `Trusted callback: ${employee.trustedPhone || "phone pending"} · ${employee.trustedEmail || "email pending"}`,
            `Prior/requested bank: ${employee.priorBankAccountId || "prior pending"} · ${employee.requestedBankAccountId || "requested pending"}`,
            `Verification status: ${employee.verificationStatus || "pending"}`
          ]
        },
        {
          title: "Use limits",
          items: [
            "Use trusted-source contact records, not the incoming request thread, for callback verification.",
            "Employee/vendor directory match is context only until the lane-specific tools and documents are reviewed.",
            LOOKUP_REPORT_GUARDRAIL
          ]
        }
      ]
    };
  }

  return {
    title: "Background report preview",
    subtitle: "SSN/EIN + DOB style lookup for the active fictional profile.",
    matchStatus: record.match.status,
    tone: toneForMatch(record.match.status),
    sections: [
      ...sharedSections,
      {
        title: "Identity search trail",
        items: [
          `Training SSN/EIN key: ${keys.trainingFullSsnOrEin || "pending"}`,
          `DOB/entity marker: ${keys.dob || profile.dob || "pending"}`,
          `Login baseline: ${profile.loginSessions?.[0]?.eventText || "login baseline pending"}`,
          `Case login/IP/device: ${profile.loginSessions?.[1]?.eventText || "case event pending"}`,
          `Profile changes: ${(profile.profileChanges || []).map((event) => event.event).join(", ") || "none generated"}`
        ]
      },
      {
        title: "Use limits",
        items: [
          "A background lookup can identify the linked training profile and open evidence gaps.",
          "It cannot approve, deny, pay, decline, or recommend the case outcome by itself.",
          LOOKUP_REPORT_GUARDRAIL
        ]
      }
    ]
  };
}

export function suggestedLookupExamples(activeCase = {}) {
  const profile = activeCase.profile || {};
  const keys = profile.lookupKeys || {};
  const firstBank = profile.bankAccounts?.[0] || {};
  const employee = profile.employeeDirectory?.[0] || {};

  return [
    [keys.trainingFullSsnOrEin, keys.dob].filter(Boolean).join(" "),
    firstBank.trainingAccountNumber || firstBank.bankAccountId || firstBank.accountMasked,
    firstBank.trainingRoutingNumber || firstBank.routingMasked,
    employee.employeeId || employee.trustedPhone,
    keys.caseDeviceId,
    keys.caseIp
  ].filter(Boolean).slice(0, 5);
}

function matchRecord(record, normalizedQuery) {
  const exactHit = (record.exactValues || []).some((value) => normalizedQuery.includes(normalize(value)) && normalize(value).length >= 3);
  const partialHit = (record.partialValues || []).some((value) => normalizedQuery.includes(normalize(value)) && normalize(value).length >= 3);
  const broadHit = (record.queryValues || []).some((value) => {
    const normalizedValue = normalize(value);
    return normalizedValue.length >= 4 && (normalizedQuery.includes(normalizedValue) || normalizedValue.includes(normalizedQuery));
  });

  if (exactHit) return { status: "Match", score: partialHit ? 100 : 92, tone: "good" };
  if (partialHit || broadHit) return { status: "Partial Match", score: partialHit ? 68 : 52, tone: "review" };
  return { status: "No Match", score: 0, tone: "caution" };
}

function normalize(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function toneForMatch(status = "No Match") {
  if (status === "Match") return "good";
  if (status === "Partial Match") return "review";
  return "caution";
}
