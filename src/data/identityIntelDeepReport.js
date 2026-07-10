export const IDENTITY_REPORT_GUARDRAIL = "Fictional training data only. Identity history is evidence context, not proof of fraud or no fraud.";

export function buildIdentityIntelDeepSections(activeCase = {}) {
  const profile = activeCase.profile || {};
  const keys = profile.lookupKeys || {};
  const name = profile.name || "Jordan Ellis";
  const maskedId = profile.maskedId || keys.maskedId || "***-**-4821";
  const address = profile.address || keys.address || "418 Willow Trace, Dallas, TX";
  const phone = keys.phone || profile.phone || "(***) ***-0197";
  const email = keys.email || profile.email || "j***@trainingmail.example";

  return [
    section("Identity Summary", [
      `Name: ${name}`,
      `DOB / entity marker: ${keys.dob || profile.dob || "08/14/1988"}`,
      `Training ID: ${maskedId}`,
      `Customer/business ID: ${profile.customerId || "CUST-TRN-1042"}`,
      `Current address: ${address}`,
      `Verification status: ${profile.verificationStatus || "Documented / needs case-level review"}`,
      IDENTITY_REPORT_GUARDRAIL
    ]),
    section("Email History", [
      `Primary email: ${email}`,
      "Business email: billing@northstar-training.example",
      "Historical emails: j.ellis.old@trainingmail.example; jordan.e@samplemail.example",
      "First seen: 2018-04-22",
      "Last seen: current training case",
      "Breach indicators: fictional exposure marker present in 2022 training dataset",
      "Disposable email check: No disposable-provider match"
    ]),
    section("Relatives & Associates", [
      "Mother: Renee Ellis (fictional)",
      "Father: Marcus Ellis (fictional)",
      "Spouse: No current spouse record in training profile",
      "Children: 1 dependent listed in fictional profile",
      "Business associates: Taylor Morgan; Avery Brooks",
      "Known roommates: Casey Lane",
      `Shared addresses: ${address}`,
      `Shared phone numbers: ${phone}`,
      "Emergency contact: Renee Ellis · (***) ***-4480"
    ]),
    section("Employment History", [
      "Current employer: Northstar Supply Training LLC",
      "Position: Operations Coordinator",
      "Hire date: 2021-03-15",
      "Previous employers: Harborline Services; Summit Retail Training",
      "Employment timeline: continuous with one 4-month gap",
      "Estimated income range: $58,000-$66,000 fictional training estimate",
      "Business owner: No",
      "Officer positions: None found",
      "Payroll relationships: direct deposit destination history available"
    ]),
    section("Business Records", [
      "Business name: Northstar Supply Training LLC",
      "Entity type: Limited Liability Company",
      "SOS status: Active in fictional registry",
      "EIN: **-***4821",
      `Owner: ${name}`,
      "Officer: Taylor Morgan",
      "Registered agent: Training Registered Agents LLC",
      "Business address: 2700 Market Loop, Dallas, TX",
      "State filing date: 2020-09-18",
      "Business standing: Good standing in fictional registry"
    ]),
    section("Professional Licenses", [
      "License number: TX-TRN-88214",
      "License type: Occupational training permit",
      "Status: Active",
      "Expiration: 2027-09-30",
      "Issuing agency: Fictional Texas Training Board",
      "Disciplinary actions: None in training record"
    ]),
    section("Property Records", [
      `Current residence: ${address}`,
      "Purchase date: 2019-06-11",
      "Purchase price: $248,000 fictional",
      "Estimated value: $314,000 fictional",
      "Mortgage holder: Example Community Bank",
      "Tax assessment: $301,500 fictional",
      "Rental properties: None found",
      "Commercial properties: None found"
    ]),
    section("Vehicle Records", [
      "Vehicle: 2021 Honda Accord",
      "VIN: ****************2741",
      "Registration: Active",
      "Title status: Clear",
      "Lien holder: Example Auto Finance",
      "Plate history: TX-TRN-8214; prior TX-TRN-3108"
    ]),
    section("Bankruptcy Records", [
      "Chapter: None found in current fictional profile",
      "Filed: Not applicable",
      "Discharged: Not applicable",
      "Case number: None",
      "Court: None",
      "Status: No bankruptcy record in training data"
    ]),
    section("Liens / Judgments", [
      "Federal liens: None",
      "State liens: None",
      "Civil judgments: One satisfied fictional utility judgment",
      "Tax liens: None",
      "Satisfied: Yes",
      "Outstanding: $0"
    ]),
    section("Criminal Records (Training Only)", [
      "Record found: No current record",
      "Jurisdiction: Fictional training jurisdiction",
      "Offense type: Not applicable",
      "Disposition: Not applicable",
      "Sentence: Not applicable",
      "Case number: TRN-NONE",
      "Always fictional: Yes"
    ]),
    section("Public Records", [
      "Marriage: No current filing shown",
      "Divorce: No current filing shown",
      "Court filings: One satisfied small-claims record",
      "Civil cases: Closed / satisfied",
      "Professional discipline: None",
      "Voter registration: Active training marker"
    ]),
    section("Address History", [
      `Current: ${address}`,
      "Prior: 1028 Cedar Spring, Arlington, TX · 2015-2019",
      "Prior: 77 East Harbor Way, Irving, TX · 2011-2015",
      "Stability: long-term Texas history",
      "Mail-drop indicator: none in fictional data"
    ]),
    section("Phone Numbers", [
      `Primary mobile: ${phone}`,
      "Historical mobile: (***) ***-4412",
      "Home phone: none",
      "Line type: mobile",
      "Carrier age: established",
      "Recent port: none in fictional data"
    ]),
    section("Social & Digital Presence", [
      "Professional profile: fictional employment profile found",
      "Business website: northstar-training.example",
      "Social handles: two fictional public handles",
      "Domain consistency: business domain aligns with registry",
      "Digital age: established before current case"
    ]),
    section("Additional Data Sources", [
      "Customer 360 dossier",
      "Device and IP reuse search",
      "Bank destination history",
      "Prior case relationship search",
      "Business registration extract",
      "Case timeline and report center"
    ])
  ];
}

function section(title, items) {
  return { title, items };
}
