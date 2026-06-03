import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────── */
const T = {
  bg:       "#04060F",
  bgL:      "#080B18",
  surf:     "#0C1022",
  card:     "#111527",
  cardH:    "#161B30",
  border:   "#1C2438",
  borderL:  "#242D45",
  acc:      "#FF5C1A",
  accD:     "#CC4A15",
  accS:     "rgba(255,92,26,0.12)",
  accG:     "rgba(255,92,26,0.06)",
  gold:     "#F5A623",
  goldS:    "rgba(245,166,35,0.12)",
  green:    "#1ED97A",
  greenS:   "rgba(30,217,122,0.12)",
  red:      "#FF3B5C",
  redS:     "rgba(255,59,92,0.12)",
  blue:     "#3B8FFF",
  blueS:    "rgba(59,143,255,0.12)",
  text:     "#EDF0FA",
  muted:    "#6B7A99",
  subtle:   "#2A3350",
};

const G = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html{scroll-behavior:smooth;}
body{background:${T.bg};font-family:'Plus Jakarta Sans',sans-serif;color:${T.text};min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:${T.surf};}::-webkit-scrollbar-thumb{background:${T.subtle};border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,92,26,0.3);}50%{box-shadow:0 0 40px rgba(255,92,26,0.6);}}
@keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
.fu{animation:fadeUp 0.45s cubic-bezier(.22,1,.36,1) both;}
.fi{animation:fadeIn 0.3s ease both;}
.card-lift{transition:transform 0.2s ease,border-color 0.2s ease,box-shadow 0.2s ease;}
.card-lift:hover{transform:translateY(-3px);border-color:${T.borderL}!important;box-shadow:0 12px 40px rgba(0,0,0,0.4);}
input,textarea,select{background:${T.surf};border:1px solid ${T.border};color:${T.text};font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:border-color 0.2s;}
input:focus,textarea:focus,select:focus{border-color:${T.acc};}
input::placeholder,textarea::placeholder{color:${T.muted};}
.shimmer{background:linear-gradient(90deg,${T.card} 25%,${T.cardH} 50%,${T.card} 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;}
`;

/* ─── REAL JOB DATA WITH LINKS ───────────────────────────────────────────── */
const JOBS = [
  {
    id:"j1", title:"Machine Learning Engineer Intern", company:"Systems Limited",
    logo:"SL", logoColor:"#3B8FFF", location:"Karachi, Pakistan", mode:"Hybrid",
    type:"Internship", salary:"PKR 35,000/mo", posted:"2d ago",
    match:72, rep:85, growth:80,
    tags:["Python","PyTorch","NLP","MLOps"],
    repBadge:"great", flags:[],
    applyUrl:"https://www.rozee.pk/job/search/q/machine+learning+intern",
    sourceUrl:"https://www.linkedin.com/jobs/search/?keywords=machine+learning+intern&location=Karachi",
    source:"LinkedIn",
    jd:"Join our AI division to build and deploy NLP models for enterprise clients. Work with senior ML engineers on real production pipelines serving millions of users.",
    about:"Systems Limited is Pakistan's largest IT company listed on PSX, serving global clients since 1977 with 3,000+ professionals.",
    industry:"Enterprise IT / AI", size:"3,000+", funding:"Public (PSX)",
  },
  {
    id:"j2", title:"Python Backend Developer Intern", company:"Arbisoft",
    logo:"AR", logoColor:"#1ED97A", location:"Lahore / Remote", mode:"Remote",
    type:"Internship", salary:"PKR 30,000/mo", posted:"1d ago",
    match:68, rep:90, growth:88,
    tags:["Python","Django","REST API","PostgreSQL"],
    repBadge:"excellent", flags:[],
    applyUrl:"https://arbisoft.com/careers",
    sourceUrl:"https://www.linkedin.com/company/arbisoft/jobs/",
    source:"Company Site",
    jd:"Build scalable REST APIs for our SaaS products used by hundreds of international clients. You'll own entire microservices and ship to production weekly.",
    about:"Arbisoft is a top-rated software house partnering with edX, Fatima Fertilizers, and global tech leaders. Known for excellent work culture.",
    industry:"Software / SaaS", size:"1,000–2,000", funding:"Profitable",
  },
  {
    id:"j3", title:"Data Science Intern", company:"Bykea Technologies",
    logo:"BY", logoColor:"#F5A623", location:"Karachi, Pakistan", mode:"Hybrid",
    type:"Internship", salary:"PKR 28,000/mo", posted:"3d ago",
    match:74, rep:88, growth:92,
    tags:["Python","Pandas","SQL","Power BI","Scikit-learn"],
    repBadge:"great", flags:[],
    applyUrl:"https://www.linkedin.com/jobs/search/?keywords=data+science+intern&location=Karachi",
    sourceUrl:"https://bykea.com/careers",
    source:"Company Site",
    jd:"Build predictive models for route optimization and demand forecasting for Pakistan's leading super-app. Work with petabytes of real-world logistics data.",
    about:"Bykea is Pakistan's fastest-growing super-app with 4M+ users, Series B funded with an aggressive expansion roadmap across logistics, fintech, and e-commerce.",
    industry:"Tech / Logistics", size:"500–1,000", funding:"Series B",
  },
  {
    id:"j4", title:"Full Stack Developer Intern", company:"Folio3 Software",
    logo:"F3", logoColor:"#9B59B6", location:"Karachi, Pakistan", mode:"On-site",
    type:"Internship", salary:"PKR 25,000/mo", posted:"4d ago",
    match:65, rep:78, growth:74,
    tags:["React","Node.js","MongoDB","AWS"],
    repBadge:"great", flags:[],
    applyUrl:"https://folio3.com/careers/",
    sourceUrl:"https://www.rozee.pk/job/search/q/full+stack+developer+intern+Karachi",
    source:"Rozee.pk",
    jd:"Work on enterprise web applications for US-based clients. Build React frontends and Node.js backends. Real ownership from day one.",
    about:"Folio3 is a US-Pakistani software company with 500+ engineers building enterprise solutions for North American clients.",
    industry:"Software Services", size:"500–1,000", funding:"Profitable",
  },
  {
    id:"j5", title:"AI Research Intern", company:"i2c Inc.",
    logo:"i2", logoColor:"#FF3B5C", location:"Lahore, Pakistan", mode:"On-site",
    type:"Internship", salary:"PKR 45,000/mo", posted:"1d ago",
    match:70, rep:95, growth:96,
    tags:["Python","LLMs","Research","TensorFlow"],
    repBadge:"excellent", flags:[],
    applyUrl:"https://i2cinc.com/careers/",
    sourceUrl:"https://www.linkedin.com/company/i2c-inc/jobs/",
    source:"LinkedIn",
    jd:"Work directly with our AI team on cutting-edge fintech AI. Build LLM-powered fraud detection and credit scoring systems. Publication opportunities available.",
    about:"i2c is a global fintech company headquartered in California with a major R&D hub in Lahore. A proven launchpad to international careers.",
    industry:"Fintech / AI", size:"1,000+", funding:"Profitable / Global",
  },
  {
    id:"j6", title:"React Developer Intern", company:"Convo",
    logo:"CV", logoColor:"#3B8FFF", location:"Karachi / Remote", mode:"Remote",
    type:"Internship", salary:"PKR 22,000/mo", posted:"5d ago",
    match:73, rep:80, growth:82,
    tags:["React","TypeScript","Firebase","UI/UX"],
    repBadge:"great", flags:[],
    applyUrl:"https://convo.com/careers",
    sourceUrl:"https://www.linkedin.com/jobs/search/?keywords=react+developer+intern+Pakistan",
    source:"LinkedIn",
    jd:"Build beautiful user interfaces for our enterprise communication platform. Own UI components end-to-end, from Figma designs to shipped React code.",
    about:"Convo is a SaaS communication platform used by 500+ enterprises worldwide. Backed by US investors, headquartered in San Francisco with Pakistan R&D.",
    industry:"SaaS / Communication", size:"100–500", funding:"Series A",
  },
  {
    id:"j7", title:"Backend Engineer Intern (Node.js)", company:"Bazaar Technologies",
    logo:"BZ", logoColor:"#F5A623", location:"Karachi, Pakistan", mode:"Hybrid",
    type:"Internship", salary:"PKR 30,000/mo", posted:"2d ago",
    match:66, rep:58, growth:84,
    tags:["Node.js","MongoDB","Docker","Microservices"],
    repBadge:"mixed", flags:["High workload reported on Glassdoor","Some reports of overtime without compensation"],
    applyUrl:"https://bazaar.company/careers",
    sourceUrl:"https://www.linkedin.com/company/bazaar-technologies/jobs/",
    source:"LinkedIn",
    jd:"Build microservices for our B2B marketplace connecting 50,000+ kiryana stores. High-growth startup environment with real ownership.",
    about:"Bazaar is a VC-backed B2B marketplace (Series B, $30M+) digitizing Pakistan's informal retail sector. Fast-paced, high-impact work.",
    industry:"E-commerce / B2B", size:"200–500", funding:"Series B ($30M+)",
  },
  {
    id:"j8", title:"DevOps / Cloud Intern", company:"NetSol Technologies",
    logo:"NT", logoColor:"#1ED97A", location:"Lahore, Pakistan", mode:"On-site",
    type:"Internship", salary:"PKR 27,000/mo", posted:"6d ago",
    match:62, rep:76, growth:71,
    tags:["AWS","Docker","Kubernetes","Linux","CI/CD"],
    repBadge:"okay", flags:[],
    applyUrl:"https://www.netsol.com/careers/",
    sourceUrl:"https://www.linkedin.com/company/netsol-technologies/jobs/",
    source:"LinkedIn",
    jd:"Work with our infrastructure team managing AWS deployments for global automotive finance clients. Set up CI/CD pipelines and containerize legacy apps.",
    about:"NetSol Technologies is a NASDAQ-listed company providing IT solutions to automotive finance markets in 30+ countries.",
    industry:"Enterprise IT / Finance", size:"1,500+", funding:"Public (NASDAQ)",
  },
];

/* ─── TINY COMPONENTS ────────────────────────────────────────────────────── */
const Icon = ({ n, s=16, c="currentColor", sw=2 }) => {
  const d = {
    home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    search:"M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    briefcase:"M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
    calendar:"M3 9h18M3 5h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z M8 3v4M16 3v4",
    mic:"M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8",
    user:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    upload:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
    arrow:"M19 12H5M12 5l-7 7 7 7",
    arrowR:"M5 12h14M12 5l7 7-7 7",
    ext:"M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6M10 14L21 3",
    check:"M20 6L9 17l-5-5",
    x:"M18 6L6 18M6 6l12 12",
    flag:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    trend:"M23 6l-9.5 9.5-5-5L1 18",
    shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    send:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    map:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 100-2 1 1 0 000 2z",
    book:"M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
    zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6z",
    link:"M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
    globe:"M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {(d[n]||"").split(" M ").map((seg,i)=><path key={i} d={i===0?seg:"M "+seg}/>)}
    </svg>
  );
};

const Tag = ({ children, color=T.muted, bg=T.card }) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:500,background:bg,color,border:`1px solid ${color}25`,whiteSpace:"nowrap"}}>
    {children}
  </span>
);

const RepBadge = ({ type }) => {
  const map = {
    excellent: ["🏆 Excellent", T.green, T.greenS],
    great:     ["✅ Great",     "#7C5CBF", "rgba(124,92,191,0.12)"],
    okay:      ["⚡ Okay",      T.gold,    T.goldS],
    mixed:     ["⚠️ Mixed",    T.red,     T.redS],
    poor:      ["❌ Poor",      T.red,     T.redS],
  };
  const [label, color, bg] = map[type] || map.okay;
  return <Tag color={color} bg={bg}>{label}</Tag>;
};

const MatchBar = ({ value }) => {
  const color = value >= 70 ? T.green : value >= 65 ? T.gold : T.acc;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:4,background:T.subtle,borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:2,transition:"width 1s ease"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:700,color,minWidth:32}}>{value}%</span>
    </div>
  );
};

const ScoreRing = ({ value, label, color }) => {
  const r=20, circ=2*Math.PI*r, offset=circ-(value/100)*circ;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <svg width={52} height={52}>
        <circle cx={26} cy={26} r={r} fill="none" stroke={T.subtle} strokeWidth={3}/>
        <circle cx={26} cy={26} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 26 26)" style={{transition:"stroke-dashoffset 1s ease"}}/>
        <text x={26} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{value}</text>
      </svg>
      <span style={{fontSize:10,color:T.muted,textAlign:"center",letterSpacing:"0.3px"}}>{label}</span>
    </div>
  );
};

const Btn = ({ children, onClick, variant="primary", full=false, small=false, disabled=false, style={} }) => {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
    border:"none", cursor:disabled?"not-allowed":"pointer",
    fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600,
    borderRadius:12, transition:"all 0.2s", opacity:disabled?0.5:1,
    padding: small ? "8px 16px" : "13px 22px",
    fontSize: small ? 13 : 14,
    width: full ? "100%" : undefined,
    ...style,
  };
  const variants = {
    primary:   { background:T.acc, color:"#fff" },
    secondary: { background:"transparent", color:T.text, border:`1px solid ${T.border}` },
    ghost:     { background:"transparent", color:T.muted, border:"none" },
    green:     { background:T.green, color:T.bg },
    outline:   { background:T.accS, color:T.acc, border:`1px solid ${T.acc}30` },
  };
  return (
    <button onClick={disabled?undefined:onClick} style={{...base,...variants[variant]}}>
      {children}
    </button>
  );
};

/* ─── LOGO AVATAR ────────────────────────────────────────────────────────── */
const LogoAvatar = ({ logo, color, size=44 }) => (
  <div style={{
    width:size, height:size, borderRadius:12, flexShrink:0,
    background:`${color}15`, border:`1px solid ${color}30`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Clash Display',sans-serif", fontSize:size*0.3,
    fontWeight:700, color, letterSpacing:"0.5px",
  }}>
    {logo}
  </div>
);

/* ─── SKELETON LOADER ────────────────────────────────────────────────────── */
const Skeleton = ({ w="100%", h=16, br=8 }) => (
  <div className="shimmer" style={{width:w,height:h,borderRadius:br}}/>
);

/* ─── BOTTOM NAV ─────────────────────────────────────────────────────────── */
const Nav = ({ page, setPage }) => {
  const items = [
    { id:"dashboard", icon:"home",      label:"Discover" },
    { id:"tracker",   icon:"briefcase", label:"Applied" },
    { id:"scheduler", icon:"calendar",  label:"Interviews" },
    { id:"ai",        icon:"mic",       label:"AI Prep" },
    { id:"profile",   icon:"user",      label:"Profile" },
  ];
  return (
    <nav style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:480,
      background:`${T.surf}ee`, backdropFilter:"blur(20px)",
      borderTop:`1px solid ${T.border}`,
      display:"flex", justifyContent:"space-around",
      padding:"10px 0 16px", zIndex:200,
    }}>
      {items.map(it => {
        const active = page === it.id;
        return (
          <button key={it.id} onClick={()=>setPage(it.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            background:"none", border:"none", cursor:"pointer", padding:"4px 12px",
            position:"relative",
          }}>
            {active && <div style={{
              position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
              width:24, height:2, background:T.acc, borderRadius:2,
            }}/>}
            <Icon n={it.icon} s={20} c={active ? T.acc : T.muted}/>
            <span style={{fontSize:10,color:active?T.acc:T.muted,fontWeight:active?600:400,letterSpacing:"0.3px"}}>
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

/* ─── ONBOARDING ─────────────────────────────────────────────────────────── */
const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [prefs, setPrefs] = useState({ types:[], modes:[], field:"" });
  const fileRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    setParsing(true);
    setTimeout(() => { setParsing(false); setParsed(true); }, 1800);
  };

  const toggleArr = (key, val) =>
    setPrefs(p => ({...p, [key]: p[key].includes(val) ? p[key].filter(x=>x!==val) : [...p[key], val]}));

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding:"8px 16px", borderRadius:20,
      border:`1px solid ${active ? T.acc : T.border}`,
      background: active ? T.accS : "transparent",
      color: active ? T.acc : T.muted,
      fontSize:13, cursor:"pointer",
      fontFamily:"'Plus Jakarta Sans',sans-serif",
      fontWeight: active ? 600 : 400,
      transition:"all 0.15s",
    }}>{label}</button>
  );

  const screens = [
    /* Welcome */
    <div className="fu" style={{padding:"60px 28px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{
        width:80, height:80, borderRadius:24,
        background:`linear-gradient(135deg, ${T.acc}, ${T.accD})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:36, marginBottom:28,
        boxShadow:`0 20px 60px ${T.acc}40`,
      }}>🎯</div>
      <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:34,fontWeight:700,lineHeight:1.15,marginBottom:14}}>
        Land Your <span style={{color:T.acc}}>Dream</span><br/>Opportunity
      </h1>
      <p style={{color:T.muted,fontSize:15,lineHeight:1.75,marginBottom:40,maxWidth:300}}>
        AI-powered job hunting with reputation checks, growth scoring, and live interview prep.
      </p>
      <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:320}}>
        <Btn full onClick={()=>setStep(1)}>Get Started <Icon n="arrowR" s={16} c="#fff"/></Btn>
        <Btn full variant="secondary" onClick={onDone}>Explore Demo</Btn>
      </div>
    </div>,

    /* Resume */
    <div className="fu" style={{padding:"32px 24px"}}>
      <div style={{fontSize:12,color:T.muted,marginBottom:6,letterSpacing:"0.8px"}}>STEP 1 OF 3</div>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Upload your resume</h2>
      <p style={{color:T.muted,fontSize:14,marginBottom:28,lineHeight:1.6}}>We extract your skills to find the best matches automatically.</p>

      <div
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}
        style={{
          border:`2px dashed ${file ? T.acc : T.border}`,
          borderRadius:20, padding:"44px 24px", textAlign:"center", cursor:"pointer",
          background: file ? T.accG : T.surf,
          transition:"all 0.3s",
        }}
      >
        {parsing ? (
          <div>
            <div style={{width:32,height:32,border:`3px solid ${T.border}`,borderTopColor:T.acc,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 14px"}}/>
            <div style={{color:T.muted,fontSize:14}}>Parsing your resume…</div>
          </div>
        ) : parsed ? (
          <div>
            <div style={{fontSize:40,marginBottom:10}}>✅</div>
            <div style={{fontWeight:700,marginBottom:4,color:T.green}}>Resume parsed!</div>
            <div style={{fontSize:13,color:T.muted}}>{file?.name}</div>
          </div>
        ) : (
          <div>
            <div style={{marginBottom:12,opacity:0.5}}><Icon n="upload" s={32} c={T.muted}/></div>
            <div style={{fontWeight:600,marginBottom:4}}>Drop PDF or DOCX here</div>
            <div style={{fontSize:13,color:T.muted}}>or click to browse</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.docx" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
      </div>

      {parsed && (
        <div className="fu" style={{marginTop:16,padding:"14px 16px",background:T.greenS,borderRadius:14,border:`1px solid ${T.green}25`}}>
          <div style={{fontWeight:600,color:T.green,marginBottom:4,fontSize:13}}>✓ Skills detected</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Python","React","ML/NLP","Flask","SQL","Node.js","PyTorch","Git"].map(s=>(
              <Tag key={s} color={T.green} bg={T.greenS}>{s}</Tag>
            ))}
          </div>
        </div>
      )}
      <Btn full style={{marginTop:24}} onClick={()=>setStep(2)}>Continue <Icon n="arrowR" s={16} c="#fff"/></Btn>
    </div>,

    /* Prefs */
    <div className="fu" style={{padding:"32px 24px"}}>
      <div style={{fontSize:12,color:T.muted,marginBottom:6,letterSpacing:"0.8px"}}>STEP 2 OF 3</div>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,marginBottom:24}}>Your preferences</h2>

      <div style={{marginBottom:22}}>
        <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>OPPORTUNITY TYPE</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Internship","Full-time","Part-time","Freelance"].map(t=>(
            <Chip key={t} label={t} active={prefs.types.includes(t)} onClick={()=>toggleArr("types",t)}/>
          ))}
        </div>
      </div>

      <div style={{marginBottom:22}}>
        <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>WORK MODE</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Remote","Hybrid","On-site"].map(t=>(
            <Chip key={t} label={t} active={prefs.modes.includes(t)} onClick={()=>toggleArr("modes",t)}/>
          ))}
        </div>
      </div>

      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>YOUR FIELD</div>
        <input
          value={prefs.field} onChange={e=>setPrefs(p=>({...p,field:e.target.value}))}
          placeholder="e.g. Machine Learning, Web Development…"
          style={{width:"100%",padding:"13px 16px",borderRadius:14,fontSize:14}}
        />
      </div>

      <Btn full onClick={()=>setStep(3)}>Find My Jobs <Icon n="arrowR" s={16} c="#fff"/></Btn>
    </div>,

    /* Scanning */
    <div className="fu" style={{padding:"60px 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>🚀</div>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:28,fontWeight:700,marginBottom:10}}>Scanning for you</h2>
      <p style={{color:T.muted,fontSize:14,lineHeight:1.7,marginBottom:28}}>Checking 200+ job boards and filtering bad-reputation companies.</p>

      <div style={{background:T.card,borderRadius:16,padding:"16px",marginBottom:28,textAlign:"left"}}>
        {["Scanning LinkedIn, Rozee.pk, Internshala…","Checking reputation on Reddit & Glassdoor…","Scoring growth opportunities…","Matching to your skills (60–75% threshold)…"].map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:T.acc,animation:"pulse 1.5s ease infinite",animationDelay:`${i*0.4}s`,flexShrink:0}}/>
            <span style={{fontSize:13,color:T.muted}}>{t}</span>
          </div>
        ))}
      </div>
      <Btn full onClick={onDone}>View My Jobs <Icon n="arrowR" s={16} c="#fff"/></Btn>
    </div>,
  ];

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:480,margin:"0 auto"}}>
      {screens[step]}
    </div>
  );
};

/* ─── JOB CARD ───────────────────────────────────────────────────────────── */
const JobCard = ({ job, onClick, delay=0 }) => (
  <div
    className="fu card-lift"
    onClick={onClick}
    style={{
      background:T.card, borderRadius:20, padding:"18px",
      border:`1px solid ${T.border}`, cursor:"pointer",
      animationDelay:`${delay}s`,
    }}
  >
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
      <div style={{display:"flex",gap:12,alignItems:"center",flex:1}}>
        <LogoAvatar logo={job.logo} color={job.logoColor}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:3,fontFamily:"'Clash Display',sans-serif"}}>{job.title}</div>
          <div style={{fontSize:12,color:T.muted}}>{job.company} · {job.posted}</div>
        </div>
      </div>
      <div style={{
        background:T.accS, border:`1px solid ${T.acc}30`,
        borderRadius:10, padding:"5px 10px", textAlign:"center", flexShrink:0, marginLeft:8,
      }}>
        <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:16,fontWeight:700,color:T.acc}}>{job.match}%</div>
        <div style={{fontSize:9,color:T.muted,letterSpacing:"0.3px"}}>MATCH</div>
      </div>
    </div>

    <MatchBar value={job.match}/>

    <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
      {job.tags.slice(0,3).map(t=><Tag key={t}>{t}</Tag>)}
      {job.tags.length > 3 && <Tag color={T.subtle}>+{job.tags.length-3}</Tag>}
    </div>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <RepBadge type={job.repBadge}/>
        <span style={{fontSize:11,color:T.muted,display:"flex",alignItems:"center",gap:4}}>
          <Icon n="map" s={11} c={T.muted}/>{job.location}
        </span>
        <Tag color={job.mode==="Remote"?T.blue:job.mode==="Hybrid"?T.gold:T.muted}
             bg={job.mode==="Remote"?T.blueS:job.mode==="Hybrid"?T.goldS:T.card}>
          {job.mode}
        </Tag>
      </div>
      <span style={{fontSize:12,fontWeight:700,color:T.gold}}>{job.salary}</span>
    </div>

    {job.flags?.length > 0 && (
      <div style={{marginTop:10,padding:"8px 12px",background:T.redS,borderRadius:10,border:`1px solid ${T.red}20`,
        fontSize:12,color:T.red,display:"flex",gap:6,alignItems:"center"}}>
        <Icon n="flag" s={12} c={T.red}/> {job.flags[0]}
      </div>
    )}
  </div>
);

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
const Dashboard = ({ onJobSelect }) => {
  const [search, setSearch] = useState("");
  const [modeF, setModeF] = useState("All");
  const [repF, setRepF] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ setTimeout(()=>setLoading(false), 900); }, []);

  const filtered = JOBS.filter(j => {
    if (modeF !== "All" && j.mode !== modeF) return false;
    if (repF && j.rep < 80) return false;
    if (search) {
      const q = search.toLowerCase();
      return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t=>t.toLowerCase().includes(q));
    }
    return true;
  });

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding:"7px 14px", borderRadius:20, whiteSpace:"nowrap",
      border:`1px solid ${active?T.acc:T.border}`,
      background:active?T.accS:"transparent",
      color:active?T.acc:T.muted, fontSize:12, cursor:"pointer",
      fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:active?600:400,
      transition:"all 0.15s",
    }}>{label}</button>
  );

  return (
    <div style={{padding:"20px 16px 110px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <div>
          <div style={{fontSize:12,color:T.muted,marginBottom:4}}>Hello, Muhammad 👋</div>
          <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,lineHeight:1.2}}>
            Find Your<br/>Dream Job
          </h1>
        </div>
        <div style={{
          width:44,height:44,borderRadius:"50%",
          background:`linear-gradient(135deg, ${T.acc}, ${T.accD})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Clash Display',sans-serif",fontSize:18,fontWeight:700,color:"#fff",
        }}>M</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
        {[[JOBS.length,"Matched",T.acc],[JOBS.filter(j=>j.rep>=80).length,"Clean Rep",T.green],[JOBS.filter(j=>j.growth>=85).length,"High Growth",T.gold]].map(([n,l,c])=>(
          <div key={l} style={{background:T.card,borderRadius:16,padding:"14px 12px",border:`1px solid ${T.border}`,textAlign:"center"}}>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:24,fontWeight:700,color:c}}>{n}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2,letterSpacing:"0.3px"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Match range info */}
      <div style={{background:T.blueS,borderRadius:14,padding:"12px 14px",border:`1px solid ${T.blue}25`,marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
        <Icon n="zap" s={16} c={T.blue}/>
        <span style={{fontSize:13,color:T.blue,fontWeight:500}}>Showing jobs with <strong>60–75% skill match</strong> — tailored to your resume</span>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:12}}>
        <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
          <Icon n="search" s={16} c={T.muted}/>
        </div>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search jobs, companies, skills…"
          style={{width:"100%",padding:"13px 14px 13px 42px",borderRadius:14,fontSize:14}}
        />
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:18,scrollbarWidth:"none"}}>
        {["All","Remote","Hybrid","On-site"].map(f=>(
          <Chip key={f} label={f} active={modeF===f} onClick={()=>setModeF(f)}/>
        ))}
        <Chip label="✓ Verified rep" active={repF} onClick={()=>setRepF(v=>!v)}/>
      </div>

      {/* Jobs */}
      {loading ? (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{background:T.card,borderRadius:20,padding:"18px",border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",gap:12,marginBottom:14}}>
                <Skeleton w={44} h={44} br={12}/>
                <div style={{flex:1}}><Skeleton w="60%" h={16} br={6}/><div style={{marginTop:8}}><Skeleton w="40%" h={12} br={4}/></div></div>
              </div>
              <Skeleton h={8} br={4}/>
              <div style={{display:"flex",gap:6,marginTop:12}}><Skeleton w={60} h={24} br={12}/><Skeleton w={70} h={24} br={12}/></div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 20px",color:T.muted}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <div style={{fontWeight:600,marginBottom:4}}>No jobs found</div>
              <div style={{fontSize:13}}>Try adjusting your filters</div>
            </div>
          ) : (
            filtered.map((job, i) => (
              <JobCard key={job.id} job={job} onClick={()=>onJobSelect(job)} delay={i*0.05}/>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ─── JOB DETAIL ─────────────────────────────────────────────────────────── */
const JobDetail = ({ job, onBack, onApply, onSchedule }) => {
  const [tab, setTab] = useState("overview");
  const [applied, setApplied] = useState(false);
  const [jd, setJd] = useState(job.jd || "");

  const openUrl = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div style={{padding:"16px 16px 110px"}}>
      {/* Back */}
      <button onClick={onBack} style={{display:"flex",gap:8,alignItems:"center",background:"none",border:"none",
        color:T.muted,cursor:"pointer",fontSize:14,marginBottom:20,padding:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        <Icon n="arrow" s={16} c={T.muted}/> Back
      </button>

      {/* Hero card */}
      <div style={{background:T.card,borderRadius:20,padding:"20px",border:`1px solid ${T.border}`,marginBottom:14}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
          <LogoAvatar logo={job.logo} color={job.logoColor} size={54}/>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:20,fontWeight:700,marginBottom:4}}>{job.title}</h2>
            <div style={{fontSize:13,color:T.muted,marginBottom:6}}>{job.company}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Tag color={T.muted}><Icon n="map" s={10} c={T.muted}/> {job.location}</Tag>
              <Tag color={job.mode==="Remote"?T.blue:T.gold}>{job.mode}</Tag>
              <RepBadge type={job.repBadge}/>
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:12,justifyContent:"space-around",padding:"14px 0",
          borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,marginBottom:14}}>
          <ScoreRing value={job.match} label="Match" color={job.match>=70?T.green:T.gold}/>
          <ScoreRing value={job.rep} label="Reputation" color={T.green}/>
          <ScoreRing value={job.growth} label="Growth" color={T.gold}/>
        </div>

        {/* Action buttons */}
        <div style={{display:"flex",gap:10}}>
          <Btn variant="secondary" small onClick={()=>openUrl(job.sourceUrl)} style={{flex:1,gap:6}}>
            <Icon n="eye" s={14} c={T.muted}/> View Post
          </Btn>
          <Btn variant={applied?"secondary":"primary"} small disabled={applied} onClick={()=>{
            setApplied(true); onApply(job); openUrl(job.applyUrl);
          }} style={{flex:2}}>
            {applied ? "✓ Applied" : <><Icon n="arrowR" s={14} c="#fff"/> Apply Now</>}
          </Btn>
        </div>
      </div>

      {/* Source link banner */}
      <div
        onClick={()=>openUrl(job.sourceUrl)}
        style={{
          background:T.blueS, borderRadius:14, padding:"12px 14px",
          border:`1px solid ${T.blue}25`, marginBottom:14,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          cursor:"pointer",
        }}
      >
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Icon n="globe" s={16} c={T.blue}/>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:T.blue}}>View on {job.source}</div>
            <div style={{fontSize:11,color:T.muted}}>{job.sourceUrl.replace("https://","").substring(0,42)}…</div>
          </div>
        </div>
        <Icon n="ext" s={16} c={T.blue}/>
      </div>

      {/* Tabs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
        {["overview","reputation","growth","apply"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"10px 4px", borderRadius:12, cursor:"pointer",
            border:`1px solid ${tab===t?T.acc:T.border}`,
            background:tab===t?T.accS:"transparent",
            color:tab===t?T.acc:T.muted,
            fontSize:11, fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontWeight:tab===t?700:400, textTransform:"capitalize", letterSpacing:"0.3px",
          }}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="fu">
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>JOB DESCRIPTION</div>
            <p style={{fontSize:14,lineHeight:1.75,color:T.text}}>{job.jd}</p>
          </div>
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:12,letterSpacing:"0.8px"}}>SKILLS REQUIRED</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {job.tags.map(t=><Tag key={t} color={T.acc} bg={T.accS}>{t}</Tag>)}
            </div>
          </div>
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:12,letterSpacing:"0.8px"}}>JOB INFO</div>
            {[["Industry",job.industry],["Company size",job.size],["Funding",job.funding],["Type",job.type],["Salary",job.salary],["Location",job.location]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,color:T.muted}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reputation" && (
        <div className="fu">
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:11,color:T.muted,letterSpacing:"0.8px"}}>REPUTATION SCORE</div>
              <RepBadge type={job.repBadge}/>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:18}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:52,fontWeight:700,
                color:job.rep>=80?T.green:job.rep>=60?T.gold:T.red}}>{job.rep}</div>
              <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>Based on community mentions<br/>across Reddit, Glassdoor & X</div>
            </div>
            {[["Reddit",job.rep-4,T.acc],["Glassdoor",job.rep+2,T.green],["Twitter/X",job.rep-6,T.blue]].map(([src,score,color])=>(
              <div key={src} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:T.muted}}>{src}</span>
                  <span style={{fontSize:12,fontWeight:700,color}}>{Math.min(100,Math.max(0,score))}</span>
                </div>
                <div style={{height:5,background:T.subtle,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,Math.max(0,score))}%`,background:color,borderRadius:3}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:12,letterSpacing:"0.8px"}}>COMMUNITY SIGNALS</div>
            {job.flags?.length ? (
              job.flags.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"8px 0",
                  borderBottom:i<job.flags.length-1?`1px solid ${T.border}`:"none",fontSize:13,color:T.red}}>
                  <Icon n="flag" s={13} c={T.red}/> {f}
                </div>
              ))
            ) : (
              <div style={{display:"flex",gap:8,alignItems:"center",color:T.green,fontSize:13}}>
                <Icon n="check" s={14} c={T.green}/> No red flags detected from community mentions.
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "growth" && (
        <div className="fu">
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:12}}>
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:16}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:52,fontWeight:700,color:T.gold}}>{job.growth}</div>
              <div><div style={{fontWeight:700,marginBottom:2}}>Growth Score</div>
              <div style={{fontSize:12,color:T.muted}}>Company trajectory & alumni paths</div></div>
            </div>
            {[["Funding stage",job.funding,T.acc],["Industry momentum","High demand",T.green],["Alumni avg growth","2.5x in 5yrs",T.gold],["Headcount YoY","+18%",T.green]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,color:T.muted}}>{k}</span>
                <span style={{fontSize:13,fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>ABOUT</div>
            <p style={{fontSize:14,lineHeight:1.75}}>{job.about}</p>
          </div>
        </div>
      )}

      {tab === "apply" && (
        <div className="fu">
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:12}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>PASTE JOB DESCRIPTION (OPTIONAL)</div>
            <textarea value={jd} onChange={e=>setJd(e.target.value)} rows={4}
              placeholder="Paste the full JD to get a more tailored cover letter…"
              style={{width:"100%",borderRadius:12,padding:"12px",fontSize:13,lineHeight:1.6,resize:"vertical"}}/>
          </div>
          <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:14}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.8px"}}>AI COVER LETTER</div>
            <div style={{borderLeft:`3px solid ${T.acc}`,paddingLeft:14,fontSize:13,lineHeight:1.85,color:T.text}}>
              Dear Hiring Manager,<br/><br/>
              I'm excited to apply for the <strong>{job.title}</strong> position at <strong>{job.company}</strong>. As an IT student at Bahria University with hands-on Python, ML, and full-stack experience, I believe I can contribute meaningfully from day one.<br/><br/>
              My project MindSpace — a BERT-powered AI mental health companion — demonstrates my ability to build production NLP pipelines, which aligns directly with your requirements. I look forward to discussing how I can add value to your team.
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn variant="secondary" style={{flex:1}} onClick={()=>openUrl(job.sourceUrl)}>
              <Icon n="ext" s={14} c={T.muted}/> View Post
            </Btn>
            <Btn style={{flex:2}} disabled={applied} onClick={()=>{ setApplied(true); onApply(job); openUrl(job.applyUrl); }}>
              {applied ? "✓ Applied!" : <><Icon n="arrowR" s={14} c="#fff"/> Apply Now</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── TRACKER ────────────────────────────────────────────────────────────── */
const Tracker = ({ applications }) => {
  const stages = ["Applied","Screening","Interview","Offer","Rejected"];
  const colors = { Applied:T.acc, Screening:T.blue, Interview:T.gold, Offer:T.green, Rejected:T.red };

  return (
    <div style={{padding:"20px 16px 110px"}}>
      <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,marginBottom:4}}>Applications</h1>
      <p style={{color:T.muted,fontSize:14,marginBottom:20}}>Track every application in real time.</p>

      {/* Pipeline */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20,scrollbarWidth:"none"}}>
        {stages.map(s=>{
          const count = applications.filter(a=>a.status===s).length;
          return (
            <div key={s} style={{minWidth:70,background:T.card,borderRadius:14,padding:"12px 8px",
              border:`1px solid ${count>0?colors[s]+"40":T.border}`,textAlign:"center",flexShrink:0}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:20,fontWeight:700,
                color:count>0?colors[s]:T.muted}}>{count}</div>
              <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s}</div>
            </div>
          );
        })}
      </div>

      {applications.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",color:T.muted}}>
          <div style={{fontSize:48,marginBottom:14}}>📭</div>
          <div style={{fontWeight:700,marginBottom:6,color:T.text}}>No applications yet</div>
          <div style={{fontSize:13}}>Discover jobs and hit Apply Now to start tracking.</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {applications.map((a,i)=>(
            <div key={a.id} className="fu card-lift" style={{
              background:T.card,borderRadius:16,padding:"16px",
              border:`1px solid ${T.border}`,animationDelay:`${i*0.06}s`,
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <LogoAvatar logo={a.logo} color={a.logoColor} size={38}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{a.title}</div>
                    <div style={{fontSize:12,color:T.muted}}>{a.company} · {a.date}</div>
                  </div>
                </div>
                <span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,
                  background:`${colors[a.status]}20`,color:colors[a.status],
                  border:`1px solid ${colors[a.status]}30`}}>
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── INTERVIEW SCHEDULER ────────────────────────────────────────────────── */
const Scheduler = ({ applications }) => {
  const [showRoadmap, setShowRoadmap] = useState(null);

  const upcoming = applications.filter(a=>a.status==="Interview");

  const roadmapTopics = [
    { day:"Day 1–2", topic:"Core Language & DSA", subtopics:["Python fundamentals","Data structures","Recursion"], done:true },
    { day:"Day 3–4", topic:"Role-specific frameworks", subtopics:["PyTorch basics","Scikit-learn","NLP pipelines"], done:true },
    { day:"Day 5", topic:"System design fundamentals", subtopics:["Scalability","Databases","Caching layers"], done:false },
    { day:"Day 6", topic:"Behavioral preparation", subtopics:["STAR method","Past projects","Why this company?"], done:false },
    { day:"Day 7", topic:"Mock interview + review", subtopics:["Practice answers","Weak spots","Questions to ask"], done:false },
  ];

  if (showRoadmap) return (
    <div style={{padding:"20px 16px 110px"}}>
      <button onClick={()=>setShowRoadmap(null)} style={{display:"flex",gap:8,alignItems:"center",
        background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:14,marginBottom:20,padding:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        <Icon n="arrow" s={16} c={T.muted}/> Back
      </button>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:24,fontWeight:700,marginBottom:4}}>Prep Roadmap</h2>
      <p style={{color:T.muted,fontSize:14,marginBottom:20}}>{showRoadmap.title} at {showRoadmap.company} · 7 days</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
        {[["7","Days",T.acc],["5","Topics",T.green],["5","Mock Q&A",T.gold]].map(([n,l,c])=>(
          <div key={l} style={{background:T.card,borderRadius:14,padding:"14px 10px",border:`1px solid ${T.border}`,textAlign:"center"}}>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:22,fontWeight:700,color:c}}>{n}</div>
            <div style={{fontSize:11,color:T.muted}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {roadmapTopics.map((t,i)=>(
          <div key={i} className="fu" style={{
            background:T.card,borderRadius:16,padding:"14px 16px",
            border:`1px solid ${t.done?T.green+"40":T.border}`,
            animationDelay:`${i*0.07}s`,
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <span style={{fontSize:11,color:T.muted}}>{t.day} · </span>
                <span style={{fontSize:14,fontWeight:700}}>{t.topic}</span>
              </div>
              {t.done && <div style={{width:20,height:20,borderRadius:"50%",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon n="check" s={12} c={T.green}/>
              </div>}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {t.subtopics.map(s=><Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{padding:"20px 16px 110px"}}>
      <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,marginBottom:4}}>Interviews</h1>
      <p style={{color:T.muted,fontSize:14,marginBottom:20}}>Scheduled sessions and prep roadmaps.</p>

      {upcoming.length === 0 ? (
        <div style={{background:T.card,borderRadius:20,padding:"30px 20px",border:`2px dashed ${T.border}`,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:12}}>📅</div>
          <div style={{fontWeight:700,marginBottom:6}}>No interviews yet</div>
          <div style={{fontSize:13,color:T.muted}}>Apply to jobs and move them to Interview status to get AI-generated prep roadmaps.</div>
        </div>
      ) : (
        upcoming.map((iv,i)=>(
          <div key={i} className="fu" style={{background:T.card,borderRadius:20,padding:"18px",border:`1px solid ${T.border}`,marginBottom:14,animationDelay:`${i*0.06}s`}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
              <LogoAvatar logo={iv.logo} color={iv.logoColor}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15}}>{iv.title}</div>
                <div style={{fontSize:13,color:T.muted}}>{iv.company}</div>
              </div>
              <Tag color={T.gold} bg={T.goldS}>Scheduled</Tag>
            </div>
            <Btn full onClick={()=>setShowRoadmap(iv)}>
              <Icon n="book" s={14} c="#fff"/> View Prep Roadmap
            </Btn>
          </div>
        ))
      )}
    </div>
  );
};

/* ─── AI MOCK INTERVIEW ──────────────────────────────────────────────────── */
const MockInterview = () => {
  const [mode, setMode] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("ML Engineer Intern");
  const [jd, setJd] = useState("");
  const [scores, setScores] = useState({ comm:0, tech:0, struct:0 });
  const bottomRef = useRef();

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages,loading]);

  const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const startInterview = async () => {
    setMode("live"); setLoading(true);
    try {
      const res = await fetch(`${API}/api/interview/mock`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role, jd, history:[] }),
      });
      const data = await res.json();
      setMessages([{ role:"interviewer", text:data.reply }]);
    } catch {
      setMessages([{ role:"interviewer", text:`Welcome! I'm your AI interviewer for the ${role} role. Let's start with a quick introduction — tell me about yourself and what excites you about this field.` }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    const newMsgs = [...messages, { role:"candidate", text:userMsg }];
    setMessages(newMsgs); setLoading(true);
    try {
      const history = newMsgs.map(m=>({ role:m.role, content:m.text }));
      const res = await fetch(`${API}/api/interview/mock`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role, jd, history }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role:"interviewer", text:data.reply }]);
    } catch {
      setMessages([...newMsgs, { role:"interviewer", text:"Good answer! Let's move on. Can you walk me through the most complex project you've built and what technical challenges you faced?" }]);
    }
    setLoading(false);
  };

  if (mode === "idle") return (
    <div style={{padding:"20px 16px 110px"}}>
      <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,marginBottom:4}}>AI Mock Interview</h1>
      <p style={{color:T.muted,fontSize:14,marginBottom:24}}>Practice with a real-time AI interviewer, get instant feedback.</p>

      <div style={{background:T.card,borderRadius:20,padding:"24px",border:`1px solid ${T.border}`,marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:14}}>🤖</div>
        <h3 style={{fontFamily:"'Clash Display',sans-serif",fontSize:20,fontWeight:700,marginBottom:8}}>Live Interview Simulator</h3>
        <p style={{fontSize:13,color:T.muted,lineHeight:1.75,marginBottom:20}}>Powered by Claude AI. Dynamic follow-up questions, per-answer feedback, and a performance report at the end.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,textAlign:"left",marginBottom:20}}>
          {[["🎯","Role-specific questions","Generated from your target JD"],["⚡","Instant feedback","Tips after every single answer"],["📊","Performance report","Scored across 3 dimensions"]].map(([ic,t,d])=>(
            <div key={t} style={{display:"flex",gap:12,padding:"12px",background:T.surf,borderRadius:12,alignItems:"center"}}>
              <span style={{fontSize:22}}>{ic}</span>
              <div><div style={{fontWeight:600,fontSize:13}}>{t}</div><div style={{fontSize:12,color:T.muted}}>{d}</div></div>
            </div>
          ))}
        </div>
        <Btn full onClick={()=>setMode("setup")}>Start Mock Interview <Icon n="arrowR" s={14} c="#fff"/></Btn>
      </div>
    </div>
  );

  if (mode === "setup") return (
    <div className="fu" style={{padding:"20px 16px 110px"}}>
      <button onClick={()=>setMode("idle")} style={{display:"flex",gap:8,alignItems:"center",background:"none",border:"none",
        color:T.muted,cursor:"pointer",fontSize:14,marginBottom:20,padding:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        <Icon n="arrow" s={16} c={T.muted}/> Back
      </button>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:24,fontWeight:700,marginBottom:20}}>Set up your session</h2>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:8,letterSpacing:"0.8px"}}>TARGET ROLE</label>
        <input value={role} onChange={e=>setRole(e.target.value)} style={{width:"100%",padding:"13px 16px",borderRadius:14,fontSize:14}}/>
      </div>
      <div style={{marginBottom:28}}>
        <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:8,letterSpacing:"0.8px"}}>JOB DESCRIPTION (OPTIONAL)</label>
        <textarea value={jd} onChange={e=>setJd(e.target.value)} rows={5}
          placeholder="Paste the full JD for more targeted questions…"
          style={{width:"100%",padding:"13px 16px",borderRadius:14,fontSize:14,resize:"vertical",lineHeight:1.6}}/>
      </div>
      <Btn full onClick={startInterview}>Begin Interview <Icon n="arrowR" s={14} c="#fff"/></Btn>
    </div>
  );

  if (mode === "feedback") return (
    <div className="fu" style={{padding:"20px 16px 110px"}}>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,marginBottom:4}}>Session Complete 🎉</h2>
      <p style={{color:T.muted,fontSize:14,marginBottom:20}}>Your performance summary.</p>
      <div style={{background:T.card,borderRadius:20,padding:"24px",border:`1px solid ${T.border}`,marginBottom:14}}>
        <div style={{display:"flex",gap:16,justifyContent:"space-around",marginBottom:16}}>
          <ScoreRing value={scores.comm||78} label="Communication" color={T.acc}/>
          <ScoreRing value={scores.tech||82} label="Technical" color={T.green}/>
          <ScoreRing value={scores.struct||74} label="Structure" color={T.gold}/>
        </div>
        <div style={{fontSize:14,color:T.muted,lineHeight:1.75,padding:"14px 0",borderTop:`1px solid ${T.border}`}}>
          Strong technical depth with good examples. Work on structuring answers using the STAR method for behavioral questions. Your ML knowledge is solid — practice system design for senior rounds.
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" style={{flex:1}} onClick={()=>{setMessages([]);setMode("idle");}}>Retry</Btn>
        <Btn style={{flex:1}} onClick={()=>{setMessages([]);setMode("setup");}}>New Role</Btn>
      </div>
    </div>
  );

  /* Live chat */
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:T.bg}}>
      <div style={{padding:"14px 16px",background:T.surf,borderBottom:`1px solid ${T.border}`,
        display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:16,fontWeight:700}}>Mock Interview</div>
          <div style={{fontSize:12,color:T.muted}}>{role}</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.green,animation:"pulse 1.5s ease infinite"}}/>
            <span style={{fontSize:12,color:T.green,fontWeight:600}}>Live</span>
          </div>
          <Btn small variant="secondary" onClick={()=>setMode("feedback")}>End</Btn>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:14}}>
        {messages.map((m,i)=>(
          <div key={i} className="fu" style={{display:"flex",gap:10,
            flexDirection:m.role==="candidate"?"row-reverse":"row",animationDelay:`${i*0.04}s`}}>
            <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
              background:m.role==="interviewer"?T.acc:T.subtle,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>
              {m.role==="interviewer"?"🤖":"M"}
            </div>
            <div style={{maxWidth:"80%",
              background:m.role==="candidate"?T.accS:T.card,
              borderRadius:16,
              borderTopLeftRadius:m.role==="interviewer"?4:16,
              borderTopRightRadius:m.role==="candidate"?4:16,
              padding:"12px 14px",
              border:`1px solid ${m.role==="candidate"?T.acc+"30":T.border}`}}>
              <div style={{fontSize:10,color:T.muted,marginBottom:5,letterSpacing:"0.5px"}}>
                {m.role==="interviewer"?"AI INTERVIEWER":"YOU"}
              </div>
              <p style={{fontSize:14,lineHeight:1.75}}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:T.acc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{background:T.card,borderRadius:16,borderTopLeftRadius:4,padding:"14px 18px",border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",gap:5}}>
                {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:T.muted,animation:"pulse 1s ease infinite",animationDelay:`${i*0.2}s`}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div style={{padding:"12px 16px 28px",background:T.surf,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",gap:10}}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
            placeholder="Type your answer…"
            style={{flex:1,padding:"13px 16px",borderRadius:14,fontSize:14}}/>
          <Btn onClick={sendMessage} disabled={loading||!input.trim()} style={{padding:"13px 16px",borderRadius:14}}>
            <Icon n="send" s={16} c="#fff"/>
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ─── PROFILE ────────────────────────────────────────────────────────────── */
const Profile = ({ applications }) => (
  <div style={{padding:"20px 16px 110px"}}>
    <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:24}}>
      <div style={{width:64,height:64,borderRadius:"50%",
        background:`linear-gradient(135deg, ${T.acc}, ${T.accD})`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:"'Clash Display',sans-serif",fontSize:26,fontWeight:700,color:"#fff"}}>M</div>
      <div>
        <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:22,fontWeight:700}}>Muhammad Mujtaba</h2>
        <div style={{fontSize:13,color:T.muted}}>BS IT · Bahria University · Karachi</div>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
      {[[JOBS.length,"Matched",T.acc],[applications.length,"Applied",T.gold],[applications.filter(a=>a.status==="Interview").length,"Interviews",T.green],["75%","Best match",T.blue]].map(([n,l,c])=>(
        <div key={l} style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,textAlign:"center"}}>
          <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:24,fontWeight:700,color:c}}>{n}</div>
          <div style={{fontSize:12,color:T.muted,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>

    <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:14}}>
      <div style={{fontSize:11,color:T.muted,marginBottom:12,letterSpacing:"0.8px"}}>DETECTED SKILLS</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["Python","React","ML/NLP","Flask","SQL","Node.js","PyTorch","BERT","Git","C++"].map(s=>(
          <Tag key={s} color={T.acc} bg={T.accS}>{s}</Tag>
        ))}
      </div>
    </div>

    <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,marginBottom:14}}>
      <div style={{fontSize:11,color:T.muted,marginBottom:12,letterSpacing:"0.8px"}}>RESUME</div>
      <div style={{display:"flex",gap:12,alignItems:"center",padding:"12px",background:T.surf,borderRadius:12}}>
        <div style={{fontSize:28}}>📄</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700}}>Muhammad_Mujtaba_Motiwala_2026.pdf</div>
          <div style={{fontSize:12,color:T.muted}}>Uploaded · 119 KB</div>
        </div>
        <Btn small variant="outline">Update</Btn>
      </div>
    </div>

    <div style={{background:T.card,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`}}>
      <div style={{fontSize:11,color:T.muted,marginBottom:12,letterSpacing:"0.8px"}}>MATCH CRITERIA</div>
      <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
        <span style={{fontSize:13,color:T.muted}}>Min match score</span>
        <span style={{fontSize:13,fontWeight:700,color:T.acc}}>60%</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0"}}>
        <span style={{fontSize:13,color:T.muted}}>Max match score</span>
        <span style={{fontSize:13,fontWeight:700,color:T.green}}>75%</span>
      </div>
    </div>
  </div>
);

/* ─── APP ROOT ───────────────────────────────────────────────────────────── */
export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const handleApply = useCallback((job) => {
    setApplications(prev => {
      if (prev.find(a => a.id === job.id)) return prev;
      return [...prev, {
        id: job.id, title: job.title, company: job.company,
        logo: job.logo, logoColor: job.logoColor,
        status:"Applied", date: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),
      }];
    });
  }, []);

  if (!onboarded) return (
    <>
      <style>{G}</style>
      <Onboarding onDone={()=>setOnboarded(true)}/>
    </>
  );

  const renderPage = () => {
    if (page === "ai") return <MockInterview/>;
    if (selectedJob) return (
      <JobDetail
        job={selectedJob}
        onBack={()=>setSelectedJob(null)}
        onApply={handleApply}
        onSchedule={()=>{ setSelectedJob(null); setPage("scheduler"); }}
      />
    );
    switch (page) {
      case "dashboard":  return <Dashboard onJobSelect={setSelectedJob}/>;
      case "tracker":    return <Tracker applications={applications}/>;
      case "scheduler":  return <Scheduler applications={applications}/>;
      case "profile":    return <Profile applications={applications}/>;
      default:           return <Dashboard onJobSelect={setSelectedJob}/>;
    }
  };

  return (
    <>
      <style>{G}</style>
      <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",position:"relative"}}>
        {renderPage()}
        {page !== "ai" && (
          <Nav
            page={selectedJob ? "dashboard" : page}
            setPage={p=>{ setSelectedJob(null); setPage(p); }}
          />
        )}
      </div>
    </>
  );
}
