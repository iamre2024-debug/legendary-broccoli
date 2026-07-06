import { useEffect, useState } from "react";
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

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function App() {
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
  const activeProgress = activeCase ? progressFor(activeCase, reviewedTools[activeCase.id], indicatorChecks[activeCase.id], determinations[activeCase.id]) : 0;
  const activeNav = activeCase ? getVisibleNav(activeCase.lane) : getVisibleNav("ATO");
  const visiblePage = activeNav.some((item) => item.id === page) || toolPageIds.has(page) ? page : "dashboard";

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
    <div className="appShell">
      <div className="orb orbOne" />
      <div className="orb orbTwo" />
      <Sidebar
        nav={activeNav}
        page={visiblePage}
        setPage={setPage}
        activeCase={activeCase}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      <main className="mainStage">
        <TopBar
          activeCase={activeCase}
          progress={activeProgress}
          setMobileNavOpen={setMobileNavOpen}
          createGeneratedCase={createGeneratedCase}
        />

        <div className="contentGrid">
          <section className="pagePanel">
            {visiblePage === "dashboard" && (
              <Dashboard
                cases={cases}
                completed={completed}
                activeCase={activeCase}
                openCase={openCase}
                createGeneratedCase={createGeneratedCase}
                resetAll={resetAll}
              />
            )}
            {visiblePage === "queue" && (
              <CaseQueue
                cases={cases}
                completed={completed}
                openCase={openCase}
                filter={filter}
                setFilter={setFilter}
                createGeneratedCase={createGeneratedCase}
              />
            )}
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
            {visiblePage === "indicators" && activeCase && (
              <IndicatorsReview
                checks={indicatorChecks[activeCase.id] || { suspicious: [], normal: [] }}
                toggleIndicator={toggleIndicator}
              />
            )}
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
            {visiblePage === "debrief" && activeCase && (
              <Debrief
                activeCase={activeCase}
                determination={determinations[activeCase.id] || ""}
                justification={justifications[activeCase.id] || ""}
                completed={completed.includes(activeCase.id)}
                openQueue={() => setPage("queue")}
              />
            )}
            {visiblePage === "learning" && <LearningCenter />}
            {toolPageIds.has(visiblePage) && activeCase && (
              <ToolPage
                activeCase={activeCase}
                toolId={visiblePage}
                reviewed={reviewedTools[activeCase.id]?.includes(visiblePage)}
                markReviewed={markToolReviewed}
              />
            )}
          </section>

          <RightRail
            activeCase={activeCase}
            completed={completed}
            reviewedTools={activeCase ? reviewedTools[activeCase.id] || [] : []}
            indicators={activeCase ? indicatorChecks[activeCase.id] || { suspicious: [], normal: [] } : { suspicious: [], normal: [] }}
          />
        </div>
      </main>
    </div>
  );
}

function Sidebar({ nav, page, setPage, activeCase, mobileNavOpen, setMobileNavOpen }) {
  return (
    <aside className={classNames("sidebar", mobileNavOpen && "sidebarOpen")}>
      <div className="brandBlock">
        <div className="brandMark">☾</div>
        <div>
          <h1>Fraud Academy</h1>
          <p>Neon Workstation</p>
        </div>
      </div>

      <div className="miniCase">
        <span className="chip cyan">Active</span>
        <strong>{activeCase?.title || "No active case"}</strong>
        <small>{activeCase?.subtype}</small>
      </div>

      <nav className="navList">
        {nav.map((item) => (
          <button
            key={`${item.id}-${item.label}`}
            className={classNames("navButton", page === item.id && "active")}
            onClick={() => {
              setPage(item.id);
              setMobileNavOpen(false);
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function TopBar({ activeCase, progress, setMobileNavOpen, createGeneratedCase }) {
  return (
    <header className="topBar">
      <button className="mobileMenu" onClick={() => setMobileNavOpen(true)}>☰</button>
      <div className="searchBox">
        <span>⌕</span>
        <input aria-label="Search workstation" placeholder="Search cases, evidence, tools..." />
      </div>
      <button className="ghostButton" onClick={() => createGeneratedCase("RANDOM")}>Generate claim ✨</button>
      <div className="casePulse">
        <span>{activeCase?.id}</span>
        <strong>{progress}% reviewed</strong>
      </div>
    </header>
  );
}

function Dashboard({ cases, completed, activeCase, openCase, createGeneratedCase, resetAll }) {
  const activeCases = cases.filter((item) => !completed.includes(item.id));
  const claimMix = Object.values(CLAIM_FAMILIES).slice(0, 6);

  return (
    <div className="pageStack">
      <section className="heroCard">
        <div>
          <span className="eyebrow">Good evening, Ree</span>
          <h2>Ready to investigate?</h2>
          <p>This workstation is evidence-first. Review the story, compare records, write notes, choose indicators, then make the determination.</p>
          <div className="heroActions">
            <button className="primaryButton" onClick={() => openCase(activeCase?.id)}>Continue active case</button>
            <button className="secondaryButton" onClick={() => createGeneratedCase("RANDOM")}>Generate unlimited claim</button>
            <button className="textButton" onClick={resetAll}>Reset training data</button>
          </div>
        </div>
        <div className="lunaCard">
          <div className="lunaFace">ᓚᘏᗢ</div>
          <h3>Luna desk note</h3>
          <p>No claim soup today. ATO stays ATO. Chargebacks stay in their lane. Evidence before verdict.</p>
        </div>
      </section>

      <div className="statGrid">
        <StatCard label="Cases open" value={activeCases.length} note="Active queue only" />
        <StatCard label="Cases solved" value={completed.length} note="Removed from queue" />
        <StatCard label="XP earned" value={completed.length * 120 + 340} note="Training progress" />
        <StatCard label="Accuracy" value={`${Math.min(70 + completed.length * 4, 94)}%`} note="Starts at 70%" />
      </div>

      <div className="twoColumn">
        <section className="glassCard">
          <div className="sectionHeader"><div><span className="eyebrow">Claim mix</span><h3>Training lanes</h3></div></div>
          <div className="barList">
            {claimMix.map((label, index) => (
              <div className="barRow" key={label}>
                <span>{label}</span>
                <div className="barTrack"><div style={{ width: `${45 + index * 7}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="glassCard">
          <div className="sectionHeader"><div><span className="eyebrow">Recent active cases</span><h3>Queue preview</h3></div></div>
          <div className="caseList">
            {activeCases.slice(0, 4).map((item) => (
              <button className="caseMini" key={item.id} onClick={() => openCase(item.id)}>
                <span className="chip">{item.priority}</span>
                <strong>{item.title}</strong>
                <small>{item.summary}</small>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CaseQueue({ cases, completed, openCase, filter, setFilter, createGeneratedCase }) {
  const activeCases = cases.filter((item) => !completed.includes(item.id));
  const filtered = filter === "ALL" ? activeCases : activeCases.filter((item) => item.lane === filter);
  const lanes = ["ALL", ...Array.from(new Set(cases.map((item) => item.lane)))];

  return (
    <div className="pageStack">
      <PageTitle eyebrow="Case Queue" title="Active fictional claims" subtitle="Completed cases leave this queue. Generate more claims any time." />
      <div className="toolbar">
        <div className="chipRow">
          {lanes.map((lane) => (
            <button key={lane} className={classNames("filterChip", filter === lane && "selected")} onClick={() => setFilter(lane)}>
              {lane === "ALL" ? "All" : CLAIM_FAMILIES[lane]}
            </button>
          ))}
        </div>
        <button className="primaryButton" onClick={() => createGeneratedCase(filter === "ALL" ? "RANDOM" : filter)}>Generate claim</button>
      </div>

      <div className="caseGrid">
        {filtered.map((item) => (
          <article className="caseCard" key={item.id}>
            <div className="caseCardTop"><span className="chip pink">{item.priority}</span><span className="muted">{item.id}</span></div>
            <h3>{item.title}</h3>
            <p className="subtype">{item.subtype}</p>
            <p>{item.summary}</p>
            <div className="factStrip"><span>{item.exposure}</span><span>{item.reportedDate}</span><span>{item.status}</span></div>
            <button className="primaryButton full" onClick={() => openCase(item.id)}>Open case</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function CaseBriefing({ activeCase, setPage }) {
  return (
    <div className="pageStack">
      <PageTitle eyebrow={activeCase.id} title={activeCase.title} subtitle={activeCase.subtype} />
      <section className="briefingHero glassCard">
        <div>
          <span className="eyebrow">Case summary</span>
          <h3>Customer story</h3>
          <p className="largeText">{activeCase.summary}</p>
        </div>
        <div className="briefFacts">
          <Fact label="Exposure" value={activeCase.exposure} />
          <Fact label="Reported" value={activeCase.reportedDate} />
          <Fact label="Issue start" value={activeCase.issueStart} />
          <Fact label="Priority" value={activeCase.priority} />
        </div>
      </section>

      <div className="twoColumn">
        <section className="glassCard"><span className="eyebrow">Statement</span><p className="quote">“{activeCase.statement}”</p></section>
        <section className="glassCard">
          <span className="eyebrow">Suggested starting tools</span>
          <div className="pillWrap">{activeCase.suggestedTools.map((tool) => <span className="pill" key={tool}>{tool}</span>)}</div>
          <button className="primaryButton full" onClick={() => setPage("workspace")}>Begin Investigation</button>
        </section>
      </div>

      <section className="glassCard">
        <div className="sectionHeader"><div><span className="eyebrow">Claim Intake Form</span><h3>Questions for this lane only</h3></div><span className="chip cyan">No irrelevant questions</span></div>
        <div className="questionGrid">
          {activeCase.intakeQuestions.map((question) => <div className="questionCard" key={question}><span>?</span><p>{question}</p></div>)}
        </div>
      </section>

      <section className="glassCard">
        <span className="eyebrow">Intake answers</span>
        <div className="fieldGrid">{Object.entries(activeCase.intakeAnswers || {}).map(([label, value]) => <Fact key={label} label={label} value={value} />)}</div>
      </section>
    </div>
  );
}

function Workspace({ activeCase, reviewedTools, setPage }) {
  const laneTools = toolNavByLane[activeCase.lane] || [];
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Investigation Workspace" title="Claim-specific tools only" subtitle="The sidebar and tool grid change by active claim lane." />
      <div className="toolGrid">
        {laneTools.map((tool) => (
          <button className="toolCard" key={tool.id} onClick={() => setPage(tool.id)}>
            <span className="toolIcon">{tool.icon}</span>
            <strong>{tool.label}</strong>
            <small>{reviewedTools.includes(tool.id) ? "Reviewed" : "Open evidence"}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function Customer360({ activeCase }) {
  const profile = activeCase.profile;
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Customer 360" title="Profile, products, behavior, and history" subtitle="Profile Change History belongs here, not as a random toolkit page." />
      <div className="threeColumn">
        <section className="glassCard"><span className="eyebrow">Identity Snapshot</span><h3>{profile.name}</h3><Fact label="Customer ID" value={profile.customerId} /><Fact label="DOB / profile" value={profile.dob} /><Fact label="Masked ID" value={profile.maskedId} /><Fact label="Customer since" value={profile.customerSince} /><Fact label="Relationship length" value={profile.relationshipLength} /><Fact label="Primary state" value={profile.state} /></section>
        <section className="glassCard"><span className="eyebrow">Contact and behavior</span><Fact label="Preferred contact" value={profile.preferredContact} /><Fact label="Language" value={profile.language} /><Fact label="Verification" value={profile.verificationStatus} /><Fact label="Normal login" value={profile.normalBehavior.loginLocation} /><Fact label="Normal device" value={profile.normalBehavior.device} /><Fact label="Normal deposits" value={profile.normalBehavior.deposits} /></section>
        <section className="glassCard"><span className="eyebrow">Current case snapshot</span><Fact label="Claim" value={activeCase.title} /><Fact label="Subtype" value={activeCase.subtype} /><Fact label="Exposure" value={activeCase.exposure} /><Fact label="Reported" value={activeCase.reportedDate} /><Fact label="Account standing" value={profile.accountStanding} /></section>
      </div>

      <section className="glassCard">
        <div className="sectionHeader"><div><span className="eyebrow">Products and accounts</span><h3>Banking profile</h3></div><span className="chip cyan">Balances, limits, standing</span></div>
        <div className="productGrid">
          {profile.products.map((product) => <div className="productCard" key={product.product}><strong>{product.product}</strong><Fact label="Status" value={product.status} /><Fact label="Balance" value={product.balance} /><Fact label="Limit" value={product.limit} /><Fact label="Standing" value={product.standing} /></div>)}
        </div>
      </section>

      <section className="glassCard">
        <span className="eyebrow">Profile Change Event Log</span>
        <div className="tableLike">
          {profile.profileChanges.map((change, index) => <div className="tableRow" key={`${change.time}-${index}`}><strong>{change.time}</strong><span>{change.event}</span><span>{change.oldValue} → {change.newValue}</span><span>{change.channel}</span><small>{change.notes}</small></div>)}
        </div>
      </section>

      <div className="twoColumn">
        <section className="glassCard"><span className="eyebrow">Prior claims</span>{profile.priorClaims.map((claim) => <div className="miniRecord" key={`${claim.date}-${claim.type}`}><strong>{claim.type}</strong><span>{claim.date}</span><p>{claim.result}</p></div>)}</section>
        <section className="glassCard"><span className="eyebrow">Recent contact</span>{profile.recentContact.map((contact) => <div className="miniRecord" key={`${contact.date}-${contact.channel}`}><strong>{contact.channel}</strong><span>{contact.date}</span><p>{contact.note}</p></div>)}</section>
      </div>
    </div>
  );
}

function ToolPage({ activeCase, toolId, reviewed, markReviewed }) {
  const tool = activeCase.tools[toolId] || {
    title: readable(toolId),
    summary: "This fictional tool is available for this claim lane. Populate it with evidence, fields, timeline items, and training tips.",
    fields: [["Status", "Ready for training data"], ["Lane", activeCase.title]],
    timeline: ["Tool opened", "Evidence reviewed"],
    trainingTip: "Tools should show evidence without revealing the final answer."
  };

  return (
    <div className="pageStack">
      <PageTitle eyebrow="Evidence tool" title={tool.title} subtitle={tool.summary} />
      <div className="toolLayout">
        <section className="glassCard">
          <div className="sectionHeader"><div><span className="eyebrow">Key fields</span><h3>Evidence record</h3></div><span className={classNames("chip", reviewed && "cyan")}>{reviewed ? "Reviewed" : "Evidence only"}</span></div>
          <div className="fieldGrid">{tool.fields.map(([label, value]) => <Fact key={label} label={label} value={value} />)}</div>
          <button className="primaryButton full" onClick={() => markReviewed(toolId)}>Mark this tool reviewed</button>
        </section>
        <section className="glassCard"><span className="eyebrow">Timeline from this tool</span><div className="timeline">{tool.timeline.map((event, index) => <div className="timelineItem" key={`${event}-${index}`}><span>{index + 1}</span><p>{event}</p></div>)}</div></section>
      </div>
      <section className="glassCard"><span className="eyebrow">Training tip</span><p>{tool.trainingTip}</p><p className="muted">Luna does not give the verdict here. Review the evidence, make notes, and decide later.</p></section>
    </div>
  );
}

function EvidenceCenter({ activeCase }) {
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Evidence Center" title="Document file cabinet" subtitle="Documents only. Tool records stay in their tools." />
      <div className="folderGrid">
        {Object.entries(activeCase.documents).map(([folder, docs]) => (
          <details className="folderCard" key={folder} open={docs.length > 0}>
            <summary>{folder} <span>{docs.length}</span></summary>
            {docs.length ? docs.map((doc) => <div className="docRow" key={doc}><span>□</span><strong>{doc}</strong><small>Fictional training document</small></div>) : <p className="muted">No documents in this folder for this claim.</p>}
          </details>
        ))}
      </div>
    </div>
  );
}

function Timeline({ activeCase }) {
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Case Timeline" title="Joined event sequence" subtitle="Intake, profile changes, logins, payments, contact, evidence, and final case steps." />
      <section className="glassCard"><div className="timeline big">{activeCase.timeline.map(([time, event], index) => <div className="timelineItem" key={`${time}-${event}`}><span>{index + 1}</span><div><strong>{time}</strong><p>{event}</p></div></div>)}</div></section>
    </div>
  );
}

function InvestigationSummary({ activeCase, reviewedTools, notes, setNotes }) {
  const laneTools = toolNavByLane[activeCase.lane] || [];
  const missing = laneTools.filter((tool) => !reviewedTools.includes(tool.id));
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Investigation Summary" title="Before determination" subtitle="Summarize reviewed evidence without revealing the final answer." />
      <div className="twoColumn">
        <section className="glassCard"><span className="eyebrow">Reviewed tool checklist</span>{laneTools.map((tool) => <div className="checkRow" key={tool.id}><span className={classNames("checkDot", reviewedTools.includes(tool.id) && "done")}>✓</span><p>{tool.label}</p></div>)}</section>
        <section className="glassCard"><span className="eyebrow">Still missing</span>{missing.length ? missing.map((tool) => <p className="missing" key={tool.id}>{tool.label}</p>) : <p>All lane tools have been marked reviewed.</p>}</section>
      </div>
      <section className="glassCard"><span className="eyebrow">Investigator notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write what you reviewed, what is missing, and what questions remain..." /></section>
    </div>
  );
}

function IndicatorsReview({ checks, toggleIndicator }) {
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Manual Review" title="Suspicious and normal indicators" subtitle="Nothing auto-selects. You choose what the evidence supports." />
      <div className="twoColumn">
        <section className="glassCard"><span className="eyebrow">Suspicious Indicators</span>{suspiciousIndicatorBank.map((label) => <label className="checkboxRow" key={label}><input type="checkbox" checked={(checks.suspicious || []).includes(label)} onChange={() => toggleIndicator("suspicious", label)} /><span>{label}</span></label>)}</section>
        <section className="glassCard"><span className="eyebrow">Normal Activity Indicators</span>{normalIndicatorBank.map((label) => <label className="checkboxRow" key={label}><input type="checkbox" checked={(checks.normal || []).includes(label)} onChange={() => toggleIndicator("normal", label)} /><span>{label}</span></label>)}</section>
      </div>
      <section className="glassCard"><p>Expected training categories for this case are hidden until debrief. This keeps the investigation honest and evidence-first.</p></section>
    </div>
  );
}

function Determination({ activeCase, determination, justification, setDetermination, setJustification, completeCase }) {
  const options = getDeterminationOptions(activeCase.lane);
  const canComplete = determination && justification.trim().length > 15;
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Determination" title="Choose the lane-specific outcome" subtitle="Options change by claim type. Evidence Center never makes the decision." />
      <section className="glassCard"><div className="optionGrid">{options.map((option) => <button className={classNames("decisionOption", determination === option && "selected")} key={option} onClick={() => setDetermination(option)}>{option}</button>)}</div></section>
      <section className="glassCard"><span className="eyebrow">Written justification</span><textarea value={justification} onChange={(event) => setJustification(event.target.value)} placeholder="Explain the evidence you relied on and why this determination fits the claim lane..." /><button className="primaryButton full" disabled={!canComplete} onClick={completeCase}>Complete case and unlock Luna review</button></section>
    </div>
  );
}

function Debrief({ activeCase, determination, justification, completed, openQueue }) {
  const matched = determination === activeCase.correctDetermination;
  return (
    <div className="pageStack">
      <PageTitle eyebrow="Case Debrief" title="Luna / Senior Investigator Review" subtitle={completed ? "Case completed and removed from active queue." : "Complete the case to unlock the full review."} />
      <section className="heroCard">
        <div>
          <span className="eyebrow">Expert comparison</span>
          <h3>{completed ? (matched ? "Strong determination" : "Review the reasoning gap") : "Debrief locked"}</h3>
          <p>{completed ? activeCase.debrief : "Choose a determination and write justification first. Luna keeps the answer tucked away until then."}</p>
          {completed && <div className="fieldGrid"><Fact label="Your determination" value={determination || "None selected"} /><Fact label="Senior reference" value={activeCase.correctDetermination} /><Fact label="Justification" value={justification || "No justification saved"} /><Fact label="QA score" value={matched ? "92%" : "74%"} /></div>}
        </div>
        <div className="lunaCard"><div className="lunaFace">✦ᓚᘏᗢ✦</div><h3>Luna says</h3><p>{completed ? "Look at sequence, fit, and documentation. The best investigators explain what they know and what they still need." : "No spoilers. Finish the determination first."}</p></div>
      </section>
      <button className="secondaryButton" onClick={openQueue}>Back to Queue</button>
    </div>
  );
}

function LearningCenter() {
  const lessons = [
    ["Account Takeover", "Customer denies activity after suspicious login, profile change, MFA, device, IP, or money movement evidence."],
    ["Fraud Chargeback", "A cardholder disputes a transaction as unauthorized or fraud-related. Keep the subtype clean."],
    ["Non-Fraud Chargeback", "A customer participated but disputes delivery, refund, cancellation, duplicate billing, or amount."],
    ["Payroll / BEC", "Payment destination changes need trusted callback, bank ownership review, and timing controls."],
    ["Credit Risk", "Review repayment ability, income support, DTI, payment behavior, utilization, and cash flow."],
    ["Determination wording", "For fraud claims, Support Customer Claim means the evidence supports unauthorized activity. Do Not Support means it does not."]
  ];
  return <div className="pageStack"><PageTitle eyebrow="Learning Center" title="Claim library" subtitle="Quick reference for fraud academy terms and lanes." /><div className="lessonGrid">{lessons.map(([title, body]) => <section className="glassCard lesson" key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></div>;
}

function RightRail({ activeCase, completed, reviewedTools, indicators }) {
  if (!activeCase) return null;
  return (
    <aside className="rightRail">
      <section className="railCard"><span className="eyebrow">Luna rail</span><h3>Current focus</h3><p>{activeCase.title}</p><small>{activeCase.subtype}</small></section>
      <section className="railCard"><span className="eyebrow">Reviewed evidence</span><h3>{reviewedTools.length}</h3><p>tools marked reviewed</p></section>
      <section className="railCard"><span className="eyebrow">Indicators chosen</span><p>{(indicators.suspicious || []).length} suspicious</p><p>{(indicators.normal || []).length} normal</p></section>
      <section className="railCard"><span className="eyebrow">Queue status</span><p>{completed.includes(activeCase.id) ? "Completed" : "Active"}</p></section>
    </aside>
  );
}

function PageTitle({ eyebrow, title, subtitle }) {
  return <div className="pageTitle"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

function StatCard({ label, value, note }) {
  return <section className="statCard"><span>{label}</span><strong>{value}</strong><small>{note}</small></section>;
}

function Fact({ label, value }) {
  return <div className="fact"><span>{label}</span><strong>{value}</strong></div>;
}

function progressFor(activeCase, reviewed = [], checks = {}, determination = "") {
  const tools = toolNavByLane[activeCase.lane] || [];
  const toolScore = tools.length ? Math.round((reviewed.length / tools.length) * 45) : 0;
  const indicatorScore = ((checks.suspicious || []).length + (checks.normal || []).length) > 0 ? 25 : 0;
  const determinationScore = determination ? 30 : 0;
  return Math.min(100, toolScore + indicatorScore + determinationScore);
}

function readable(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}

export default App;
