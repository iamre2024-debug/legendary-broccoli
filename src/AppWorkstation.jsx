import { useEffect, useMemo, useState } from "react";
import {
  caseTemplates,
  CLAIM_FAMILIES,
  generateCase,
  getDeterminationOptions,
  getVisibleNav,
  suspiciousIndicatorBank,
  normalIndicatorBank,
  toolNavByLane
} from "./data/caseTemplates";
import { loadState, saveState, resetStorage } from "./utils/storage";

const toolPageIds = new Set(
  Object.values(toolNavByLane)
    .flat()
    .map((tool) => tool.id)
);

const universalPages = new Set([
  "dashboard",
  "queue",
  "briefing",
  "workspace",
  "customer360",
  "evidence",
  "timeline",
  "summary",
  "indicators",
  "determination",
  "debrief",
  "learning"
]);

const categoryMatchers = {
  timeline: ["login", "txn", "transaction", "timeline", "hist", "history", "behavior", "session", "mfa", "paymenttimeline", "payrollrun", "admin", "changerequest", "merchanthistory", "priorclaims", "paymenthistory", "inquiries"],
  identity: ["intel", "identity", "ssn", "phone", "addr", "address", "ofac", "reg", "registration", "ubo", "sig", "signature", "pospay", "image", "endorse", "profileverify", "driverlicense", "selfie", "email", "employee", "ownerykc", "ownerkyc", "kyb", "bank", "beneficiary"],
  financial: ["financial", "income", "employ", "dti", "credit", "cash", "util", "velocity", "pay", "emv", "bankstatements", "revenue", "authorization"],
  technical: ["ip", "device", "domain", "headers", "geo", "terminal", "ops", "emailheaders", "sender"],
  narrative: ["profile", "interview", "callback", "comm", "statement", "purpose", "reason", "merch", "merchant", "receipt", "fulfillment", "terms", "notes"]
};

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function AppWorkstation() {
  const [cases, setCases] = useState(() => loadState("cases", caseTemplates));
  const [activeCaseId, setActiveCaseId] = useState(() => loadState("activeCaseId", caseTemplates[0]?.id));
  const [page, setPage] = useState(() => loadState("page", "dashboard"));
  const [reviewedTools, setReviewedTools] = useState(() => loadState("reviewedTools", {}));
  const [notes, setNotes] = useState(() => loadState("notes", {}));
  const [indicatorChecks, setIndicatorChecks] = useState(() => loadState("indicatorChecks", {}));
  const [determinations, setDeterminations] = useState(() => loadState("determinations", {}));
  const [justifications, setJustifications] = useState(() => loadState("justifications", {}));
  const [completed, setCompleted] = useState(() => loadState("completed", []));
  const [filter, setFilter] = useState("ALL");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeCase = cases.find((item) => item.id === activeCaseId) || cases.find((item) => !completed.includes(item.id)) || cases[0];
  const activeNav = activeCase ? getVisibleNav(activeCase.lane) : getVisibleNav("ATO");
  const visiblePage = activeNav.some((item) => item.id === page) || toolPageIds.has(page) || universalPages.has(page) ? page : "dashboard";
  const activeProgress = activeCase ? progressFor(activeCase, reviewedTools[activeCase.id], indicatorChecks[activeCase.id], determinations[activeCase.id]) : 0;

  useEffect(() => saveState("cases", cases), [cases]);
  useEffect(() => saveState("activeCaseId", activeCaseId), [activeCaseId]);
  useEffect(() => saveState("page", page), [page]);
  useEffect(() => saveState("reviewedTools", reviewedTools), [reviewedTools]);
  useEffect(() => saveState("notes", notes), [notes]);
  useEffect(() => saveState("indicatorChecks", indicatorChecks), [indicatorChecks]);
  useEffect(() => saveState("determinations", determinations), [determinations]);
  useEffect(() => saveState("justifications", justifications), [justifications]);
  useEffect(() => saveState("completed", completed), [completed]);

  function openCase(caseId) {
    setActiveCaseId(caseId);
    setPage("briefing");
    setMobileNavOpen(false);
  }

  function createGeneratedCase(lane = "RANDOM") {
    const next = generateCase(lane);
    setCases((current) => [next, ...current]);
    setActiveCaseId(next.id);
    setPage("briefing");
    setMobileNavOpen(false);
  }

  function markToolReviewed(toolId) {
    if (!activeCase) return;
    setReviewedTools((current) => ({
      ...current,
      [activeCase.id]: Array.from(new Set([...(current[activeCase.id] || []), toolId]))
    }));
  }

  function toggleIndicator(type, label) {
    if (!activeCase) return;
    setIndicatorChecks((current) => {
      const caseChecks = current[activeCase.id] || { suspicious: [], normal: [] };
      const list = caseChecks[type] || [];
      const exists = list.includes(label);
      return {
        ...current,
        [activeCase.id]: {
          ...caseChecks,
          [type]: exists ? list.filter((item) => item !== label) : [...list, label]
        }
      };
    });
  }

  function completeCase() {
    if (!activeCase) return;
    setCompleted((current) => Array.from(new Set([...current, activeCase.id])));
    setPage("debrief");
  }

  function resetAll() {
    resetStorage();
    setCases(caseTemplates);
    setActiveCaseId(caseTemplates[0]?.id);
    setPage("dashboard");
    setReviewedTools({});
    setNotes({});
    setIndicatorChecks({});
    setDeterminations({});
    setJustifications({});
    setCompleted([]);
  }

  return (
    <div className="faShell">
      <div className="faOrb faOrbOne" />
      <div className="faOrb faOrbTwo" />
      <Sidebar nav={activeNav} page={visiblePage} setPage={setPage} activeCase={activeCase} mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      <main className="faMain">
        <TopBar activeCase={activeCase} progress={activeProgress} setMobileNavOpen={setMobileNavOpen} createGeneratedCase={createGeneratedCase} />
        <div className="faContentGrid">
          <section className="faPagePanel">
            {visiblePage === "dashboard" && <Dashboard cases={cases} completed={completed} activeCase={activeCase} openCase={openCase} createGeneratedCase={createGeneratedCase} resetAll={resetAll} />}
            {visiblePage === "queue" && <CaseQueue cases={cases} completed={completed} openCase={openCase} filter={filter} setFilter={setFilter} createGeneratedCase={createGeneratedCase} />}
            {visiblePage === "briefing" && activeCase && <CaseBriefing activeCase={activeCase} setPage={setPage} />}
            {visiblePage === "workspace" && activeCase && <Workspace activeCase={activeCase} reviewedTools={reviewedTools[activeCase.id] || []} setPage={setPage} />}
            {visiblePage === "customer360" && activeCase && <Customer360 activeCase={activeCase} />}
            {visiblePage === "evidence" && activeCase && <EvidenceCenter activeCase={activeCase} />}
            {visiblePage === "timeline" && activeCase && <Timeline activeCase={activeCase} />}
            {visiblePage === "summary" && activeCase && (
              <InvestigationSummary
                activeCase={activeCase}
                reviewedTools={reviewedTools[activeCase.id] || []}
                notes={notes[activeCase.id] || ""}
                setNotes={(value) => setNotes((current) => ({ ...current, [activeCase.id]: value }))}
              />
            )}
            {visiblePage === "indicators" && activeCase && <IndicatorsReview checks={indicatorChecks[activeCase.id] || { suspicious: [], normal: [] }} toggleIndicator={toggleIndicator} />}
            {visiblePage === "determination" && activeCase && (
              <Determination
                activeCase={activeCase}
                determination={determinations[activeCase.id] || ""}
                justification={justifications[activeCase.id] || ""}
                setDetermination={(value) => setDeterminations((current) => ({ ...current, [activeCase.id]: value }))}
                setJustification={(value) => setJustifications((current) => ({ ...current, [activeCase.id]: value }))}
                completeCase={completeCase}
              />
            )}
            {visiblePage === "debrief" && activeCase && <Debrief activeCase={activeCase} determination={determinations[activeCase.id] || ""} justification={justifications[activeCase.id] || ""} completed={completed.includes(activeCase.id)} openQueue={() => setPage("queue")} />}
            {visiblePage === "learning" && <LearningCenter />}
            {toolPageIds.has(visiblePage) && activeCase && <ToolPage activeCase={activeCase} toolId={visiblePage} reviewed={reviewedTools[activeCase.id]?.includes(visiblePage)} markReviewed={markToolReviewed} />}
          </section>
          <RightRail activeCase={activeCase} completed={completed} reviewedTools={activeCase ? reviewedTools[activeCase.id] || [] : []} indicators={activeCase ? indicatorChecks[activeCase.id] || { suspicious: [], normal: [] } : { suspicious: [], normal: [] }} />
        </div>
      </main>
    </div>
  );
}

function Sidebar({ nav, page, setPage, activeCase, mobileNavOpen, setMobileNavOpen }) {
  return (
    <aside className={classNames("faSidebar", mobileNavOpen && "faSidebarOpen")}> 
      <div className="faBrand"><div className="faBrandMark">☾</div><div><h1>Fraud Academy</h1><p>Cozy Workstation</p></div></div>
      <div className="faMiniCase"><span className="faChip cyan">Active</span><strong>{activeCase?.title || "No active case"}</strong><small>{activeCase?.subtype}</small></div>
      <nav className="faNavList">
        {nav.map((item) => (
          <button key={`${item.id}-${item.label}`} className={classNames("faNavButton", page === item.id && "active")} onClick={() => { setPage(item.id); setMobileNavOpen(false); }}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function TopBar({ activeCase, progress, setMobileNavOpen, createGeneratedCase }) {
  return (
    <header className="faTopBar">
      <button className="faMobileMenu" onClick={() => setMobileNavOpen(true)}>☰</button>
      <div className="faSearch"><span>⌕</span><input aria-label="Search workstation" placeholder="Search cases, evidence, tools..." /></div>
      <button className="faGhostButton" onClick={() => createGeneratedCase("RANDOM")}>Generate claim ✨</button>
      <div className="faCasePulse"><span>{activeCase?.id}</span><strong>{progress}% reviewed</strong></div>
    </header>
  );
}

function Dashboard({ cases, completed, activeCase, openCase, createGeneratedCase, resetAll }) {
  const activeCases = cases.filter((item) => !completed.includes(item.id));
  const claimMix = Object.values(CLAIM_FAMILIES).slice(0, 6);
  return (
    <div className="faStack">
      <section className="faHeroCard">
        <div>
          <span className="faEyebrow">Good evening, Ree</span>
          <h2>Welcome back to the investigation desk</h2>
          <p>Evidence first, cozy glow second, conclusions last. The workstation now gives different tool types their own visual language instead of flattening every record.</p>
          <div className="faActions"><button className="faPrimary" onClick={() => openCase(activeCase?.id)}>Continue case</button><button className="faSecondary" onClick={() => createGeneratedCase("RANDOM")}>Generate unlimited claim</button><button className="faTextButton" onClick={resetAll}>Reset training data</button></div>
        </div>
        <div className="faLunaCard"><div className="faLunaFace">ᓚᘏᗢ</div><h3>Luna desk note</h3><p>Different tools need different shapes. Login History is a timeline. Identity checks get verification rows. IP tools get a terminal. No more evidence soup.</p></div>
      </section>
      <div className="faStatGrid"><StatCard label="Cases open" value={activeCases.length} note="Active queue only" /><StatCard label="Cases solved" value={completed.length} note="Removed from queue" /><StatCard label="XP earned" value={completed.length * 120 + 340} note="Training progress" /><StatCard label="Accuracy" value={`${Math.min(70 + completed.length * 4, 94)}%`} note="Starts at 70%" /></div>
      <div className="faTwoColumn"><section className="faGlass"><SectionTitle eyebrow="Claim mix" title="Training lanes" />{claimMix.map((label, index) => <div className="faBarRow" key={label}><span>{label}</span><div><b style={{ width: `${45 + index * 7}%` }} /></div></div>)}</section><section className="faGlass"><SectionTitle eyebrow="Recent active cases" title="Queue preview" />{activeCases.slice(0, 4).map((item) => <button className="faCaseMini" key={item.id} onClick={() => openCase(item.id)}><span className="faChip pink">{item.priority}</span><strong>{item.title}</strong><small>{item.summary}</small></button>)}</section></div>
    </div>
  );
}

function CaseQueue({ cases, completed, openCase, filter, setFilter, createGeneratedCase }) {
  const activeCases = cases.filter((item) => !completed.includes(item.id));
  const filtered = filter === "ALL" ? activeCases : activeCases.filter((item) => item.lane === filter);
  const lanes = ["ALL", ...Array.from(new Set(cases.map((item) => item.lane)))];
  return (
    <div className="faStack">
      <PageTitle eyebrow="Case Queue" title="Active fictional claims" subtitle="Completed cases leave this queue. Generate more claims any time." />
      <div className="faToolbar"><div className="faChipRow">{lanes.map((lane) => <button key={lane} className={classNames("faFilterChip", filter === lane && "selected")} onClick={() => setFilter(lane)}>{lane === "ALL" ? "All" : CLAIM_FAMILIES[lane]}</button>)}</div><button className="faPrimary" onClick={() => createGeneratedCase(filter === "ALL" ? "RANDOM" : filter)}>Generate claim</button></div>
      <div className="faCaseGrid">{filtered.map((item) => <article className="faCaseCard" key={item.id}><div className="faRow"><span className="faChip pink">{item.priority}</span><span className="faMuted">{item.id}</span></div><h3>{item.title}</h3><p className="faSubtype">{item.subtype}</p><p>{item.summary}</p><div className="faFactStrip"><span>{item.exposure}</span><span>{item.reportedDate}</span><span>{item.status}</span></div><button className="faPrimary full" onClick={() => openCase(item.id)}>Open case</button></article>)}</div>
    </div>
  );
}

function CaseBriefing({ activeCase, setPage }) {
  return (
    <div className="faStack">
      <PageTitle eyebrow={activeCase.id} title={activeCase.title} subtitle={activeCase.subtype} />
      <section className="faBriefing faGlass"><div><span className="faEyebrow">Case summary</span><h3>Plain-English story</h3><p className="faLargeText">{activeCase.summary}</p></div><div className="faBriefFacts"><Fact label="Exposure" value={activeCase.exposure} /><Fact label="Reported" value={activeCase.reportedDate} /><Fact label="Issue start" value={activeCase.issueStart} /><Fact label="Priority" value={activeCase.priority} /></div></section>
      <div className="faTwoColumn"><section className="faGlass"><span className="faEyebrow">Statement</span><p className="faQuote">“{activeCase.statement}”</p></section><section className="faGlass"><span className="faEyebrow">Suggested starting tools</span><div className="faPillWrap">{activeCase.suggestedTools?.map((tool) => <span className="faPill" key={tool}>{tool}</span>)}</div><button className="faPrimary full" onClick={() => setPage("workspace")}>Begin Investigation</button></section></div>
      <section className="faGlass"><SectionTitle eyebrow="Claim Intake Form" title="Questions for this lane only" aside="No irrelevant questions" /> <div className="faQuestionGrid">{(activeCase.intakeQuestions || []).map((question) => <div className="faQuestion" key={question}><span>?</span><p>{question}</p></div>)}</div></section>
      <section className="faGlass"><span className="faEyebrow">Intake answers</span><div className="faFieldGrid">{Object.entries(activeCase.intakeAnswers || {}).map(([label, value]) => <Fact key={label} label={label} value={value} />)}</div></section>
    </div>
  );
}

function Workspace({ activeCase, reviewedTools, setPage }) {
  const laneTools = toolNavByLane[activeCase.lane] || [];
  return (
    <div className="faStack">
      <PageTitle eyebrow="Investigation Workspace" title="Claim-specific tools only" subtitle="The sidebar and tool grid change by active claim lane." />
      <div className="faToolGrid">{laneTools.map((tool) => <button className="faToolCard" key={tool.id} onClick={() => setPage(tool.id)}><span className="faToolIcon">{tool.icon}</span><strong>{tool.label}</strong><small>{reviewedTools.includes(tool.id) ? "Reviewed" : `${categoryLabel(getToolCategory(tool.id, activeCase.tools?.[tool.id]))} template`}</small></button>)}</div>
    </div>
  );
}

function Customer360({ activeCase }) {
  const profile = activeCase.profile || {};
  return (
    <div className="faStack">
      <PageTitle eyebrow="Customer 360" title="Profile, products, behavior, and history" subtitle="Profile Change History belongs here, not as a random toolkit page." />
      <div className="faThreeColumn"><section className="faGlass"><span className="faEyebrow">Identity Snapshot</span><h3>{profile.name}</h3><Fact label="Customer ID" value={profile.customerId} /><Fact label="DOB / profile" value={profile.dob} /><Fact label="Masked ID" value={profile.maskedId} /><Fact label="Customer since" value={profile.customerSince} /><Fact label="Relationship length" value={profile.relationshipLength} /><Fact label="Primary state" value={profile.state} /></section><section className="faGlass"><span className="faEyebrow">Contact and behavior</span><Fact label="Preferred contact" value={profile.preferredContact} /><Fact label="Language" value={profile.language} /><Fact label="Verification" value={profile.verificationStatus} /><Fact label="Normal login" value={profile.normalBehavior?.loginLocation} /><Fact label="Normal device" value={profile.normalBehavior?.device} /><Fact label="Normal deposits" value={profile.normalBehavior?.deposits} /></section><section className="faGlass"><span className="faEyebrow">Current case snapshot</span><Fact label="Claim" value={activeCase.title} /><Fact label="Subtype" value={activeCase.subtype} /><Fact label="Exposure" value={activeCase.exposure} /><Fact label="Reported" value={activeCase.reportedDate} /><Fact label="Account standing" value={profile.accountStanding} /></section></div>
      <section className="faGlass"><SectionTitle eyebrow="Products and accounts" title="Banking profile" aside="Balances, limits, standing" /><div className="faProductGrid">{(profile.products || []).map((product) => <div className="faProduct" key={product.product}><strong>{product.product}</strong><Fact label="Status" value={product.status} /><Fact label="Balance" value={product.balance} /><Fact label="Limit" value={product.limit} /><Fact label="Standing" value={product.standing} /></div>)}</div></section>
      <section className="faGlass"><span className="faEyebrow">Profile Change Event Log</span><div className="faTableLike">{(profile.profileChanges || []).map((change, index) => <div className="faTableRow" key={`${change.time}-${index}`}><strong>{change.time}</strong><span>{change.event}</span><span>{change.oldValue} → {change.newValue}</span><span>{change.channel}</span><small>{change.notes}</small></div>)}</div></section>
      <div className="faTwoColumn"><section className="faGlass"><span className="faEyebrow">Prior claims</span>{(profile.priorClaims || []).map((claim) => <div className="faMiniRecord" key={`${claim.date}-${claim.type}`}><strong>{claim.type}</strong><span>{claim.date}</span><p>{claim.result}</p></div>)}</section><section className="faGlass"><span className="faEyebrow">Recent contact</span>{(profile.recentContact || []).map((contact) => <div className="faMiniRecord" key={`${contact.date}-${contact.channel}`}><strong>{contact.channel}</strong><span>{contact.date}</span><p>{contact.note}</p></div>)}</section></div>
    </div>
  );
}

function ToolPage({ activeCase, toolId, reviewed, markReviewed }) {
  const tool = activeCase.tools?.[toolId] || fallbackTool(toolId, activeCase);
  const category = getToolCategory(toolId, tool);
  const rows = normalizeToolRows(tool);
  const events = normalizeTimeline(tool, rows);
  const Body = {
    timeline: TimelineToolTemplate,
    identity: IdentityToolTemplate,
    financial: FinancialToolTemplate,
    technical: TechnicalToolTemplate,
    narrative: NarrativeToolTemplate
  }[category] || NarrativeToolTemplate;

  return (
    <div className="faStack">
      <PageTitle eyebrow="Evidence tool" title={tool.title || readable(toolId)} subtitle={tool.summary} />
      <details className="faToolWhy faGlass" open>
        <summary><span>Why this tool?</span><strong>{categoryLabel(category)} view</strong></summary>
        <p>{tool.summary || "This tool shows case evidence only. It does not decide the case."}</p>
        <p className="faMuted">Luna keeps the verdict hidden until Determination and Debrief.</p>
      </details>
      <Body tool={tool} rows={rows} events={events} reviewed={reviewed} />
      <section className="faGlass faToolFooter"><div><span className="faEyebrow">Training tip</span><p>{tool.trainingTip || "Compare this evidence against the case briefing. Do not decide inside the tool."}</p></div><button className="faPrimary" onClick={() => markReviewed(toolId)}>{reviewed ? "Reviewed ✓" : "Mark this tool reviewed"}</button></section>
    </div>
  );
}

function TimelineToolTemplate({ rows, events, reviewed }) {
  return (
    <div className="faToolLayout timelineView">
      <section className="faGlass faToolMain"><SectionTitle eyebrow="Chronological record" title="Event sequence" aside={reviewed ? "Reviewed" : "Evidence only"} /><div className="faTimelinePath">{events.map((event, index) => <div className={classNames("faTimelineEvent", flagClass(event.flag))} key={`${event.time}-${event.text}-${index}`}><span>{index + 1}</span><div><strong>{event.time || `Event ${index + 1}`}</strong><p>{event.text}</p></div></div>)}</div></section>
      <section className="faGlass faToolSide"><span className="faEyebrow">Record fields</span>{rows.map((row) => <Fact key={`${row.k}-${row.v}`} label={row.k} value={row.v} />)}</section>
    </div>
  );
}

function IdentityToolTemplate({ rows, reviewed }) {
  const counts = rows.reduce((acc, row) => { acc[row.flag || "neutral"] = (acc[row.flag || "neutral"] || 0) + 1; return acc; }, {});
  return (
    <div className="faToolLayout identityView">
      <section className="faGlass faToolMain"><SectionTitle eyebrow="Verification matrix" title="Identity / match checks" aside={reviewed ? "Reviewed" : "Evidence only"} /><div className="faBubbleRow"><span className="faBubble good">✓ {counts.good || 0} fit</span><span className="faBubble caution">! {counts.caution || 0} review</span><span className="faBubble neutral">▫ {counts.neutral || 0} neutral</span></div><div className="faVerifyList">{rows.map((row) => <div className={classNames("faVerifyRow", flagClass(row.flag))} key={`${row.k}-${row.v}`}><span>{flagIcon(row.flag)}</span><div><strong>{row.k}</strong><p>{row.v}</p></div></div>)}</div></section>
      <section className="faGlass faEvidenceExplorer"><span className="faEyebrow">Evidence Explorer</span><p>Use this panel to compare identity signals with Customer 360. A match supports identity consistency, not a final fraud verdict.</p>{rows.slice(0, 5).map((row) => <button key={row.k}>{row.k}<small>{row.v}</small></button>)}</section>
    </div>
  );
}

function FinancialToolTemplate({ rows, reviewed }) {
  return (
    <div className="faStack financialView">
      <section className="faGlass"><SectionTitle eyebrow="Money command center" title="KPIs and account behavior" aside={reviewed ? "Reviewed" : "Evidence only"} /><div className="faKpiGrid">{rows.map((row) => <div className={classNames("faKpiTile", flagClass(row.flag))} key={`${row.k}-${row.v}`}><span>{row.k}</span><strong>{row.v}</strong></div>)}</div></section>
      <div className="faTwoColumn"><section className="faGlass"><span className="faEyebrow">Trend lens</span><div className="faMiniBars">{rows.slice(0, 6).map((row, index) => <div key={`${row.k}-bar`}><span>{row.k}</span><b style={{ width: `${42 + ((index * 11) % 46)}%` }} /></div>)}</div></section><section className="faGlass"><span className="faEyebrow">Reviewed financial facts</span><p>Look for whether the money movement, income, deposits, or credit behavior makes sense for this lane. No final conclusion appears here.</p></section></div>
    </div>
  );
}

function TechnicalToolTemplate({ rows, reviewed }) {
  return (
    <div className="faToolLayout technicalView">
      <section className="faGlass faToolMain"><SectionTitle eyebrow="Technical readout" title="Network / device / header evidence" aside={reviewed ? "Reviewed" : "Evidence only"} /><div className="faTerminal"><div className="faTerminalTop"><span /> <span /> <span /><strong>fraud-academy://tool-evidence</strong></div>{rows.map((row) => <pre className={flagClass(row.flag)} key={`${row.k}-${row.v}`}><code>&gt; {row.k}: {row.v}</code></pre>)}</div></section>
      <section className="faGlass faToolSide"><span className="faEyebrow">Packet notes</span><p>Technical indicators can show mismatch, velocity, routing, or environment risk. They still need to be compared against the case story.</p></section>
    </div>
  );
}

function NarrativeToolTemplate({ rows, reviewed }) {
  return (
    <div className="faToolLayout narrativeView">
      <section className="faGlass faToolMain"><SectionTitle eyebrow="Narrative record" title="Statements, calls, merchant, purpose" aside={reviewed ? "Reviewed" : "Evidence only"} /><div className="faQuoteStack">{rows.map((row) => <article className={classNames("faNarrativeCard", flagClass(row.flag))} key={`${row.k}-${row.v}`}><span>{flagIcon(row.flag)}</span><div><strong>{row.k}</strong><p>“{row.v}”</p></div></article>)}</div></section>
      <section className="faGlass faToolSide"><span className="faEyebrow">Consistency lens</span><p>Check whether the story fits the documents, timeline, and money movement. A statement is evidence, not the verdict.</p></section>
    </div>
  );
}

function EvidenceCenter({ activeCase }) {
  return (
    <div className="faStack"><PageTitle eyebrow="Evidence Center" title="Document file cabinet" subtitle="Documents only. Tool records stay in their tools." /><div className="faFolderGrid">{Object.entries(activeCase.documents || {}).map(([folder, docs]) => <details className="faFolderCard" key={folder} open={docs.length > 0}><summary>{folder} <span>{docs.length}</span></summary>{docs.length ? docs.map((doc) => <div className="faDocRow" key={doc}><span>□</span><strong>{doc}</strong><small>Fictional training document</small></div>) : <p className="faMuted">No documents in this folder for this claim.</p>}</details>)}</div></div>
  );
}

function Timeline({ activeCase }) {
  return <div className="faStack"><PageTitle eyebrow="Case Timeline" title="Joined event sequence" subtitle="Intake, profile changes, logins, payments, contact, evidence, and final case steps." /><section className="faGlass"><div className="faTimelinePath big">{(activeCase.timeline || []).map(([time, event], index) => <div className="faTimelineEvent" key={`${time}-${event}`}><span>{index + 1}</span><div><strong>{time}</strong><p>{event}</p></div></div>)}</div></section></div>;
}

function InvestigationSummary({ activeCase, reviewedTools, notes, setNotes }) {
  const laneTools = toolNavByLane[activeCase.lane] || [];
  const missing = laneTools.filter((tool) => !reviewedTools.includes(tool.id));
  return <div className="faStack"><PageTitle eyebrow="Investigation Summary" title="Before determination" subtitle="Summarize reviewed evidence without revealing the final answer." /><div className="faTwoColumn"><section className="faGlass"><span className="faEyebrow">Reviewed tool checklist</span>{laneTools.map((tool) => <div className="faCheckRow" key={tool.id}><span className={classNames("faCheckDot", reviewedTools.includes(tool.id) && "done")}>✓</span><p>{tool.label}</p></div>)}</section><section className="faGlass"><span className="faEyebrow">Still missing</span>{missing.length ? missing.map((tool) => <p className="faMissing" key={tool.id}>{tool.label}</p>) : <p>All lane tools have been marked reviewed.</p>}</section></div><section className="faGlass"><span className="faEyebrow">Investigator notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write what you reviewed, what is missing, and what questions remain..." /></section></div>;
}

function IndicatorsReview({ checks, toggleIndicator }) {
  return <div className="faStack"><PageTitle eyebrow="Manual Review" title="Suspicious and normal indicators" subtitle="Nothing auto-selects. You choose what the evidence supports." /><div className="faTwoColumn"><section className="faGlass"><span className="faEyebrow">Suspicious Indicators</span>{suspiciousIndicatorBank.map((label) => <label className="faCheckboxRow" key={label}><input type="checkbox" checked={(checks.suspicious || []).includes(label)} onChange={() => toggleIndicator("suspicious", label)} /><span>{label}</span></label>)}</section><section className="faGlass"><span className="faEyebrow">Normal Activity Indicators</span>{normalIndicatorBank.map((label) => <label className="faCheckboxRow" key={label}><input type="checkbox" checked={(checks.normal || []).includes(label)} onChange={() => toggleIndicator("normal", label)} /><span>{label}</span></label>)}</section></div><section className="faGlass"><p>Expected training categories for this case are hidden until debrief. This keeps the investigation honest and evidence-first.</p></section></div>;
}

function Determination({ activeCase, determination, justification, setDetermination, setJustification, completeCase }) {
  const options = getDeterminationOptions(activeCase.lane);
  const canComplete = determination && justification.trim().length > 15;
  return <div className="faStack"><PageTitle eyebrow="Determination" title="Choose the lane-specific outcome" subtitle="Options change by claim type. Evidence Center never makes the decision." /><section className="faGlass"><div className="faOptionGrid">{options.map((option) => <button className={classNames("faDecisionOption", determination === option && "selected")} key={option} onClick={() => setDetermination(option)}>{option}</button>)}</div></section><section className="faGlass"><span className="faEyebrow">Written justification</span><textarea value={justification} onChange={(event) => setJustification(event.target.value)} placeholder="Explain the evidence you relied on and why this determination fits the claim lane..." /><button className="faPrimary full" disabled={!canComplete} onClick={completeCase}>Complete case and unlock Luna review</button></section></div>;
}

function Debrief({ activeCase, determination, justification, completed, openQueue }) {
  const matched = determination === activeCase.correctDetermination;
  return <div className="faStack"><PageTitle eyebrow="Case Debrief" title="Luna / Senior Investigator Review" subtitle={completed ? "Case completed and removed from active queue." : "Complete the case to unlock the full review."} /><section className="faHeroCard"><div><span className="faEyebrow">Expert comparison</span><h3>{completed ? (matched ? "Strong determination" : "Review the reasoning gap") : "Debrief locked"}</h3><p>{completed ? activeCase.debrief : "Choose a determination and write justification first. Luna keeps the answer tucked away until then."}</p>{completed && <div className="faFieldGrid"><Fact label="Your determination" value={determination || "None selected"} /><Fact label="Senior reference" value={activeCase.correctDetermination} /><Fact label="Justification" value={justification || "No justification saved"} /><Fact label="QA score" value={matched ? "92%" : "74%"} /></div>}</div><div className="faLunaCard"><div className="faLunaFace">✦ᓚᘏᗢ✦</div><h3>Luna says</h3><p>{completed ? "Look at sequence, fit, and documentation. The best investigators explain what they know and what they still need." : "No spoilers. Finish the determination first."}</p></div></section><button className="faSecondary" onClick={openQueue}>Back to Queue</button></div>;
}

function LearningCenter() {
  const lessons = [["Timeline tools", "Login, transaction, history, behavior, and payment tools now show chronological event paths."], ["Identity tools", "SSN, phone, address, OFAC, registration, signature, check image, and endorsement tools now use verification rows."], ["Financial tools", "Income, DTI, credit, cash flow, utilization, velocity, pay, and EMV tools use KPI tiles and trend cards."], ["Technical tools", "IP, device, domain, headers, geo, terminal, and ops tools render as terminal-style readouts."], ["Narrative tools", "Profile, interview, callback, statement, reason code, merchant, beneficiary, and notes use quote-card evidence blocks."], ["Determination wording", "For fraud claims, Support Customer Claim means the evidence supports unauthorized activity. Do Not Support means it does not."]];
  return <div className="faStack"><PageTitle eyebrow="Learning Center" title="Tool visual language" subtitle="The same data can now render as five different investigative experiences." /><div className="faLessonGrid">{lessons.map(([title, body]) => <section className="faGlass faLesson" key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></div>;
}

function RightRail({ activeCase, completed, reviewedTools, indicators }) {
  if (!activeCase) return null;
  return <aside className="faRightRail"><section className="faRailCard"><span className="faEyebrow">Luna rail</span><h3>Current focus</h3><p>{activeCase.title}</p><small>{activeCase.subtype}</small></section><section className="faRailCard"><span className="faEyebrow">Reviewed evidence</span><h3>{reviewedTools.length}</h3><p>tools marked reviewed</p></section><section className="faRailCard"><span className="faEyebrow">Indicators chosen</span><p>{(indicators.suspicious || []).length} suspicious</p><p>{(indicators.normal || []).length} normal</p></section><section className="faRailCard"><span className="faEyebrow">Queue status</span><p>{completed.includes(activeCase.id) ? "Completed" : "Active"}</p></section></aside>;
}

function PageTitle({ eyebrow, title, subtitle }) { return <div className="faPageTitle"><span className="faEyebrow">{eyebrow}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>; }
function SectionTitle({ eyebrow, title, aside }) { return <div className="faSectionHeader"><div><span className="faEyebrow">{eyebrow}</span><h3>{title}</h3></div>{aside && <span className="faChip cyan">{aside}</span>}</div>; }
function StatCard({ label, value, note }) { return <section className="faStatCard"><span>{label}</span><strong>{value}</strong><small>{note}</small></section>; }
function Fact({ label, value }) { return <div className="faFact"><span>{label}</span><strong>{value ?? "Not provided"}</strong></div>; }

function progressFor(activeCase, reviewed = [], checks = {}, determination = "") {
  const tools = toolNavByLane[activeCase.lane] || [];
  const toolScore = tools.length ? Math.round((reviewed.length / tools.length) * 45) : 0;
  const indicatorScore = ((checks.suspicious || []).length + (checks.normal || []).length) > 0 ? 25 : 0;
  const determinationScore = determination ? 30 : 0;
  return Math.min(100, toolScore + indicatorScore + determinationScore);
}

function fallbackTool(toolId, activeCase) {
  return { title: readable(toolId), summary: "This fictional tool is available for this claim lane. It uses a category-specific evidence template.", fields: [["Status", "Ready for training data"], ["Lane", activeCase.title], ["Evidence mode", "Evidence only, no final verdict"]], timeline: ["Tool opened", "Evidence reviewed"], trainingTip: "Tools should show evidence without revealing the final answer." };
}

function getToolCategory(toolId, tool = {}) {
  const haystack = `${toolId} ${tool.title || ""}`.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  for (const [category, keys] of Object.entries(categoryMatchers)) if (keys.some((key) => haystack.includes(key))) return category;
  return "narrative";
}

function categoryLabel(category) {
  return { timeline: "Timeline", identity: "Identity / Verification", financial: "Financial / Metrics", technical: "Technical / Network", narrative: "Narrative / Communication" }[category] || "Evidence";
}

function normalizeToolRows(tool) {
  if (Array.isArray(tool.rows)) return tool.rows.map((row) => ({ k: row.k || row.label || "Record", v: String(row.v ?? row.value ?? "Not provided"), flag: normalizeFlag(row.flag) }));
  if (Array.isArray(tool.fields)) return tool.fields.map(([k, v]) => ({ k, v: String(v ?? "Not provided"), flag: inferFlag(`${k} ${v}`) }));
  return [["Status", "Ready for training data"], ["Evidence mode", "Evidence only, no final verdict"]].map(([k, v]) => ({ k, v, flag: "neutral" }));
}

function normalizeTimeline(tool, rows) {
  if (Array.isArray(tool.timeline) && tool.timeline.length) return tool.timeline.map((item, index) => Array.isArray(item) ? { time: item[0], text: item[1], flag: "neutral" } : { time: `Step ${index + 1}`, text: item, flag: inferFlag(item) });
  return rows.map((row, index) => ({ time: row.k || `Step ${index + 1}`, text: row.v, flag: row.flag }));
}

function normalizeFlag(flag) {
  if (["good", "pass", "normal", "verified", "match"].includes(String(flag).toLowerCase())) return "good";
  if (["bad", "fail", "risk", "warn", "warning", "caution", "mismatch"].includes(String(flag).toLowerCase())) return "caution";
  return "neutral";
}

function inferFlag(value = "") {
  const text = String(value).toLowerCase();
  if (["verified", "known", "stable", "good", "passed", "complete", "match", "no suspicious", "not involved"].some((term) => text.includes(term))) return "good";
  if (["new", "first-seen", "mismatch", "unable", "pending", "failed", "high", "limited", "no answer", "not confirmed", "changed", "prepaid"].some((term) => text.includes(term))) return "caution";
  return "neutral";
}

function flagClass(flag) { return flag === "good" ? "good" : flag === "caution" ? "caution" : "neutral"; }
function flagIcon(flag) { return flag === "good" ? "✓" : flag === "caution" ? "!" : "▫"; }
function readable(value) { return value.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase()); }

export default AppWorkstation;
