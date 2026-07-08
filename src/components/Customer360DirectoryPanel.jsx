export default function Customer360DirectoryPanel({ activeCase }) {
  const profile = activeCase?.profile || {};
  const employees = profile.employeeDirectory || [];
  const bankAccounts = profile.bankAccounts || [];
  const searchableEntities = profile.searchableEntities || [];

  return (
    <section className="faGlass faCustomer360Directory" aria-label="Customer 360 search directory">
      <div className="faDirectoryHeader">
        <span className="faEyebrow">Customer 360 directory</span>
        <h3>Employees, bank accounts, and lookup keys</h3>
        <p>
          These records are the searchable profile spine for tools and reports. Use them as fictional lookup inputs, not as a final answer.
        </p>
      </div>

      <div className="faDirectoryGrid">
        <DirectorySection
          eyebrow="Employee directory"
          title={`${employees.length} profile${employees.length === 1 ? "" : "s"}`}
          empty="No employee/vendor directory is required for this lane yet."
        >
          {employees.map((employee) => (
            <article className="faDirectoryCard" key={employee.employeeId}>
              <strong>{employee.employeeId} · {employee.name}</strong>
              <p>{employee.role}</p>
              <Fact label="Status" value={employee.status} />
              <Fact label="Tenure" value={employee.tenure} />
              <Fact label="Trusted phone" value={employee.trustedPhone} />
              <Fact label="Trusted email" value={employee.trustedEmail} />
              <Fact label="Prior bank" value={employee.priorBankAccountId} />
              <Fact label="Requested bank" value={employee.requestedBankAccountId} />
              <small>{employee.notes}</small>
            </article>
          ))}
        </DirectorySection>

        <DirectorySection
          eyebrow="Bank accounts / destination history"
          title={`${bankAccounts.length} record${bankAccounts.length === 1 ? "" : "s"}`}
          empty="No bank account records generated."
        >
          {bankAccounts.map((account) => (
            <article className="faDirectoryCard" key={account.bankAccountId}>
              <strong>{account.bankAccountId} · {account.bankName}</strong>
              <p>{account.ownerType}</p>
              <Fact label="Owner" value={account.ownerName} />
              <Fact label="Account" value={account.accountMasked} />
              <Fact label="Bank code" value={account.routingMasked} />
              <Fact label="First seen" value={account.firstSeen} />
              <Fact label="Prior use" value={account.priorUse} />
              <Fact label="Ownership" value={account.ownershipMatch} />
              <Fact label="Recoverability" value={account.recoverability} />
              <span className={account.status === "First-seen destination" ? "faDirectoryStatus caution" : "faDirectoryStatus"}>{account.status}</span>
            </article>
          ))}
        </DirectorySection>
      </div>

      <section className="faDirectoryLookupShelf">
        <div>
          <span className="faEyebrow">Searchable lookup keys</span>
          <h4>Use these in tool search and report preview</h4>
        </div>
        <div className="faDirectoryPills">
          {searchableEntities.length ? searchableEntities.slice(0, 16).map((entity) => (
            <span key={`${entity.type}-${entity.value}`}>
              <b>{entity.type}</b>
              {entity.value}
              <small>{entity.use}</small>
            </span>
          )) : <p className="faMuted">No extra lookup keys generated for this lane.</p>}
        </div>
      </section>
    </section>
  );
}

function DirectorySection({ eyebrow, title, empty, children }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className="faDirectorySection">
      <div className="faDirectorySectionTitle">
        <span className="faEyebrow">{eyebrow}</span>
        <h4>{title}</h4>
      </div>
      <div className="faDirectoryCards">
        {hasChildren ? children : <p className="faMuted">{empty}</p>}
      </div>
    </section>
  );
}

function Fact({ label, value }) {
  return (
    <div className="faDirectoryFact">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}
