function SectionTitle({ eyebrow, title, aside }) {
  return (
    <div className="faSectionHeader">
      <div>
        <span className="faEyebrow">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      {aside && <span className="faChip cyan">{aside}</span>}
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="faFact">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

export default function Customer360DossierPanel({ activeCase }) {
  const profile = activeCase?.profile || {};
  const employeeDirectory = Array.isArray(profile.employeeDirectory) ? profile.employeeDirectory : [];
  const bankAccounts = Array.isArray(profile.bankAccounts) ? profile.bankAccounts : [];
  const searchableEntities = Array.isArray(profile.searchableEntities) ? profile.searchableEntities : [];
  const lookupKeys = profile.lookupKeys || {};
  const dossierStats = [
    { label: "Directory", value: employeeDirectory.length },
    { label: "Bank records", value: bankAccounts.length },
    { label: "Lookup keys", value: searchableEntities.length },
    { label: "Lane", value: activeCase?.lane || "Case" }
  ];

  return (
    <section className="faGlass faCustomer360Dossier" aria-label="Customer 360 expanded dossier">
      <div className="faCustomer360Hero">
        <div>
          <span className="faEyebrow">Customer 360 expansion</span>
          <h3>Permanent customer dossier</h3>
          <p>
            Stable fictional profile context for who the customer is, what changed, and which values should be searched in lane tools. This is context only, never an answer key.
          </p>
        </div>
        <strong>◌</strong>
      </div>

      <div className="faCustomer360StatRibbon" aria-label="Customer 360 dossier counts">
        {dossierStats.map((stat) => (
          <span key={stat.label}>
            <small>{stat.label}</small>
            <b>{stat.value}</b>
          </span>
        ))}
      </div>

      <div className="faCustomer360PromptRail">
        <span>Investigator use</span>
        <p>Start here for profile context, then move into Identity Intel, Login History, Device/IP, Bank Verification, or Link Analysis to test the story.</p>
        <p>Document matches, partial matches, missing records, and source names. Do not label the case outcome from this page.</p>
      </div>

      <div className="faCustomer360Grid">
        <section className="faDossierCard faDossierWide">
          <span className="faEyebrow">Employee Directory</span>
          {employeeDirectory.length ? (
            <div className="faDossierList">
              {employeeDirectory.map((employee) => (
                <article className="faDossierRecord" key={employee.employeeId || employee.name}>
                  <div className="faDossierRecordTop">
                    <strong>{employee.employeeId || "Employee ID pending"}</strong>
                    <span>{employee.status || "Status pending"}</span>
                  </div>
                  <h4>{employee.name}</h4>
                  <Fact label="Role" value={employee.role} />
                  <Fact label="Tenure" value={employee.tenure} />
                  <Fact label="Trusted phone" value={employee.trustedPhone} />
                  <Fact label="Trusted email" value={employee.trustedEmail} />
                  <Fact label="Prior bank" value={employee.priorBankAccountId} />
                  <Fact label="Requested bank" value={employee.requestedBankAccountId} />
                  <p>{employee.notes}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="faMuted">No employee/vendor directory is required for this lane. Payroll, BEC, vendor, and business-risk cases can populate this section.</p>
          )}
        </section>

        <section className="faDossierCard">
          <span className="faEyebrow">Trusted contact sources</span>
          <Fact label="Customer preferred contact" value={profile.preferredContact} />
          <Fact label="Profile phone" value={lookupKeys.phone || profile.phone} />
          <Fact label="Profile email" value={lookupKeys.email || profile.email} />
          <Fact label="Verification status" value={profile.verificationStatus} />
          {employeeDirectory.slice(0, 2).map((employee) => (
            <div className="faMiniRecord" key={`${employee.employeeId}-trusted`}>
              <strong>{employee.name}</strong>
              <span>{employee.trustedPhone}</span>
              <p>{employee.trustedEmail}</p>
            </div>
          ))}
        </section>
      </div>

      <section className="faDossierCard faDossierFull">
        <SectionTitle eyebrow="Bank Accounts / Destination History" title="Prior, requested, and funding accounts" aside={`${bankAccounts.length} records`} />
        {bankAccounts.length ? (
          <div className="faBankRecordGrid">
            {bankAccounts.map((account) => (
              <article className="faBankRecord" key={account.bankAccountId || account.accountMasked}>
                <div className="faDossierRecordTop">
                  <strong>{account.bankAccountId}</strong>
                  <span>{account.status}</span>
                </div>
                <h4>{account.bankName}</h4>
                <Fact label="Owner" value={account.ownerName} />
                <Fact label="Owner type" value={account.ownerType} />
                <Fact label="Routing" value={account.routingMasked} />
                <Fact label="Account" value={account.accountMasked} />
                <Fact label="First seen" value={account.firstSeen} />
                <Fact label="Prior use" value={account.priorUse} />
                <Fact label="Ownership match" value={account.ownershipMatch} />
                <Fact label="Recoverability" value={account.recoverability} />
              </article>
            ))}
          </div>
        ) : (
          <p className="faMuted">Bank/destination records are pending for this generated profile.</p>
        )}
      </section>

      <section className="faDossierCard faDossierFull">
        <SectionTitle eyebrow="Searchable Lookup Keys" title="Safe fictional values to search in tools" aside={`${searchableEntities.length} keys`} />
        <div className="faLookupGrid">
          {searchableEntities.length ? searchableEntities.map((entity) => (
            <article className="faLookupChip" key={`${entity.type}-${entity.value}`}>
              <span>{entity.type}</span>
              <strong>{entity.value}</strong>
              <p>{entity.use}</p>
            </article>
          )) : (
            <p className="faMuted">Lookup keys are pending. Generated matrix cases should attach masked customer, device, IP, employee, bank, phone, and email keys when available.</p>
          )}
        </div>
      </section>
    </section>
  );
}
