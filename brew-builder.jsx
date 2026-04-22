import { useState, useMemo, useEffect, useCallback } from "react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const MALTS = [
  { name: "2-Row Pale",     ppg: 37, color: 1.8 },
  { name: "Maris Otter",    ppg: 38, color: 3.0 },
  { name: "Pilsner",        ppg: 37, color: 1.5 },
  { name: "Vienna",         ppg: 36, color: 4.0 },
  { name: "Munich Light",   ppg: 37, color: 10  },
  { name: "Munich Dark",    ppg: 37, color: 20  },
  { name: "Wheat Malt",     ppg: 38, color: 2.0 },
  { name: "Rye Malt",       ppg: 37, color: 3.0 },
  { name: "Flaked Wheat",   ppg: 35, color: 2.0 },
  { name: "Flaked Oats",    ppg: 33, color: 1.0 },
  { name: "Flaked Barley",  ppg: 32, color: 2.0 },
  { name: "Cara-Pils",      ppg: 35, color: 2.0 },
  { name: "Crystal 20L",    ppg: 35, color: 20  },
  { name: "Crystal 40L",    ppg: 34, color: 40  },
  { name: "Crystal 60L",    ppg: 34, color: 60  },
  { name: "Crystal 80L",    ppg: 33, color: 80  },
  { name: "Crystal 120L",   ppg: 33, color: 120 },
  { name: "Aromatic",       ppg: 36, color: 26  },
  { name: "Biscuit",        ppg: 35, color: 25  },
  { name: "Honey Malt",     ppg: 37, color: 25  },
  { name: "Special B",      ppg: 31, color: 180 },
  { name: "Chocolate Malt", ppg: 28, color: 350 },
  { name: "Roasted Barley", ppg: 25, color: 300 },
  { name: "Black Patent",   ppg: 25, color: 500 },
  { name: "Smoked Malt",    ppg: 37, color: 5.0 },
];

const HOPS = [
  { name: "Amarillo",             aa: 9.0  },
  { name: "Azacca",               aa: 15.0 },
  { name: "Cascade",              aa: 5.5  },
  { name: "Centennial",           aa: 10.0 },
  { name: "Chinook",              aa: 13.0 },
  { name: "Citra",                aa: 12.0 },
  { name: "Columbus (CTZ)",       aa: 15.0 },
  { name: "El Dorado",            aa: 15.0 },
  { name: "Fuggle",               aa: 4.5  },
  { name: "Galaxy",               aa: 14.0 },
  { name: "Hallertau Mittelfrüh", aa: 4.0  },
  { name: "Magnum",               aa: 14.0 },
  { name: "Mosaic",               aa: 12.5 },
  { name: "Nugget",               aa: 13.0 },
  { name: "Saaz",                 aa: 3.5  },
  { name: "Simcoe",               aa: 13.0 },
  { name: "Styrian Goldings",     aa: 5.5  },
  { name: "Tettnang",             aa: 4.5  },
  { name: "Warrior",              aa: 16.0 },
  { name: "Willamette",           aa: 5.0  },
];

const YEASTS = [
  { name: "US-05 (American Ale)",    atten: 81, floc: "Medium",    temp: "59–75°F" },
  { name: "Nottingham",              atten: 77, floc: "High",       temp: "57–70°F" },
  { name: "S-33 (Belgian)",          atten: 72, floc: "Medium",    temp: "59–75°F" },
  { name: "BE-256 (Abbey)",          atten: 82, floc: "High",       temp: "59–77°F" },
  { name: "WY1056 American Ale",     atten: 75, floc: "Low-Med",   temp: "60–72°F" },
  { name: "WY1214 Belgian Abbey",    atten: 75, floc: "Med-High",  temp: "68–78°F" },
  { name: "WY1388 Belgian Strong",   atten: 78, floc: "Low",       temp: "65–85°F" },
  { name: "WY1968 London ESB",       atten: 67, floc: "Very High", temp: "64–72°F" },
  { name: "WY3522 Belgian Ardennes", atten: 78, floc: "Low",       temp: "65–85°F" },
  { name: "WY3787 Trappist HG",      atten: 78, floc: "Medium",    temp: "64–78°F" },
  { name: "WY2206 Bavarian Lager",   atten: 73, floc: "Medium",    temp: "46–56°F" },
  { name: "WLP001 California Ale",   atten: 74, floc: "Medium",    temp: "65–72°F" },
  { name: "WLP500 Trappist Ale",     atten: 78, floc: "Low-Med",   temp: "65–72°F" },
  { name: "W-34/70 Lager",           atten: 82, floc: "High",       temp: "48–72°F" },
];

const STYLES = [
  "American Pale Ale","American IPA","Double IPA","West Coast IPA","Hazy IPA",
  "American Amber","American Stout","Oatmeal Stout","Imperial Stout",
  "Belgian Tripel","Belgian Dubbel","Belgian Golden Strong","Belgian Quad",
  "Saison","Witbier","English Bitter","English Porter",
  "Brown Ale","Hefeweizen","Dunkelweizen","Kölsch","Pilsner","Other",
];

// ─── Calculations ─────────────────────────────────────────────────────────────

function srmToRgb(srm) {
  const s = Math.min(Math.max(srm, 0), 40);
  const table = [
    [0,[255,239,153]],[2,[255,216,106]],[4,[255,186,66]],
    [6,[248,166,0]],  [8,[224,120,0]], [12,[176,72,0]],
    [16,[128,44,0]],  [20,[96,28,0]],  [30,[52,12,0]],[40,[16,4,0]],
  ];
  for (let i = 0; i < table.length - 1; i++) {
    if (s >= table[i][0] && s <= table[i+1][0]) {
      const t = (s - table[i][0]) / (table[i+1][0] - table[i][0]);
      return table[i][1].map((c,j) => Math.round(c + (table[i+1][1][j]-c)*t));
    }
  }
  return [16,4,0];
}
const srmToHex = s => { const [r,g,b] = srmToRgb(s); return `rgb(${r},${g},${b})`; };

function tinsethIBU(aa, oz, mins, ogPts, batchGal) {
  if (!oz || oz<=0 || mins<=0 || batchGal<=0) return 0;
  const og = 1 + ogPts/1000;
  const bigness = 1.65 * Math.pow(0.000125, og-1);
  const factor  = (1 - Math.exp(-0.04*mins)) / 4.15;
  return bigness * factor * (aa/100) * oz * 7489 / batchGal;
}

function calcStats(grains, hops, yeast, batchSize, efficiency) {
  const bs  = parseFloat(batchSize)  || 5.5;
  const eff = parseFloat(efficiency) || 75;
  const totalGrainPts = grains.reduce((s,g) => s + (parseFloat(g.lbs)||0) * g.ppg, 0);
  const ogPts = totalGrainPts * (eff/100) / bs;
  const og    = 1 + ogPts/1000;
  const fg    = 1 + (ogPts/1000)*(1 - yeast.atten/100);
  const abv   = (og-fg)*131.25;
  const mcu   = grains.reduce((s,g)=>(s+(parseFloat(g.lbs)||0)*g.color),0)/bs;
  const srm   = mcu>0 ? 1.4922*Math.pow(mcu,0.6859) : 0;
  const ibu   = hops.filter(h=>h.type==="Boil"||h.type==="Whirlpool")
    .reduce((s,h) => {
      const m = h.type==="Whirlpool"?15:(parseFloat(h.time)||0);
      return s + tinsethIBU(parseFloat(h.aa)||0,parseFloat(h.oz)||0,m,ogPts,bs);
    },0);
  const bgu       = og>1 ? ibu/((og-1)*1000) : 0;
  const lbs       = grains.reduce((s,g)=>s+(parseFloat(g.lbs)||0),0);
  const preboilOG = 1 + (ogPts*bs)/((bs+1)*1000);
  return { og, fg, abv, srm, ibu, bgu, lbs, ogPts, bs, preboilOG, totalGrainPts };
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const IDX_KEY = "brewbuilder-index";
const recKey  = id => `brewbuilder-recipe-${id}`;
const genId   = () => Math.random().toString(36).slice(2,10);

async function loadIndex() {
  try {
    const r = await window.storage.get(IDX_KEY);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function saveIndex(idx) {
  try { await window.storage.set(IDX_KEY, JSON.stringify(idx)); } catch {}
}

async function loadRecipe(id) {
  try {
    const r = await window.storage.get(recKey(id));
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

async function persistRecipe(recipe) {
  try { await window.storage.set(recKey(recipe.id), JSON.stringify(recipe)); } catch {}
}

async function deleteRecipeStorage(id) {
  try {
    await window.storage.delete(recKey(id));
  } catch {}
}

// ─── Responsive hook ──────────────────────────────────────────────────────────

function useWidth() {
  const [w, setW] = useState(()=>typeof window!=="undefined"?window.innerWidth:800);
  useEffect(()=>{
    const fn=()=>setW(window.innerWidth);
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);
  return w;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg:"#0c0b0a", surface:"#171511", elevated:"#201d18",
  border:"#2a2620", borderLt:"#3a342c",
  amber:"#c8870a", amberLt:"#e09c1a", amberDim:"#6b4a08",
  amberGlow:"rgba(200,135,10,0.12)",
  cream:"#e8e0cf", muted:"#7a7060", faint:"#3a3428",
  red:"#a03025", green:"#2e7a3a", greenGlow:"rgba(46,122,58,0.15)",
  blue:"#2a6a9a", blueGlow:"rgba(42,106,154,0.15)",
};
const mono  = "'Courier Prime','Courier New',monospace";
const serif = "'Playfair Display',Georgia,serif";

// ─── Primitives ───────────────────────────────────────────────────────────────

function Label({ children }) {
  return <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",
    textTransform:"uppercase",marginBottom:4,fontFamily:mono}}>{children}</div>;
}
function SHead({ children }) {
  return <div style={{fontSize:10,color:C.amber,letterSpacing:"0.14em",
    textTransform:"uppercase",fontWeight:700,fontFamily:mono,marginBottom:14,
    display:"flex",alignItems:"center",gap:7}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:C.amber,
      display:"inline-block",opacity:0.7}}/>
    {children}
  </div>;
}
function Inp({ value, onChange, step=1, min=0, disabled, sx={} }) {
  return <input type="number" value={value} step={step} min={min} disabled={disabled}
    onChange={e=>onChange(e.target.value)}
    style={{background:disabled?C.elevated:C.bg,border:`1px solid ${C.border}`,
      borderRadius:4,color:disabled?C.muted:C.cream,padding:"10px",fontSize:15,
      fontFamily:mono,outline:"none",width:"100%",boxSizing:"border-box",
      opacity:disabled?0.45:1,WebkitAppearance:"none",minHeight:44,...sx}}/>;
}
function Sel({ value, onChange, children, sx={} }) {
  return <div style={{position:"relative",...sx}}>
    <select value={value} onChange={onChange} style={{background:C.bg,
      border:`1px solid ${C.border}`,borderRadius:4,color:C.cream,
      padding:"10px 28px 10px 10px",fontSize:15,fontFamily:mono,outline:"none",
      cursor:"pointer",width:"100%",boxSizing:"border-box",
      appearance:"none",WebkitAppearance:"none",minHeight:44}}>
      {children}
    </select>
    <span style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",
      color:C.muted,pointerEvents:"none",fontSize:10}}>▼</span>
  </div>;
}
function TextInp({ value, onChange, placeholder, sx={} }) {
  return <input type="text" value={value} placeholder={placeholder}
    onChange={e=>onChange(e.target.value)}
    style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,
      color:C.cream,padding:"10px",fontSize:14,fontFamily:mono,outline:"none",
      width:"100%",boxSizing:"border-box",minHeight:44,...sx}}/>;
}
function RO({ children, sx={} }) {
  return <div style={{background:C.elevated,border:`1px solid ${C.border}`,
    borderRadius:4,color:C.muted,padding:"10px",fontSize:14,fontFamily:mono,
    minHeight:44,display:"flex",alignItems:"center",...sx}}>{children}</div>;
}
function Btn({ onClick, children, variant="amber", sx={} }) {
  const vars = {
    amber:  { bg:C.amberGlow, border:`1px solid ${C.amberDim}`, color:C.amber },
    green:  { bg:C.greenGlow, border:`1px solid ${C.green}`,    color:C.green },
    ghost:  { bg:"transparent", border:`1px solid ${C.faint}`,  color:C.muted },
    danger: { bg:"transparent", border:`1px solid ${C.red}`,    color:C.red   },
  };
  const v = vars[variant] || vars.amber;
  return <button onClick={onClick} style={{...v,borderRadius:4,
    padding:"8px 14px",fontSize:12,cursor:"pointer",fontFamily:mono,
    letterSpacing:"0.06em",flexShrink:0,minHeight:36,...sx}}>{children}</button>;
}
function XBtn({ onClick }) {
  return <button onClick={onClick} style={{background:"transparent",
    border:`1px solid ${C.faint}`,color:C.faint,borderRadius:4,cursor:"pointer",
    fontSize:20,lineHeight:1,fontFamily:mono,minWidth:44,minHeight:44,flexShrink:0,
    display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>;
}
function Card({ children, sx={} }) {
  return <div style={{background:C.surface,border:`1px solid ${C.border}`,
    borderRadius:6,padding:14,...sx}}>{children}</div>;
}

// ─── Delta display ────────────────────────────────────────────────────────────

function Delta({ target, actual, fmt, invert=false }) {
  if (actual === "" || actual === null || actual === undefined) return <span style={{color:C.faint}}>—</span>;
  const t = parseFloat(target), a = parseFloat(actual);
  if (isNaN(t) || isNaN(a)) return <span style={{color:C.faint}}>—</span>;
  const d = a - t;
  const pos = invert ? d < 0 : d > 0;
  const neg = invert ? d > 0 : d < 0;
  const color = Math.abs(d) < 0.001 ? C.muted : pos ? C.green : C.red;
  const sign = d > 0 ? "+" : "";
  return <span style={{color, fontFamily:mono, fontSize:13}}>
    {sign}{fmt ? fmt(d) : d.toFixed(3)}
  </span>;
}

// ─── Actuals comparison row ───────────────────────────────────────────────────

function CompRow({ label, target, actual, fmt, unit="", invert=false, mobile }) {
  const hasActual = actual !== "" && actual !== null && actual !== undefined && actual !== "0";
  const targetStr = fmt ? fmt(parseFloat(target)||0) : (parseFloat(target)||0).toFixed(3);
  const actualVal = parseFloat(actual);
  const actualStr = (!isNaN(actualVal) && actual !== "") ? (fmt ? fmt(actualVal) : actualVal.toFixed(3)) : "—";
  return (
    <div style={{display:"grid", gridTemplateColumns: mobile ? "1fr 1fr 1fr" : "140px 1fr 1fr 1fr",
      gap:8, alignItems:"center", padding:"8px 0",
      borderBottom:`1px solid ${C.border}`}}>
      {!mobile && <div style={{fontSize:11,color:C.muted,fontFamily:mono,
        letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</div>}
      {mobile && <div style={{fontSize:11,color:C.muted,fontFamily:mono,
        letterSpacing:"0.05em",gridColumn:"1/-1",marginBottom:2,textTransform:"uppercase"}}>{label}</div>}
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:9,color:C.faint,letterSpacing:"0.1em",
          textTransform:"uppercase",marginBottom:3}}>Target</div>
        <div style={{fontFamily:mono,fontSize:16,color:C.amber,fontWeight:700}}>
          {targetStr}<span style={{fontSize:11,color:C.muted}}>{unit}</span>
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:9,color:C.faint,letterSpacing:"0.1em",
          textTransform:"uppercase",marginBottom:3}}>Actual</div>
        <div style={{fontFamily:mono,fontSize:16,
          color:hasActual?C.cream:C.faint,fontWeight:hasActual?700:400}}>
          {actualStr}<span style={{fontSize:11,color:C.muted}}>{hasActual?unit:""}</span>
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:9,color:C.faint,letterSpacing:"0.1em",
          textTransform:"uppercase",marginBottom:3}}>Δ</div>
        <div style={{fontFamily:mono,fontSize:16,fontWeight:700}}>
          <Delta target={target} actual={actual} fmt={fmt} invert={invert}/>
          <span style={{fontSize:11,color:C.muted}}>{hasActual?unit:""}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function Modal({ onClose, title, children, width=480 }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
      onClick={onClose}>
      <div style={{background:C.surface,border:`1px solid ${C.borderLt}`,
        borderRadius:8,width:"100%",maxWidth:width,maxHeight:"85vh",
        overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:mono,fontSize:11,color:C.amber,
            letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:700}}>
            {title}
          </div>
          <XBtn onClick={onClose}/>
        </div>
        <div style={{padding:16}}>{children}</div>
      </div>
    </div>
  );
}

// ─── Blank recipe factory ─────────────────────────────────────────────────────

let _uid = 1;
const uid = () => _uid++;

function blankRecipe(name="New Recipe") {
  return {
    id: genId(),
    name,
    style: "American Pale Ale",
    batchSize: "5.5",
    efficiency: "75",
    notes: "",
    grains: [
      { id: uid(), name:"2-Row Pale",  ppg:37, color:1.8, lbs:"10"   },
      { id: uid(), name:"Crystal 40L", ppg:34, color:40,  lbs:"0.75" },
    ],
    hops: [
      { id:uid(), name:"Cascade", aa:"5.5", oz:"1.0",  time:"60", type:"Boil"    },
      { id:uid(), name:"Cascade", aa:"5.5", oz:"0.75", time:"15", type:"Boil"    },
      { id:uid(), name:"Cascade", aa:"5.5", oz:"0.5",  time:"0",  type:"Dry Hop" },
    ],
    yeast: YEASTS[0],
    actuals: { brewDate:"", preBoilVol:"", preBoilOG:"", og:"", fg:"", batchVol:"", notes:"" },
    versions: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function snapshotData(recipe) {
  return {
    name: recipe.name, style: recipe.style, batchSize: recipe.batchSize,
    efficiency: recipe.efficiency, notes: recipe.notes,
    grains: JSON.parse(JSON.stringify(recipe.grains)),
    hops:   JSON.parse(JSON.stringify(recipe.hops)),
    yeast:  { ...recipe.yeast },
    actuals:{ ...recipe.actuals },
  };
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function BrewBuilder() {
  const width  = useWidth();
  const mobile = width < 640;

  useEffect(()=>{
    const link = document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Courier+Prime:wght@400;700&display=swap";
    document.head.appendChild(link);
    return ()=>{ try{document.head.removeChild(link);}catch(e){} };
  },[]);

  // ── Core recipe state ──
  const [recipe,    setRecipe]    = useState(blankRecipe("Cascade Pale Ale"));
  const [index,     setIndex]     = useState([]);   // [{id,name,style,updatedAt}]
  const [dirty,     setDirty]     = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  // ── UI state ──
  const [showRecipes,  setShowRecipes]  = useState(false);
  const [showSave,     setShowSave]     = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [vLabel,       setVLabel]       = useState("");
  const [saveMsg,      setSaveMsg]      = useState("");

  // ── Load index on mount ──
  useEffect(()=>{
    loadIndex().then(idx=>{
      setIndex(idx);
      if(idx.length===0){
        // Auto-save the blank recipe so there's always something
        const r = blankRecipe("Cascade Pale Ale");
        setRecipe(r);
        persistRecipe(r);
        saveIndex([{id:r.id,name:r.name,style:r.style,updatedAt:r.updatedAt}]);
        setIndex([{id:r.id,name:r.name,style:r.style,updatedAt:r.updatedAt}]);
      } else {
        // Load most recent
        loadRecipe(idx[0].id).then(r=>{ if(r) setRecipe(r); });
      }
    }).catch(()=>setStorageOk(false));
  },[]);

  // ── Mark dirty on changes (but not on initial load) ──
  const markDirty = useCallback(()=>setDirty(true),[]);

  // ── Update helpers that also mark dirty ──
  const upRecipe = useCallback((patch) => {
    setRecipe(r=>({...r,...patch,updatedAt:Date.now()}));
    markDirty();
  },[markDirty]);

  // ── Computed stats ──
  const stats = useMemo(()=>
    calcStats(recipe.grains, recipe.hops, recipe.yeast, recipe.batchSize, recipe.efficiency),
    [recipe.grains, recipe.hops, recipe.yeast, recipe.batchSize, recipe.efficiency]
  );

  // ── Actuals-derived values ──
  const actualStats = useMemo(()=>{
    const a = recipe.actuals;
    const aOG  = parseFloat(a.og)       || null;
    const aFG  = parseFloat(a.fg)       || null;
    const aVol = parseFloat(a.batchVol) || null;
    const aPB  = parseFloat(a.preBoilOG)|| null;
    const actualABV = aOG && aFG ? (aOG - aFG) * 131.25 : null;
    const totalGrainPts = recipe.grains.reduce((s,g)=>s+(parseFloat(g.lbs)||0)*g.ppg, 0);
    const actualEff = (aOG && aVol && totalGrainPts > 0)
      ? ((aOG - 1)*1000 * aVol / totalGrainPts * 100)
      : null;
    return { actualABV, actualEff, aOG, aFG, aVol, aPB };
  },[recipe.actuals, recipe.grains]);

  // ── Grain ops ──
  const addGrain    = ()=>upRecipe({grains:[...recipe.grains,{id:uid(),name:"2-Row Pale",ppg:37,color:1.8,lbs:"1"}]});
  const removeGrain = id=>upRecipe({grains:recipe.grains.filter(x=>x.id!==id)});
  const upGrain     = (id,f,v)=>upRecipe({grains:recipe.grains.map(x=>x.id===id?{...x,[f]:v}:x)});
  const setGrainP   = (id,name)=>{
    const p=MALTS.find(m=>m.name===name);
    if(p) upRecipe({grains:recipe.grains.map(x=>x.id===id?{...x,name:p.name,ppg:p.ppg,color:p.color}:x)});
  };

  // ── Hop ops ──
  const addHop    = ()=>upRecipe({hops:[...recipe.hops,{id:uid(),name:"Cascade",aa:"5.5",oz:"1.0",time:"60",type:"Boil"}]});
  const removeHop = id=>upRecipe({hops:recipe.hops.filter(x=>x.id!==id)});
  const upHop     = (id,f,v)=>upRecipe({hops:recipe.hops.map(x=>x.id===id?{...x,[f]:v}:x)});
  const setHopP   = (id,name)=>{
    const p=HOPS.find(h=>h.name===name);
    if(p) upRecipe({hops:recipe.hops.map(x=>x.id===id?{...x,name:p.name,aa:String(p.aa)}:x)});
  };

  // ── Actuals update ──
  const upActuals = (f,v)=>upRecipe({actuals:{...recipe.actuals,[f]:v}});

  // ── Auto-save (debounced) ──
  useEffect(()=>{
    if(!dirty) return;
    const t = setTimeout(async()=>{
      await persistRecipe(recipe);
      const newIdx = index.some(x=>x.id===recipe.id)
        ? index.map(x=>x.id===recipe.id?{id:recipe.id,name:recipe.name,style:recipe.style,updatedAt:recipe.updatedAt}:x)
        : [{id:recipe.id,name:recipe.name,style:recipe.style,updatedAt:recipe.updatedAt},...index];
      await saveIndex(newIdx);
      setIndex(newIdx);
      setDirty(false);
    }, 800);
    return ()=>clearTimeout(t);
  },[dirty, recipe]);

  // ── Save version ──
  const handleSaveVersion = async()=>{
    const vNum = (recipe.versions||[]).length + 1;
    const label = vLabel.trim() || `Version ${vNum}`;
    const version = {
      id: genId(),
      num: vNum,
      label,
      savedAt: Date.now(),
      snapshot: snapshotData(recipe),
    };
    const updated = {...recipe, versions:[...( recipe.versions||[]), version], updatedAt:Date.now()};
    setRecipe(updated);
    await persistRecipe(updated);
    setVLabel("");
    setShowSave(false);
    setSaveMsg(`Saved as "${label}"`);
    setTimeout(()=>setSaveMsg(""),3000);
  };

  // ── Load version ──
  const loadVersion = (version)=>{
    const s = version.snapshot;
    setRecipe(r=>({...r,...s,versions:r.versions,id:r.id,createdAt:r.createdAt}));
    setShowVersions(false);
    setDirty(true);
  };

  // ── New recipe ──
  const handleNewRecipe = async()=>{
    const r = blankRecipe();
    setRecipe(r);
    await persistRecipe(r);
    const newIdx = [{id:r.id,name:r.name,style:r.style,updatedAt:r.updatedAt},...index];
    await saveIndex(newIdx);
    setIndex(newIdx);
    setShowRecipes(false);
    setDirty(false);
  };

  // ── Load recipe ──
  const handleLoadRecipe = async(id)=>{
    const r = await loadRecipe(id);
    if(r){ setRecipe(r); setDirty(false); setShowRecipes(false); }
  };

  // ── Delete recipe ──
  const handleDeleteRecipe = async(id,e)=>{
    e.stopPropagation();
    await deleteRecipeStorage(id);
    const newIdx = index.filter(x=>x.id!==id);
    await saveIndex(newIdx);
    setIndex(newIdx);
    if(recipe.id===id){
      if(newIdx.length>0){ const r=await loadRecipe(newIdx[0].id); if(r) setRecipe(r); }
      else { const r=blankRecipe(); setRecipe(r); }
    }
  };

  const srmHex = srmToHex(stats.srm);
  const srmRgb = srmToRgb(stats.srm);
  const gap    = mobile?10:16;
  const pad    = mobile?12:20;

  const statItems = [
    {label:"OG",    val:stats.og.toFixed(3)},
    {label:"FG",    val:stats.fg.toFixed(3)},
    {label:"ABV",   val:stats.abv.toFixed(1)+"%"},
    {label:"IBU",   val:stats.ibu.toFixed(0)},
    {label:"SRM",   val:stats.srm.toFixed(1), srm:true},
    {label:"BU:GU", val:stats.bgu.toFixed(2)},
  ];

  const fmtGrav = v => isNaN(v)?"-":v.toFixed(3);
  const fmtPct  = v => isNaN(v)?"-":v.toFixed(1)+"%";
  const fmtVol  = v => isNaN(v)?"-":v.toFixed(2);

  return (
    <div style={{fontFamily:mono,background:C.bg,minHeight:"100vh",
      color:C.cream,padding:`${pad}px`,boxSizing:"border-box"}}>

      {/* ── Header ── */}
      <div style={{marginBottom:gap+4}}>
        <div style={{fontSize:9,color:C.amberDim,letterSpacing:"0.2em",
          textTransform:"uppercase",marginBottom:6}}>HOMEBREW RECIPE BUILDER</div>

        {/* Title row */}
        <div style={{display:"flex",gap:8,alignItems:"flex-end",marginBottom:10,flexWrap:"wrap"}}>
          <input value={recipe.name} onChange={e=>upRecipe({name:e.target.value})}
            style={{background:"transparent",border:"none",
              borderBottom:`1px solid ${C.borderLt}`,borderRadius:0,
              color:C.cream,padding:"4px 0 6px",
              fontSize:mobile?22:28,flex:1,minWidth:0,
              fontFamily:serif,fontWeight:700,outline:"none"}}/>
          {/* Action buttons */}
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <Btn onClick={()=>setShowRecipes(true)} variant="ghost" sx={{fontSize:11}}>
              ☰ Recipes {index.length>0?`(${index.length})`:""}
            </Btn>
            <Btn onClick={()=>setShowSave(true)} variant="green" sx={{fontSize:11}}>
              ⊕ Save Version
            </Btn>
          </div>
        </div>

        {/* Style + version row */}
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{flex:"1 1 180px"}}>
            <Sel value={recipe.style} onChange={e=>upRecipe({style:e.target.value})}>
              {STYLES.map(s=><option key={s}>{s}</option>)}
            </Sel>
          </div>
          {(recipe.versions||[]).length>0 && (
            <Btn onClick={()=>setShowVersions(true)} variant="ghost" sx={{fontSize:11,flexShrink:0}}>
              ⏱ {recipe.versions.length} version{recipe.versions.length!==1?"s":""}
            </Btn>
          )}
          {saveMsg && (
            <span style={{fontSize:11,color:C.green,fontFamily:mono,
              padding:"4px 10px",border:`1px solid ${C.green}`,borderRadius:4}}>
              ✓ {saveMsg}
            </span>
          )}
          {dirty && !saveMsg && (
            <span style={{fontSize:10,color:C.faint,fontFamily:mono}}>● unsaved</span>
          )}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{display:"grid",
        gridTemplateColumns:mobile?"1fr 1fr 1fr":"repeat(6,1fr)",
        background:C.surface,border:`1px solid ${C.border}`,
        borderRadius:6,overflow:"hidden",marginBottom:gap}}>
        {statItems.map((s,i)=>{
          const rb = mobile?(i%3<2?`1px solid ${C.border}`:"none"):(i<5?`1px solid ${C.border}`:"none");
          const bb = mobile&&i<3?`1px solid ${C.border}`:"none";
          return (
            <div key={s.label} style={{padding:mobile?"12px 4px":"14px 6px",
              textAlign:"center",borderRight:rb,borderBottom:bb}}>
              <div style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",
                textTransform:"uppercase",marginBottom:5}}>{s.label}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                {s.srm&&<div style={{width:9,height:9,borderRadius:"50%",
                  background:srmHex,flexShrink:0,boxShadow:`0 0 5px ${srmHex}`}}/>}
                <span style={{fontSize:mobile?16:20,fontWeight:700,
                  color:C.amber,fontFamily:mono}}>{s.val}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Batch settings ── */}
      <Card sx={{marginBottom:gap}}>
        <SHead>Batch Settings</SHead>
        <div style={{display:"grid",
          gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:10}}>
          <div><Label>Batch Size (gal)</Label>
            <Inp value={recipe.batchSize} step={0.25} onChange={v=>upRecipe({batchSize:v})}/></div>
          <div><Label>Mash Efficiency (%)</Label>
            <Inp value={recipe.efficiency} step={1} onChange={v=>upRecipe({efficiency:v})}/></div>
          <div><Label>Total Grain (lbs)</Label>
            <RO>{stats.lbs.toFixed(2)}</RO></div>
          <div><Label>Pre-Boil OG (est)</Label>
            <RO>{stats.preboilOG.toFixed(3)}</RO></div>
        </div>
      </Card>

      {/* ── Grain Bill ── */}
      <Card sx={{marginBottom:gap}}>
        <div style={{display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:14}}>
          <SHead>Grain Bill</SHead>
          <Btn onClick={addGrain} sx={{fontSize:11}}>+ Add Malt</Btn>
        </div>
        {!mobile&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 50px 44px",
            gap:6,marginBottom:8}}>
            {["Malt / Grain","Lbs","PPG","°L",""].map((h,i)=>(
              <div key={i} style={{fontSize:9,color:C.faint,letterSpacing:"0.1em",
                textTransform:"uppercase",textAlign:i>0?"center":"left"}}>{h}</div>
            ))}
          </div>
        )}
        {recipe.grains.map(g=>{
          const pct = stats.lbs>0?(parseFloat(g.lbs)||0)/stats.lbs*100:0;
          const pts = (parseFloat(g.lbs)||0)*g.ppg*((parseFloat(recipe.efficiency)||75)/100)/stats.bs;
          return (
            <div key={g.id} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
              <div style={mobile?{display:"flex",gap:6,marginBottom:6}
                :{display:"grid",gridTemplateColumns:"1fr 70px 50px 50px 44px",gap:6,alignItems:"center"}}>
                <Sel value={g.name} onChange={e=>setGrainP(g.id,e.target.value)}
                  sx={mobile?{flex:1}:{}}>
                  {MALTS.map(m=><option key={m.name}>{m.name}</option>)}
                </Sel>
                {!mobile&&<>
                  <Inp value={g.lbs} step={0.25} onChange={v=>upGrain(g.id,"lbs",v)} sx={{textAlign:"right"}}/>
                  <Inp value={g.ppg} step={1} onChange={v=>upGrain(g.id,"ppg",parseFloat(v)||0)} sx={{textAlign:"right"}}/>
                  <Inp value={g.color} step={1} onChange={v=>upGrain(g.id,"color",parseFloat(v)||0)} sx={{textAlign:"right"}}/>
                </>}
                <XBtn onClick={()=>removeGrain(g.id)}/>
              </div>
              {mobile&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:6}}>
                  <div><Label>Lbs</Label><Inp value={g.lbs} step={0.25} onChange={v=>upGrain(g.id,"lbs",v)}/></div>
                  <div><Label>PPG</Label><Inp value={g.ppg} step={1} onChange={v=>upGrain(g.id,"ppg",parseFloat(v)||0)}/></div>
                  <div><Label>°L</Label><Inp value={g.color} step={1} onChange={v=>upGrain(g.id,"color",parseFloat(v)||0)}/></div>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <div style={{flex:1,height:mobile?3:2,background:C.faint,borderRadius:2}}>
                  <div style={{height:"100%",width:`${pct}%`,background:C.amberDim,
                    borderRadius:2,transition:"width 0.2s"}}/>
                </div>
                <span style={{fontSize:10,color:C.muted,whiteSpace:"nowrap"}}>
                  {pct.toFixed(0)}% · {pts.toFixed(1)} pts
                </span>
              </div>
            </div>
          );
        })}
        {recipe.grains.length===0&&<div style={{textAlign:"center",color:C.faint,
          padding:"20px 0",fontSize:13}}>No grains added</div>}
      </Card>

      {/* ── Hop Schedule ── */}
      <Card sx={{marginBottom:gap}}>
        <div style={{display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:14}}>
          <SHead>Hop Schedule</SHead>
          <Btn onClick={addHop} sx={{fontSize:11}}>+ Add Hop</Btn>
        </div>
        {!mobile&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 52px 50px 50px 88px 44px",
            gap:6,marginBottom:8}}>
            {["Variety","AA%","oz","Min","Type",""].map((h,i)=>(
              <div key={i} style={{fontSize:9,color:C.faint,letterSpacing:"0.1em",
                textTransform:"uppercase",textAlign:i>0?"center":"left"}}>{h}</div>
            ))}
          </div>
        )}
        {recipe.hops.map(h=>{
          const isDH = h.type==="Dry Hop";
          const mins = h.type==="Whirlpool"?15:(parseFloat(h.time)||0);
          const hopIBU = isDH?0:tinsethIBU(parseFloat(h.aa)||0,parseFloat(h.oz)||0,mins,stats.ogPts,stats.bs);
          return (
            <div key={h.id} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
              <div style={mobile?{display:"flex",gap:6,marginBottom:6}
                :{display:"grid",gridTemplateColumns:"1fr 52px 50px 50px 88px 44px",gap:6,alignItems:"center"}}>
                <Sel value={h.name} onChange={e=>setHopP(h.id,e.target.value)} sx={mobile?{flex:1}:{}}>
                  {HOPS.map(hp=><option key={hp.name}>{hp.name}</option>)}
                </Sel>
                {!mobile&&<>
                  <Inp value={h.aa} step={0.5} onChange={v=>upHop(h.id,"aa",v)} sx={{textAlign:"right"}}/>
                  <Inp value={h.oz} step={0.25} onChange={v=>upHop(h.id,"oz",v)} sx={{textAlign:"right"}}/>
                  <Inp value={h.time} step={5} disabled={isDH} onChange={v=>upHop(h.id,"time",v)} sx={{textAlign:"right"}}/>
                  <Sel value={h.type} onChange={e=>upHop(h.id,"type",e.target.value)}>
                    {["Boil","Whirlpool","Dry Hop"].map(t=><option key={t}>{t}</option>)}
                  </Sel>
                </>}
                <XBtn onClick={()=>removeHop(h.id)}/>
              </div>
              {mobile&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1.3fr",gap:6,marginBottom:4}}>
                  <div><Label>AA%</Label><Inp value={h.aa} step={0.5} onChange={v=>upHop(h.id,"aa",v)}/></div>
                  <div><Label>oz</Label><Inp value={h.oz} step={0.25} onChange={v=>upHop(h.id,"oz",v)}/></div>
                  <div><Label>Min</Label><Inp value={h.time} step={5} disabled={isDH} onChange={v=>upHop(h.id,"time",v)}/></div>
                  <div><Label>Type</Label>
                    <Sel value={h.type} onChange={e=>upHop(h.id,"type",e.target.value)}>
                      {["Boil","Whirlpool","Dry Hop"].map(t=><option key={t}>{t}</option>)}
                    </Sel>
                  </div>
                </div>
              )}
              <div style={{fontSize:10,textAlign:"right",
                color:isDH?C.faint:C.muted,marginTop:mobile?0:3}}>
                {isDH?"aroma only":`${hopIBU.toFixed(1)} IBU`}
              </div>
            </div>
          );
        })}
        {recipe.hops.length===0&&<div style={{textAlign:"center",color:C.faint,
          padding:"20px 0",fontSize:13}}>No hops added</div>}
      </Card>

      {/* ── Yeast ── */}
      <Card sx={{marginBottom:gap}}>
        <SHead>Yeast</SHead>
        <div style={{marginBottom:10}}>
          <Label>Strain</Label>
          <Sel value={recipe.yeast.name}
            onChange={e=>{const p=YEASTS.find(y=>y.name===e.target.value);if(p)upRecipe({yeast:p});}}>
            {YEASTS.map(y=><option key={y.name}>{y.name}</option>)}
          </Sel>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <div><Label>Attenuation (%)</Label>
            <input type="number" value={recipe.yeast.atten} step={1}
              onChange={e=>upRecipe({yeast:{...recipe.yeast,atten:parseInt(e.target.value)||0}})}
              style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,
                color:C.cream,padding:"10px",fontSize:15,fontFamily:mono,outline:"none",
                width:"100%",boxSizing:"border-box",minHeight:44}}/></div>
          <div><Label>Flocculation</Label><RO sx={{fontSize:13}}>{recipe.yeast.floc??"—"}</RO></div>
          <div><Label>Temp Range</Label><RO sx={{fontSize:12}}>{recipe.yeast.temp??"—"}</RO></div>
        </div>
      </Card>

      {/* ── Actuals ── */}
      <Card sx={{marginBottom:gap,border:`1px solid ${C.green}22`}}>
        <SHead>Brew Day Actuals</SHead>

        {/* Entry fields */}
        <div style={{display:"grid",
          gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
          <div><Label>Brew Date</Label>
            <input type="date" value={recipe.actuals.brewDate}
              onChange={e=>upActuals("brewDate",e.target.value)}
              style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,
                color:C.cream,padding:"10px",fontSize:14,fontFamily:mono,outline:"none",
                width:"100%",boxSizing:"border-box",minHeight:44,colorScheme:"dark"}}/></div>
          <div><Label>Pre-Boil Volume (gal)</Label>
            <Inp value={recipe.actuals.preBoilVol} step={0.25}
              onChange={v=>upActuals("preBoilVol",v)}/></div>
          <div><Label>Pre-Boil OG (measured)</Label>
            <Inp value={recipe.actuals.preBoilOG} step={0.001}
              onChange={v=>upActuals("preBoilOG",v)}/></div>
          <div><Label>Batch Volume into Fermenter</Label>
            <Inp value={recipe.actuals.batchVol} step={0.25}
              onChange={v=>upActuals("batchVol",v)}/></div>
          <div><Label>OG (measured)</Label>
            <Inp value={recipe.actuals.og} step={0.001}
              onChange={v=>upActuals("og",v)}/></div>
          <div><Label>FG (measured)</Label>
            <Inp value={recipe.actuals.fg} step={0.001}
              onChange={v=>upActuals("fg",v)}/></div>
          {actualStats.actualEff!==null&&(
            <div><Label>Actual Efficiency</Label>
              <RO sx={{color:C.green,fontWeight:700}}>{actualStats.actualEff.toFixed(1)}%</RO></div>
          )}
          {actualStats.actualABV!==null&&(
            <div><Label>Actual ABV</Label>
              <RO sx={{color:C.green,fontWeight:700}}>{actualStats.actualABV.toFixed(2)}%</RO></div>
          )}
        </div>

        {/* Comparison table */}
        <div style={{fontSize:9,color:C.green,letterSpacing:"0.12em",
          textTransform:"uppercase",fontWeight:700,marginBottom:12,
          fontFamily:mono,opacity:0.8}}>Target vs Actual Comparison</div>

        <CompRow mobile={mobile} label="Pre-Boil OG"
          target={stats.preboilOG} actual={recipe.actuals.preBoilOG}
          fmt={v=>v.toFixed(3)}/>
        <CompRow mobile={mobile} label="OG"
          target={stats.og} actual={recipe.actuals.og}
          fmt={v=>v.toFixed(3)}/>
        <CompRow mobile={mobile} label="FG"
          target={stats.fg} actual={recipe.actuals.fg}
          fmt={v=>v.toFixed(3)}/>
        <CompRow mobile={mobile} label="ABV"
          target={stats.abv}
          actual={actualStats.actualABV!==null?actualStats.actualABV:""}
          fmt={v=>v.toFixed(2)} unit="%" />
        <CompRow mobile={mobile} label="Efficiency"
          target={parseFloat(recipe.efficiency)||75}
          actual={actualStats.actualEff!==null?actualStats.actualEff:""}
          fmt={v=>v.toFixed(1)} unit="%"/>
        <CompRow mobile={mobile} label="Batch Volume"
          target={stats.bs} actual={recipe.actuals.batchVol}
          fmt={v=>v.toFixed(2)} unit=" gal"/>

        {/* Actuals notes */}
        <div style={{marginTop:14}}>
          <Label>Brew Day Notes</Label>
          <textarea value={recipe.actuals.notes}
            onChange={e=>upActuals("notes",e.target.value)}
            placeholder="Mash temp, water chemistry, yeast pitch temp, lag time, fermentation observations..."
            style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,
              color:C.cream,padding:"10px",fontSize:13,fontFamily:mono,outline:"none",
              width:"100%",boxSizing:"border-box",height:80,resize:"vertical",lineHeight:1.55}}/>
        </div>
      </Card>

      {/* ── Recipe Notes ── */}
      <Card sx={{marginBottom:gap}}>
        <SHead>Recipe Notes</SHead>
        <textarea value={recipe.notes} onChange={e=>upRecipe({notes:e.target.value})}
          placeholder="Grain mill gap, mash schedule, hop stand details, adjuncts..."
          style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,
            color:C.cream,padding:"10px",fontSize:13,fontFamily:mono,outline:"none",
            width:"100%",boxSizing:"border-box",height:90,resize:"vertical",lineHeight:1.55}}/>
      </Card>

      {/* ── Color preview ── */}
      <Card>
        <SHead>Beer Color</SHead>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{flexShrink:0,width:38,height:56,borderRadius:"3px 3px 6px 6px",
            background:`linear-gradient(180deg,rgba(${srmRgb[0]},${srmRgb[1]},${srmRgb[2]},0.2) 0%,${srmHex} 100%)`,
            border:"1.5px solid rgba(255,255,255,0.1)",
            boxShadow:`0 0 14px rgba(${srmRgb[0]},${srmRgb[1]},${srmRgb[2]},0.4)`,overflow:"hidden"}}>
            <div style={{height:10,background:"rgba(255,252,240,0.85)",
              borderBottom:"1px solid rgba(255,252,240,0.3)"}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",height:18,borderRadius:3,overflow:"hidden",
              border:`1px solid ${C.border}`,marginBottom:5}}>
              {Array.from({length:40},(_,i)=>(
                <div key={i} style={{flex:1,background:srmToHex(i+1)}}/>
              ))}
            </div>
            <div style={{position:"relative",height:6,marginBottom:5}}>
              <div style={{position:"absolute",left:`${Math.min((stats.srm/40)*100,99)}%`,
                transform:"translateX(-50%)",width:2,height:6,background:C.cream,borderRadius:1}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",
              fontSize:10,color:C.muted,fontFamily:mono}}>
              <span>Pale Straw</span>
              <span style={{color:C.amberLt,fontWeight:700}}>SRM {stats.srm.toFixed(1)}</span>
              <span>Black</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{marginTop:16,textAlign:"center",fontSize:9,color:C.faint,
        letterSpacing:"0.14em",fontFamily:mono}}>
        IBU: TINSETH · SRM: MOREY · OG/FG: STANDARD GRAVITY · AUTO-SAVED
      </div>

      {/* ══ Modals ══════════════════════════════════════════════════════════ */}

      {/* Save Version */}
      {showSave&&(
        <Modal onClose={()=>setShowSave(false)} title="Save Version" width={400}>
          <div style={{marginBottom:12}}>
            <Label>Version Label (optional)</Label>
            <TextInp value={vLabel} onChange={setVLabel}
              placeholder={`Version ${(recipe.versions||[]).length+1} — e.g. "Brew Day 1" or "Adjusted hop schedule"`}/>
          </div>
          <div style={{fontSize:12,color:C.muted,fontFamily:mono,marginBottom:16,lineHeight:1.6}}>
            Saves a snapshot of the current recipe including all grain, hop, yeast, and actuals data. 
            You can restore any version later.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn onClick={()=>setShowSave(false)} variant="ghost">Cancel</Btn>
            <Btn onClick={handleSaveVersion} variant="green">Save Snapshot</Btn>
          </div>
        </Modal>
      )}

      {/* Version History */}
      {showVersions&&(
        <Modal onClose={()=>setShowVersions(false)} title="Version History" width={500}>
          {(recipe.versions||[]).length===0?(
            <div style={{textAlign:"center",color:C.faint,padding:"20px 0",fontSize:13}}>
              No saved versions yet.
            </div>
          ):(
            [...(recipe.versions||[])].reverse().map(v=>(
              <div key={v.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontFamily:serif,fontSize:15,color:C.cream,
                      fontWeight:700,marginBottom:4}}>{v.label}</div>
                    <div style={{fontSize:10,color:C.muted,fontFamily:mono}}>
                      {new Date(v.savedAt).toLocaleDateString("en-US",
                        {month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                    </div>
                    {v.snapshot.actuals?.brewDate&&(
                      <div style={{fontSize:10,color:C.green,fontFamily:mono,marginTop:2}}>
                        Brew date: {v.snapshot.actuals.brewDate}
                      </div>
                    )}
                  </div>
                  <Btn onClick={()=>loadVersion(v)} variant="ghost" sx={{fontSize:11}}>
                    Restore
                  </Btn>
                </div>
                {/* Mini stats preview */}
                {(()=>{
                  const s = calcStats(v.snapshot.grains,v.snapshot.hops,v.snapshot.yeast,
                    v.snapshot.batchSize,v.snapshot.efficiency);
                  return (
                    <div style={{display:"flex",gap:16,marginTop:8,fontSize:11,
                      color:C.muted,fontFamily:mono}}>
                      <span>OG {s.og.toFixed(3)}</span>
                      <span>ABV {s.abv.toFixed(1)}%</span>
                      <span>IBU {s.ibu.toFixed(0)}</span>
                      <span>SRM {s.srm.toFixed(1)}</span>
                    </div>
                  );
                })()}
              </div>
            ))
          )}
        </Modal>
      )}

      {/* Recipes List */}
      {showRecipes&&(
        <Modal onClose={()=>setShowRecipes(false)} title="My Recipes" width={480}>
          <div style={{marginBottom:14}}>
            <Btn onClick={handleNewRecipe} variant="green" sx={{width:"100%",
              justifyContent:"center",display:"flex",fontSize:13}}>
              + New Recipe
            </Btn>
          </div>
          {index.length===0?(
            <div style={{textAlign:"center",color:C.faint,padding:"20px 0",fontSize:13}}>
              No saved recipes.
            </div>
          ):(
            index.map(item=>(
              <div key={item.id}
                onClick={()=>handleLoadRecipe(item.id)}
                style={{padding:"12px",borderRadius:4,cursor:"pointer",
                  marginBottom:4,border:`1px solid ${recipe.id===item.id?C.amberDim:C.border}`,
                  background:recipe.id===item.id?C.amberGlow:C.elevated,
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:serif,fontSize:15,color:C.cream,
                    fontWeight:700,marginBottom:2}}>{item.name}</div>
                  <div style={{fontSize:11,color:C.muted,fontFamily:mono}}>
                    {item.style} · Updated {new Date(item.updatedAt).toLocaleDateString("en-US",
                      {month:"short",day:"numeric",year:"numeric"})}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {recipe.id===item.id&&(
                    <span style={{fontSize:9,color:C.amber,fontFamily:mono,
                      letterSpacing:"0.1em",textTransform:"uppercase"}}>Active</span>
                  )}
                  <button onClick={e=>handleDeleteRecipe(item.id,e)}
                    style={{background:"transparent",border:"none",color:C.faint,
                      cursor:"pointer",fontSize:16,lineHeight:1,padding:"4px 6px"}}
                    onMouseEnter={e=>e.currentTarget.style.color=C.red}
                    onMouseLeave={e=>e.currentTarget.style.color=C.faint}>
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </Modal>
      )}
    </div>
  );
}
