import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#07091A",
  surface: "#0F1629",
  card: "#151D35",
  cardHover: "#1A2440",
  border: "#1E2D4A",
  accent: "#FF6B35",
  accentSoft: "#FF6B3520",
  accentHover: "#FF8555",
  gold: "#FFB347",
  goldSoft: "#FFB34720",
  green: "#22D17A",
  greenSoft: "#22D17A20",
  red: "#FF4757",
  redSoft: "#FF475720",
  text: "#E8EDF8",
  muted: "#7A8BAD",
  subtle: "#3A4A6B",
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; font-family: 'DM Sans', sans-serif; color: ${COLORS.text}; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${COLORS.surface}; } ::-webkit-scrollbar-thumb { background: ${COLORS.subtle}; border-radius: 4px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
  @keyframes typing { 0%,100%{opacity:1} 50%{opacity:0} }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .card-hover { transition: all 0.2s ease; cursor: pointer; }
  .card-hover:hover { background: ${COLORS.cardHover}; transform: translateY(-2px); border-color: ${COLORS.subtle} !important; }
  .btn-primary { background: ${COLORS.accent}; color: #fff; border: none; cursor: pointer; font-family: 'DM Sans',sans-serif; font-weight: 600; transition: all 0.2s; }
  .btn-primary:hover { background: ${COLORS.accentHover}; transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: ${COLORS.text}; border: 1px solid ${COLORS.border}; cursor: pointer; font-family: 'DM Sans',sans-serif; transition: all 0.2s; }
  .btn-secondary:hover { border-color: ${COLORS.accent}; color: ${COLORS.accent}; }
  input, textarea, select { background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; font-family: 'DM Sans',sans-serif; outline: none; }
  input:focus, textarea:focus, select:focus { border-color: ${COLORS.accent}; }
  .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const JOBS = [
  { id:1, title:"ML Engineer Intern", company:"Arbisoft", logo:"🤖", location:"Lahore (Hybrid)", type:"Internship", posted:"2d ago", match:94, repScore:88, growthScore:92, salary:"PKR 35k/mo", tags:["Python","PyTorch","NLP"], repBadge:"great", flags:[], jd:"We are looking for a passionate ML Engineering intern to join our AI team. You will work on production NLP pipelines, model fine-tuning, and MLOps tooling.", desc:"Arbisoft is a top-rated software house with a strong ML practice. Founded in 2009, it has grown to 1000+ engineers and partners with global tech leaders.", industry:"Software / AI", size:"1,000–2,000", funding:"Bootstrapped / Profitable" },
  { id:2, title:"Frontend Developer Intern", company:"Systems Ltd", logo:"💻", location:"Karachi (On-site)", type:"Internship", posted:"1d ago", match:89, repScore:72, growthScore:78, salary:"PKR 25k/mo", tags:["React","TypeScript","Node.js"], repBadge:"okay", flags:["Slow hiring process reported on Reddit"], jd:"Join our product team building enterprise SaaS dashboards. You will work with senior engineers on a React/TypeScript codebase serving 500+ clients.", desc:"Systems Ltd is Pakistan's largest IT company listed on PSX, delivering enterprise solutions since 1977.", industry:"Enterprise IT", size:"3,000+", funding:"Public (PSX)" },
  { id:3, title:"Data Science Intern", company:"Bykea", logo:"🛵", location:"Karachi (Remote)", type:"Internship", posted:"3d ago", match:85, repScore:90, growthScore:88, salary:"PKR 30k/mo", tags:["Python","SQL","Power BI"], repBadge:"great", flags:[], jd:"Work alongside our data science team to build predictive models for route optimization and demand forecasting for Pakistan's leading ride-hailing platform.", desc:"Bykea is Pakistan's fastest-growing super-app with 4M+ users. Series B funded with aggressive expansion roadmap.", industry:"Tech / Logistics", size:"500–1,000", funding:"Series B ($10M+)" },
  { id:4, title:"Backend Intern (Node.js)", company:"Bazaar Technologies", logo:"🏪", location:"Karachi (Hybrid)", type:"Internship", posted:"5d ago", match:81, repScore:55, growthScore:82, salary:"PKR 28k/mo", tags:["Node.js","MongoDB","AWS"], repBadge:"mixed", flags:["High workload mentioned on Glassdoor","Some unpaid overtime reports"], jd:"Build scalable microservices for our B2B e-commerce platform powering thousands of kiryana stores.", desc:"Bazaar is a VC-backed B2B marketplace transforming Pakistan's informal retail sector. Series B company.", industry:"E-commerce / B2B", size:"200–500", funding:"Series B ($30M+)" },
  { id:5, title:"AI Research Intern", company:"i2c Inc.", logo:"🔬", location:"Lahore (On-site)", type:"Internship", posted:"1d ago", match:79, repScore:94, growthScore:96, salary:"PKR 45k/mo", tags:["Python","LLMs","Research"], repBadge:"excellent", flags:[], jd:"Work directly with our AI research team on cutting-edge fintech AI solutions. Publication opportunities available. US-based product company.", desc:"i2c is a global fintech company headquartered in the US with a major R&D hub in Lahore. Excellent career launchpad.", industry:"Fintech / AI", size:"1,000+", funding:"Profitable / Global" },
];

const TRACKER = [
  { id:1, job:"ML Engineer Intern", company:"Arbisoft", status:"Interview", date:"Jun 5, 2026", color: COLORS.gold },
  { id:2, job:"Data Science Intern", company:"Bykea", status:"Applied", date:"May 28, 2026", color: COLORS.accent },
  { id:3, job:"AI Research Intern", company:"i2c Inc.", status:"Screening", date:"May 30, 2026", color: "#7C5CBF" },
  { id:4, job:"React Developer", company:"Folio3", status:"Rejected", date:"May 20, 2026", color: COLORS.red },
];

const ROADMAP_TOPICS = {
  "ML Engineer Intern": [
    { day:"Day 1–2", topic:"Python fundamentals review", subtopics:["List comprehensions","Generators","OOP"], done:true },
    { day:"Day 3–4", topic:"PyTorch core concepts", subtopics:["Tensors","Autograd","nn.Module"], done:true },
    { day:"Day 5–6", topic:"NLP fundamentals", subtopics:["Tokenization","Embeddings","Attention"], done:false },
    { day:"Day 7", topic:"System design for ML", subtopics:["Feature stores","Serving","Monitoring"], done:false },
    { day:"Day 8", topic:"Arbisoft-specific prep", subtopics:["Past interview Q&A","Company values","Product review"], done:false },
  ],
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const Icon = ({ n, size=16, color="inherit" }) => {
  const icons = {
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
    chart: "M18 20V10M12 20V4M6 20v-6",
    calendar: "M3 9h18M3 5h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M8 3v4M16 3v4",
    mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    trend: "M23 6l-9.5 9.5-5-5L1 18",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    arrow: "M5 12h14M12 5l7 7-7 7",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
    lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
    map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16M16 6v16",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(icons[n]||"").split(" M ").map((d,i) => <path key={i} d={i===0?d:"M "+d}/>)}
    </svg>
  );
};

const Badge = ({ type }) => {
  const map = { excellent:["🏆 Excellent","#22D17A","#22D17A20"], great:["✅ Great","#7C5CBF","#7C5CBF20"], okay:["⚡ Okay",COLORS.gold,COLORS.goldSoft], mixed:["⚠️ Mixed",COLORS.red,COLORS.redSoft] };
  const [label, color, bg] = map[type]||map.okay;
  return <span className="tag" style={{background:bg,color,border:`1px solid ${color}30`}}>{label}</span>;
};

const RepFlag = ({ flags }) => {
  if (!flags?.length) return <span className="tag" style={{background:COLORS.greenSoft,color:COLORS.green,border:`1px solid ${COLORS.green}30`}}>✓ No red flags</span>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {flags.map((f,i) => (
        <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",fontSize:12,color:COLORS.red}}>
          <Icon n="flag" size={12} color={COLORS.red}/> {f}
        </div>
      ))}
    </div>
  );
};

const ScoreRing = ({ value, label, color }) => {
  const r = 22, circ = 2*Math.PI*r;
  const offset = circ - (value/100)*circ;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={56} height={56}>
        <circle cx={28} cy={28} r={r} fill="none" stroke={COLORS.border} strokeWidth={3}/>
        <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 28 28)"/>
        <text x={28} y={32} textAnchor="middle" fontSize={12} fontWeight={600} fill={color}>{value}</text>
      </svg>
      <span style={{fontSize:10,color:COLORS.muted,textAlign:"center"}}>{label}</span>
    </div>
  );
};

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${active?COLORS.accent:COLORS.border}`,background:active?COLORS.accentSoft:"transparent",color:active?COLORS.accent:COLORS.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}>
    {label}
  </button>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────

const Nav = ({ page, setPage }) => {
  const items = [
    { id:"dashboard", icon:"home", label:"Discover" },
    { id:"tracker", icon:"briefcase", label:"Applications" },
    { id:"scheduler", icon:"calendar", label:"Interviews" },
    { id:"interview", icon:"mic", label:"AI Prep" },
    { id:"profile", icon:"user", label:"Profile" },
  ];
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:COLORS.surface,borderTop:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-around",padding:"10px 0 12px",zIndex:100,maxWidth:480,margin:"0 auto"}}>
      {items.map(it => (
        <button key={it.id} onClick={()=>setPage(it.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",transition:"all 0.15s"}}>
          <Icon n={it.icon} size={20} color={page===it.id?COLORS.accent:COLORS.muted}/>
          <span style={{fontSize:10,color:page===it.id?COLORS.accent:COLORS.muted,fontFamily:"'DM Sans',sans-serif"}}>{it.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ─── ONBOARDING ──────────────────────────────────────────────────────────────

const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [prefs, setPrefs] = useState({ type:[], mode:[], field:"" });
  const fileRef = useRef();

  const screens = [
    // Welcome
    <div className="fade-up" style={{textAlign:"center",padding:"60px 32px"}}>
      <div style={{fontSize:56,marginBottom:16}}>🎯</div>
      <h1 style={{fontFamily:"Syne",fontSize:32,fontWeight:800,lineHeight:1.2,marginBottom:12}}>Find Your <span style={{color:COLORS.accent}}>Dream</span> Opportunity</h1>
      <p style={{color:COLORS.muted,fontSize:15,lineHeight:1.7,marginBottom:40}}>AI-powered job hunting with reputation checks, growth scoring, and live interview prep.</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <button className="btn-primary" onClick={()=>setStep(1)} style={{padding:"16px",borderRadius:14,fontSize:16,width:"100%"}}>Get Started →</button>
        <button className="btn-secondary" onClick={onDone} style={{padding:"14px",borderRadius:14,fontSize:15,width:"100%"}}>Explore Demo</button>
      </div>
    </div>,

    // Resume Upload
    <div className="fade-up" style={{padding:"40px 24px"}}>
      <div style={{marginBottom:8,color:COLORS.muted,fontSize:13}}>Step 1 of 3</div>
      <h2 style={{fontFamily:"Syne",fontSize:24,fontWeight:700,marginBottom:8}}>Upload your resume</h2>
      <p style={{color:COLORS.muted,fontSize:14,marginBottom:28}}>We'll extract your skills and auto-fill applications.</p>
      <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${file?COLORS.accent:COLORS.border}`,borderRadius:16,padding:"40px 24px",textAlign:"center",cursor:"pointer",background:file?COLORS.accentSoft:"transparent",transition:"all 0.2s"}}>
        <div style={{fontSize:36,marginBottom:12}}>{file?"✅":"📄"}</div>
        <div style={{fontWeight:600,marginBottom:4}}>{file?file.name:"Drop PDF or DOCX here"}</div>
        <div style={{fontSize:13,color:COLORS.muted}}>{file?"Resume uploaded!":"or click to browse"}</div>
        <input ref={fileRef} type="file" accept=".pdf,.docx" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
      </div>
      {file && (
        <div style={{marginTop:16,padding:"14px 16px",background:COLORS.greenSoft,borderRadius:12,border:`1px solid ${COLORS.green}30`}}>
          <div style={{fontSize:13,color:COLORS.green,fontWeight:600,marginBottom:4}}>✓ Parsed successfully</div>
          <div style={{fontSize:12,color:COLORS.muted}}>Skills detected: Python, React, Machine Learning, SQL, Git</div>
        </div>
      )}
      <button className="btn-primary" onClick={()=>setStep(2)} style={{padding:"15px",borderRadius:14,fontSize:15,width:"100%",marginTop:28}}>Continue →</button>
    </div>,

    // Preferences
    <div className="fade-up" style={{padding:"40px 24px"}}>
      <div style={{marginBottom:8,color:COLORS.muted,fontSize:13}}>Step 2 of 3</div>
      <h2 style={{fontFamily:"Syne",fontSize:24,fontWeight:700,marginBottom:24}}>Your preferences</h2>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,color:COLORS.muted,marginBottom:10}}>OPPORTUNITY TYPE</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Internship","Full-time","Part-time","Freelance"].map(t=>(
            <Pill key={t} label={t} active={prefs.type.includes(t)} onClick={()=>setPrefs(p=>({...p,type:p.type.includes(t)?p.type.filter(x=>x!==t):[...p.type,t]}))}/>
          ))}
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,color:COLORS.muted,marginBottom:10}}>WORK MODE</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Remote","Hybrid","On-site"].map(t=>(
            <Pill key={t} label={t} active={prefs.mode.includes(t)} onClick={()=>setPrefs(p=>({...p,mode:p.mode.includes(t)?p.mode.filter(x=>x!==t):[...p.mode,t]}))}/>
          ))}
        </div>
      </div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:13,color:COLORS.muted,marginBottom:10}}>FIELD / DOMAIN</div>
        <input value={prefs.field} onChange={e=>setPrefs(p=>({...p,field:e.target.value}))} placeholder="e.g. Machine Learning, Web Dev, Data Science…" style={{width:"100%",padding:"12px 14px",borderRadius:12,fontSize:14}}/>
      </div>
      <button className="btn-primary" onClick={()=>setStep(3)} style={{padding:"15px",borderRadius:14,fontSize:15,width:"100%"}}>Continue →</button>
    </div>,

    // All set
    <div className="fade-up" style={{textAlign:"center",padding:"60px 32px"}}>
      <div style={{fontSize:56,marginBottom:16}}>🚀</div>
      <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,marginBottom:12}}>You're all set!</h2>
      <p style={{color:COLORS.muted,fontSize:15,lineHeight:1.7,marginBottom:16}}>We're scanning 200+ job boards and checking reputations on Reddit, Twitter, and Glassdoor.</p>
      <div style={{background:COLORS.card,borderRadius:14,padding:"16px",marginBottom:32,textAlign:"left"}}>
        {["Scanning LinkedIn, Indeed, Rozee.pk…","Checking company reputations…","Scoring growth opportunities…","Tailoring matches to your skills…"].map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${COLORS.border}`:"none"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:COLORS.green,animation:"pulse 1.5s ease-in-out infinite",animationDelay:`${i*0.3}s`}}/>
            <span style={{fontSize:13,color:COLORS.muted}}>{t}</span>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={onDone} style={{padding:"16px 40px",borderRadius:14,fontSize:16}}>View My Jobs →</button>
    </div>,
  ];

  return (
    <div style={{minHeight:"100vh",background:COLORS.bg,display:"flex",flexDirection:"column",justifyContent:"center"}}>
      {screens[step]}
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

const Dashboard = ({ onJobSelect }) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [repFilter, setRepFilter] = useState(false);

  const filtered = JOBS.filter(j => {
    if (filter!=="All" && !j.type.includes(filter) && !j.location.includes(filter)) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (repFilter && j.repScore < 80) return false;
    return true;
  });

  return (
    <div style={{padding:"20px 16px 100px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <div style={{fontSize:13,color:COLORS.muted}}>Hello, Muhammad 👋</div>
          <h1 style={{fontFamily:"Syne",fontSize:24,fontWeight:800}}>Find Your Dream Job</h1>
        </div>
        <div style={{width:40,height:40,borderRadius:"50%",background:COLORS.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700}}>M</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
        {[["84","Matched",COLORS.accent],["12","Applied",COLORS.gold],["3","Interviews",COLORS.green]].map(([n,l,c])=>(
          <div key={l} style={{background:COLORS.card,borderRadius:14,padding:"14px 12px",border:`1px solid ${COLORS.border}`,textAlign:"center"}}>
            <div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:c}}>{n}</div>
            <div style={{fontSize:11,color:COLORS.muted}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:14}}>
        <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)"}}>
          <Icon n="search" size={16} color={COLORS.muted}/>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies…" style={{width:"100%",padding:"12px 14px 12px 42px",borderRadius:12,fontSize:14}}/>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:12,scrollbarWidth:"none"}}>
        {["All","Remote","Hybrid","On-site"].map(f=>(
          <Pill key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>
        ))}
        <Pill label="✓ Clean reputation" active={repFilter} onClick={()=>setRepFilter(v=>!v)}/>
      </div>

      {/* Job Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map((job,i) => (
          <div key={job.id} className="card-hover fade-up" onClick={()=>onJobSelect(job)} style={{background:COLORS.card,borderRadius:16,padding:"16px",border:`1px solid ${COLORS.border}`,animationDelay:`${i*0.05}s`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:12,background:COLORS.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`1px solid ${COLORS.border}`}}>{job.logo}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15,marginBottom:2}}>{job.title}</div>
                  <div style={{fontSize:13,color:COLORS.muted}}>{job.company} · {job.posted}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,color:COLORS.accent}}>{job.match}%</div>
                <div style={{fontSize:10,color:COLORS.muted}}>match</div>
              </div>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {job.tags.map(t=>(
                <span key={t} className="tag" style={{background:COLORS.surface,color:COLORS.muted,border:`1px solid ${COLORS.border}`}}>{t}</span>
              ))}
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Badge type={job.repBadge}/>
                <span style={{fontSize:12,color:COLORS.muted}}>{job.location}</span>
              </div>
              <span style={{fontSize:13,color:COLORS.gold,fontWeight:600}}>{job.salary}</span>
            </div>

            {job.flags?.length > 0 && (
              <div style={{marginTop:10,padding:"8px 10px",background:COLORS.redSoft,borderRadius:8,border:`1px solid ${COLORS.red}30`,fontSize:12,color:COLORS.red,display:"flex",gap:6,alignItems:"center"}}>
                <Icon n="flag" size={12} color={COLORS.red}/> {job.flags[0]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── JOB DETAIL ──────────────────────────────────────────────────────────────

const JobDetail = ({ job, onBack, onApply, onSchedule }) => {
  const [tab, setTab] = useState("overview");
  const [jdPasted, setJdPasted] = useState(job.jd || "");
  const [applied, setApplied] = useState(false);

  return (
    <div style={{padding:"16px 16px 100px"}}>
      {/* Back */}
      <button onClick={onBack} style={{display:"flex",gap:8,alignItems:"center",background:"none",border:"none",color:COLORS.muted,cursor:"pointer",fontSize:14,marginBottom:20,padding:0}}>
        <Icon n="arrow" size={16} color={COLORS.muted}/> Back
      </button>

      {/* Header */}
      <div style={{background:COLORS.card,borderRadius:16,padding:"20px",border:`1px solid ${COLORS.border}`,marginBottom:16}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:COLORS.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`1px solid ${COLORS.border}`}}>{job.logo}</div>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"Syne",fontSize:20,fontWeight:700,marginBottom:2}}>{job.title}</h2>
            <div style={{fontSize:14,color:COLORS.muted}}>{job.company} · {job.location}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <ScoreRing value={job.match} label="Match" color={COLORS.accent}/>
          <ScoreRing value={job.repScore} label="Reputation" color={COLORS.green}/>
          <ScoreRing value={job.growthScore} label="Growth" color={COLORS.gold}/>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["overview","reputation","growth","apply"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px 4px",borderRadius:10,border:`1px solid ${tab===t?COLORS.accent:COLORS.border}`,background:tab===t?COLORS.accentSoft:"transparent",color:tab===t?COLORS.accent:COLORS.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:tab===t?600:400,textTransform:"capitalize"}}>
            {t}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <div className="fade-up">
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:12}}>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>Job Description</div>
            <p style={{fontSize:14,lineHeight:1.7,color:COLORS.text}}>{job.jd}</p>
          </div>
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:12}}>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>Job Details</div>
            {[["Industry",job.industry],["Company size",job.size],["Funding",job.funding],["Type",job.type],["Salary",job.salary]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                <span style={{fontSize:13,color:COLORS.muted}}>{k}</span>
                <span style={{fontSize:13,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={onSchedule} className="btn-secondary" style={{flex:1,padding:"14px",borderRadius:14,fontSize:14}}>Schedule Interview</button>
            <button onClick={()=>{setApplied(true);onApply(job);}} className="btn-primary" disabled={applied} style={{flex:2,padding:"14px",borderRadius:14,fontSize:14,opacity:applied?0.6:1}}>
              {applied?"✓ Applied!":"Apply Now →"}
            </button>
          </div>
        </div>
      )}

      {tab==="reputation" && (
        <div className="fade-up">
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:13,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.5px"}}>Reputation Score</div>
              <Badge type={job.repBadge}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{fontFamily:"Syne",fontSize:48,fontWeight:800,color:job.repScore>=80?COLORS.green:job.repScore>=60?COLORS.gold:COLORS.red}}>{job.repScore}</div>
              <div style={{fontSize:13,color:COLORS.muted,lineHeight:1.6}}>Based on 2,400+ mentions across Reddit, Twitter, and Glassdoor</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[["Reddit",job.repScore-5,COLORS.accent],["Glassdoor",job.repScore+3,COLORS.green],["Twitter/X",job.repScore-8,COLORS.gold]].map(([src,score,color])=>(
                <div key={src}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:COLORS.muted}}>{src}</span>
                    <span style={{fontSize:12,fontWeight:600,color}}>{Math.min(100,Math.max(0,score))}/100</span>
                  </div>
                  <div style={{height:6,background:COLORS.surface,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(100,Math.max(0,score))}%`,background:color,borderRadius:3,transition:"width 1s ease"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`}}>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>Community Signals</div>
            <RepFlag flags={job.flags}/>
            {!job.flags?.length && (
              <p style={{fontSize:13,color:COLORS.muted,lineHeight:1.7,marginTop:8}}>No concerning mentions detected. Employees report good work culture and on-time salary payments.</p>
            )}
          </div>
        </div>
      )}

      {tab==="growth" && (
        <div className="fade-up">
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{fontFamily:"Syne",fontSize:48,fontWeight:800,color:COLORS.gold}}>{job.growthScore}</div>
              <div>
                <div style={{fontWeight:600,marginBottom:2}}>Growth Score</div>
                <div style={{fontSize:13,color:COLORS.muted}}>Based on company trajectory & alumni paths</div>
              </div>
            </div>
            {[["Company funding stage",job.funding,COLORS.accent],["Industry momentum","High demand",COLORS.green],["Alumni career growth","Avg +3 promotions/5yr",COLORS.gold],["Company headcount growth","+22% YoY",COLORS.green]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                <span style={{fontSize:13,color:COLORS.muted}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600,color:c}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`}}>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>About Company</div>
            <p style={{fontSize:14,lineHeight:1.7,color:COLORS.text}}>{job.desc}</p>
          </div>
        </div>
      )}

      {tab==="apply" && (
        <div className="fade-up">
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:12}}>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>Paste Job Description (optional)</div>
            <textarea value={jdPasted} onChange={e=>setJdPasted(e.target.value)} rows={5} placeholder="Paste the full job description here for a more tailored application…" style={{width:"100%",borderRadius:10,padding:"12px",fontSize:13,lineHeight:1.6,resize:"vertical"}}/>
          </div>
          <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:12}}>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>AI-Generated Cover Letter</div>
            <div style={{background:COLORS.surface,borderRadius:10,padding:"14px",fontSize:13,lineHeight:1.8,color:COLORS.text,borderLeft:`3px solid ${COLORS.accent}`}}>
              Dear Hiring Manager,<br/><br/>
              I am excited to apply for the <strong>{job.title}</strong> position at <strong>{job.company}</strong>. As a Computer Science student at Bahria University with hands-on experience in Python, Machine Learning, and full-stack development, I am confident in my ability to contribute meaningfully to your team.<br/><br/>
              My project MindSpace — an AI mental health companion using BERT and RAG — demonstrates my ability to build production-grade ML pipelines, which aligns directly with this role's requirements…
            </div>
          </div>
          <button onClick={()=>{setApplied(true);onApply(job);}} className="btn-primary" disabled={applied} style={{width:"100%",padding:"16px",borderRadius:14,fontSize:15,opacity:applied?0.6:1}}>
            {applied?"✅ Application Submitted!":"Submit Application →"}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── TRACKER ─────────────────────────────────────────────────────────────────

const Tracker = () => {
  const stages = ["Applied","Screening","Interview","Offer","Rejected"];
  return (
    <div style={{padding:"20px 16px 100px"}}>
      <h1 style={{fontFamily:"Syne",fontSize:24,fontWeight:800,marginBottom:4}}>Applications</h1>
      <p style={{color:COLORS.muted,fontSize:14,marginBottom:20}}>Track every application in real time.</p>

      {/* Pipeline view */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20,scrollbarWidth:"none"}}>
        {stages.map(s=>{
          const count = TRACKER.filter(t=>t.status===s).length;
          return (
            <div key={s} style={{minWidth:80,background:COLORS.card,borderRadius:12,padding:"10px 8px",border:`1px solid ${COLORS.border}`,textAlign:"center",flexShrink:0}}>
              <div style={{fontFamily:"Syne",fontSize:18,fontWeight:700,color:s==="Rejected"?COLORS.red:s==="Offer"?COLORS.green:COLORS.accent}}>{count}</div>
              <div style={{fontSize:10,color:COLORS.muted,marginTop:2}}>{s}</div>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {TRACKER.map((t,i)=>(
          <div key={t.id} className="fade-up card-hover" style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",animationDelay:`${i*0.07}s`}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:t.color,flexShrink:0}}/>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{t.job}</div>
                <div style={{fontSize:12,color:COLORS.muted}}>{t.company} · {t.date}</div>
              </div>
            </div>
            <span className="tag" style={{background:`${t.color}20`,color:t.color,border:`1px solid ${t.color}40`}}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SCHEDULER + ROADMAP ─────────────────────────────────────────────────────

const Scheduler = () => {
  const [interview, setInterview] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const upcoming = [{ company:"Arbisoft", role:"ML Engineer Intern", date:"Jun 5, 2026", time:"11:00 AM PKT", type:"Technical", logo:"🤖", days:7 }];

  if (showRoadmap && interview) {
    const topics = ROADMAP_TOPICS["ML Engineer Intern"] || [];
    return (
      <div style={{padding:"20px 16px 100px"}}>
        <button onClick={()=>setShowRoadmap(false)} style={{display:"flex",gap:8,alignItems:"center",background:"none",border:"none",color:COLORS.muted,cursor:"pointer",fontSize:14,marginBottom:20,padding:0}}>
          <Icon n="arrow" size={16} color={COLORS.muted}/> Back to Interviews
        </button>
        <h2 style={{fontFamily:"Syne",fontSize:22,fontWeight:800,marginBottom:4}}>Interview Roadmap</h2>
        <p style={{color:COLORS.muted,fontSize:14,marginBottom:20}}>Arbisoft ML Intern · {interview.days} days remaining</p>

        <div style={{background:COLORS.card,borderRadius:14,padding:"14px",border:`1px solid ${COLORS.border}`,marginBottom:16}}>
          <div style={{display:"flex",gap:12,justifyContent:"space-around"}}>
            {[["8","Topics"],["5","Days"],["3","Mock Q&A"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"Syne",fontSize:24,fontWeight:800,color:COLORS.accent}}>{n}</div>
                <div style={{fontSize:11,color:COLORS.muted}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {topics.map((t,i)=>(
            <div key={i} className="fade-up" style={{background:COLORS.card,borderRadius:14,padding:"14px 16px",border:`1px solid ${t.done?COLORS.green:COLORS.border}`,animationDelay:`${i*0.06}s`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <span style={{fontSize:11,color:COLORS.muted}}>{t.day} · </span>
                  <span style={{fontSize:14,fontWeight:600}}>{t.topic}</span>
                </div>
                {t.done && <Icon n="check" size={16} color={COLORS.green}/>}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {t.subtopics.map(s=>(
                  <span key={s} className="tag" style={{background:COLORS.surface,color:COLORS.muted,border:`1px solid ${COLORS.border}`}}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:"20px 16px 100px"}}>
      <h1 style={{fontFamily:"Syne",fontSize:24,fontWeight:800,marginBottom:4}}>Interviews</h1>
      <p style={{color:COLORS.muted,fontSize:14,marginBottom:20}}>Scheduled sessions & prep roadmaps.</p>

      {upcoming.map((iv,i)=>(
        <div key={i} style={{background:COLORS.card,borderRadius:16,padding:"18px",border:`1px solid ${COLORS.border}`,marginBottom:14}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:COLORS.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{iv.logo}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:15}}>{iv.role}</div>
              <div style={{fontSize:13,color:COLORS.muted}}>{iv.company}</div>
            </div>
            <span className="tag" style={{background:COLORS.goldSoft,color:COLORS.gold,border:`1px solid ${COLORS.gold}40`}}>{iv.days}d</span>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1,background:COLORS.surface,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:COLORS.muted,marginBottom:2}}>DATE</div>
              <div style={{fontSize:13,fontWeight:600}}>{iv.date}</div>
            </div>
            <div style={{flex:1,background:COLORS.surface,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:COLORS.muted,marginBottom:2}}>TIME</div>
              <div style={{fontSize:13,fontWeight:600}}>{iv.time}</div>
            </div>
            <div style={{flex:1,background:COLORS.surface,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:COLORS.muted,marginBottom:2}}>TYPE</div>
              <div style={{fontSize:13,fontWeight:600}}>{iv.type}</div>
            </div>
          </div>
          <button onClick={()=>{setInterview(iv);setShowRoadmap(true);}} className="btn-primary" style={{width:"100%",padding:"13px",borderRadius:12,fontSize:14}}>
            📋 View Prep Roadmap →
          </button>
        </div>
      ))}

      <div style={{background:COLORS.card,borderRadius:14,padding:"18px",border:`2px dashed ${COLORS.border}`,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>📅</div>
        <div style={{fontWeight:600,marginBottom:4}}>Schedule an Interview</div>
        <div style={{fontSize:13,color:COLORS.muted,marginBottom:14}}>Applied to a job? Set your interview date and get an AI-generated roadmap instantly.</div>
        <button className="btn-secondary" style={{padding:"12px 24px",borderRadius:12,fontSize:14,width:"100%"}}>+ Add Interview</button>
      </div>
    </div>
  );
};

// ─── AI MOCK INTERVIEW ────────────────────────────────────────────────────────

const MockInterview = () => {
  const [mode, setMode] = useState("idle"); // idle | setup | live | feedback
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("ML Engineer Intern at Arbisoft");
  const [jd, setJd] = useState("");
  const bottomRef = useRef();

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages, loading]);

  const startInterview = async () => {
    setMode("live");
    setLoading(true);
    const sysPrompt = `You are an expert technical interviewer at a top tech company. You are conducting a mock interview for the role: "${role}". ${jd ? `Job Description: ${jd}` : ""}\n\nConduct a realistic interview:\n1. Start with a warm welcome and one behavioral question\n2. Follow with technical questions relevant to the role\n3. After each answer, give a brief tip or follow-up\n4. Keep responses concise (2-4 sentences max per turn)\n5. Be encouraging but realistic\n\nBegin the interview now with your opening question.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400, system:sysPrompt, messages:[{role:"user",content:"Start the interview."}] })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("");
      setMessages([{role:"interviewer",text}]);
    } catch(e) {
      setMessages([{role:"interviewer",text:"Welcome! I'm your AI interviewer today. Let's start with a quick intro — tell me about yourself and what excites you about the ML space."}]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, {role:"candidate",text:userMsg}];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.map(m=>({role: m.role==="candidate"?"user":"assistant", content:m.text}));
    const sysPrompt = `You are an expert technical interviewer. Role being interviewed for: "${role}". Continue the mock interview. Ask the next question or give a brief tip on their answer (1-2 sentences), then ask a follow-up or new question. Keep it concise and realistic.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:350, system:sysPrompt, messages:history })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("") || "Good answer! Let's move on to a technical question.";
      setMessages([...newMessages,{role:"interviewer",text}]);
    } catch(e) {
      setMessages([...newMessages,{role:"interviewer",text:"Good answer! Let's move on. Can you walk me through how you'd design a recommendation system for a job platform?"}]);
    }
    setLoading(false);
  };

  const endInterview = () => {
    setMode("feedback");
  };

  if (mode==="idle") return (
    <div style={{padding:"20px 16px 100px"}}>
      <h1 style={{fontFamily:"Syne",fontSize:24,fontWeight:800,marginBottom:4}}>AI Interview Prep</h1>
      <p style={{color:COLORS.muted,fontSize:14,marginBottom:24}}>Practice with a real-time AI interviewer and get instant feedback.</p>

      <div style={{background:COLORS.card,borderRadius:16,padding:"20px",border:`1px solid ${COLORS.border}`,marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:12}}>🤖</div>
        <h3 style={{fontFamily:"Syne",fontSize:18,fontWeight:700,marginBottom:8}}>Live Mock Interview</h3>
        <p style={{fontSize:13,color:COLORS.muted,lineHeight:1.7,marginBottom:20}}>Powered by Claude AI. Simulates a real technical interview with dynamic follow-up questions and immediate feedback after each answer.</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["🎯","Role-specific questions","Tailored to your target job"],["⚡","Real-time feedback","Instant tips after every answer"],["📊","Performance report","Summary after the session"]].map(([ic,t,d])=>(
            <div key={t} style={{display:"flex",gap:12,alignItems:"center",textAlign:"left",padding:"10px 12px",background:COLORS.surface,borderRadius:10}}>
              <span style={{fontSize:20}}>{ic}</span>
              <div><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:12,color:COLORS.muted}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn-primary" onClick={()=>setMode("setup")} style={{width:"100%",padding:"16px",borderRadius:14,fontSize:16}}>Start Mock Interview →</button>
    </div>
  );

  if (mode==="setup") return (
    <div style={{padding:"20px 16px 100px"}} className="fade-up">
      <button onClick={()=>setMode("idle")} style={{display:"flex",gap:8,alignItems:"center",background:"none",border:"none",color:COLORS.muted,cursor:"pointer",fontSize:14,marginBottom:20,padding:0}}>
        <Icon n="arrow" size={16} color={COLORS.muted}/> Back
      </button>
      <h2 style={{fontFamily:"Syne",fontSize:22,fontWeight:800,marginBottom:20}}>Set up your interview</h2>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:13,color:COLORS.muted,display:"block",marginBottom:8}}>TARGET ROLE</label>
        <input value={role} onChange={e=>setRole(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,fontSize:14}}/>
      </div>
      <div style={{marginBottom:24}}>
        <label style={{fontSize:13,color:COLORS.muted,display:"block",marginBottom:8}}>JOB DESCRIPTION (optional — improves relevance)</label>
        <textarea value={jd} onChange={e=>setJd(e.target.value)} rows={5} placeholder="Paste the job description here…" style={{width:"100%",padding:"12px 14px",borderRadius:12,fontSize:14,resize:"vertical",lineHeight:1.6}}/>
      </div>
      <button className="btn-primary" onClick={startInterview} style={{width:"100%",padding:"16px",borderRadius:14,fontSize:16}}>Begin Interview →</button>
    </div>
  );

  if (mode==="feedback") return (
    <div style={{padding:"20px 16px 100px"}} className="fade-up">
      <h2 style={{fontFamily:"Syne",fontSize:24,fontWeight:800,marginBottom:4}}>Session Complete 🎉</h2>
      <p style={{color:COLORS.muted,fontSize:14,marginBottom:20}}>Here's your performance summary.</p>
      <div style={{background:COLORS.card,borderRadius:16,padding:"20px",border:`1px solid ${COLORS.border}`,marginBottom:14}}>
        <div style={{display:"flex",gap:16,justifyContent:"space-around",marginBottom:16}}>
          <ScoreRing value={78} label="Communication" color={COLORS.accent}/>
          <ScoreRing value={82} label="Technical" color={COLORS.green}/>
          <ScoreRing value={74} label="Structure" color={COLORS.gold}/>
        </div>
        <div style={{fontSize:14,color:COLORS.muted,lineHeight:1.7}}>
          Strong technical answers with good depth. Work on structuring responses using the STAR method for behavioral questions. Your ML knowledge is solid — focus on system design next time.
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button className="btn-secondary" onClick={()=>{setMessages([]);setMode("idle");}} style={{flex:1,padding:"14px",borderRadius:14,fontSize:14}}>Retry</button>
        <button className="btn-primary" onClick={()=>{setMessages([]);setMode("setup");}} style={{flex:1,padding:"14px",borderRadius:14,fontSize:14}}>New Role →</button>
      </div>
    </div>
  );

  // Live interview chat
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:COLORS.bg}}>
      {/* Header */}
      <div style={{padding:"16px",background:COLORS.surface,borderBottom:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{fontFamily:"Syne",fontSize:16,fontWeight:700}}>Mock Interview</div>
          <div style={{fontSize:12,color:COLORS.muted}}>{role}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:COLORS.green,animation:"pulse 1.5s ease-in-out infinite",alignSelf:"center"}}/>
          <span style={{fontSize:12,color:COLORS.green}}>Live</span>
          <button onClick={endInterview} className="btn-secondary" style={{padding:"6px 12px",borderRadius:8,fontSize:12,marginLeft:8}}>End</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        {messages.map((m,i)=>(
          <div key={i} className="fade-up" style={{display:"flex",gap:10,flexDirection:m.role==="candidate"?"row-reverse":"row",animationDelay:`${i*0.05}s`}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:m.role==="interviewer"?COLORS.accent:COLORS.subtle,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
              {m.role==="interviewer"?"🤖":"M"}
            </div>
            <div style={{maxWidth:"80%",background:m.role==="candidate"?COLORS.accentSoft:COLORS.card,borderRadius:14,borderTopLeftRadius:m.role==="interviewer"?4:14,borderTopRightRadius:m.role==="candidate"?4:14,padding:"12px 14px",border:`1px solid ${m.role==="candidate"?COLORS.accent+"30":COLORS.border}`}}>
              <div style={{fontSize:10,color:COLORS.muted,marginBottom:6}}>{m.role==="interviewer"?"AI Interviewer":"You"}</div>
              <p style={{fontSize:14,lineHeight:1.7}}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:COLORS.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{background:COLORS.card,borderRadius:14,borderTopLeftRadius:4,padding:"12px 16px",border:`1px solid ${COLORS.border}`}}>
              <div style={{display:"flex",gap:4}}>
                {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:COLORS.muted,animation:"pulse 1s ease-in-out infinite",animationDelay:`${i*0.2}s`}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px 24px",background:COLORS.surface,borderTop:`1px solid ${COLORS.border}`,flexShrink:0}}>
        <div style={{display:"flex",gap:10}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Type your answer…" style={{flex:1,padding:"12px 14px",borderRadius:12,fontSize:14}}/>
          <button onClick={sendMessage} disabled={loading||!input.trim()} className="btn-primary" style={{padding:"12px 16px",borderRadius:12,opacity:loading||!input.trim()?0.5:1}}>
            <Icon n="send" size={18} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PROFILE ─────────────────────────────────────────────────────────────────

const Profile = () => (
  <div style={{padding:"20px 16px 100px"}}>
    <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:24}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:COLORS.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800}}>M</div>
      <div>
        <h2 style={{fontFamily:"Syne",fontSize:20,fontWeight:800}}>Muhammad Mujtaba</h2>
        <div style={{fontSize:13,color:COLORS.muted}}>BS IT · Bahria University · Karachi</div>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
      {[["94%","Best match",COLORS.accent],["12","Applied",COLORS.gold],["3","Interviews",COLORS.green],["88","Avg rep score",COLORS.gold]].map(([n,l,c])=>(
        <div key={l} style={{background:COLORS.card,borderRadius:14,padding:"14px",border:`1px solid ${COLORS.border}`,textAlign:"center"}}>
          <div style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:c}}>{n}</div>
          <div style={{fontSize:12,color:COLORS.muted}}>{l}</div>
        </div>
      ))}
    </div>

    <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`,marginBottom:14}}>
      <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>Skills Detected</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["Python","React","ML/NLP","Flask","SQL","Node.js","Git","PyTorch","BERT"].map(s=>(
          <span key={s} className="tag" style={{background:COLORS.accentSoft,color:COLORS.accent,border:`1px solid ${COLORS.accent}30`}}>{s}</span>
        ))}
      </div>
    </div>

    <div style={{background:COLORS.card,borderRadius:14,padding:"16px",border:`1px solid ${COLORS.border}`}}>
      <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>Resume</div>
      <div style={{display:"flex",gap:12,alignItems:"center",padding:"12px",background:COLORS.surface,borderRadius:10}}>
        <div style={{fontSize:24}}>📄</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600}}>Muhammad_Mujtaba_Motiwala_2026.pdf</div>
          <div style={{fontSize:12,color:COLORS.muted}}>Uploaded · 119KB</div>
        </div>
        <button className="btn-secondary" style={{padding:"6px 12px",borderRadius:8,fontSize:12}}>Update</button>
      </div>
    </div>
  </div>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState(null);
  const [, setAppliedJobs] = useState([]);

  const handleApply = (job) => setAppliedJobs(p=>[...p,job.id]);
  const handleSchedule = () => setPage("scheduler");

  if (!onboarded) return (
    <>
      <style>{fonts}</style>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <Onboarding onDone={()=>setOnboarded(true)}/>
      </div>
    </>
  );

  const renderPage = () => {
    if (page==="interview") return <MockInterview/>;
    if (selectedJob) return <JobDetail job={selectedJob} onBack={()=>setSelectedJob(null)} onApply={handleApply} onSchedule={handleSchedule}/>;
    switch(page) {
      case "dashboard": return <Dashboard onJobSelect={setSelectedJob}/>;
      case "tracker": return <Tracker/>;
      case "scheduler": return <Scheduler/>;
      case "profile": return <Profile/>;
      default: return <Dashboard onJobSelect={setSelectedJob}/>;
    }
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",position:"relative"}}>
        {renderPage()}
        {page!=="interview" && <Nav page={selectedJob?"dashboard":page} setPage={(p)=>{setSelectedJob(null);setPage(p);}}/>}
      </div>
    </>
  );
}
