const { useState, useEffect, useMemo, useCallback } = React;
const { sLoad: _sLoad, sSave: _sSave, preloadCache } = window.RVStorage;

// ============================================================
// RUTAVERDE - APP COMBINADA (M1 Clientes + M2A Config/Pedidos)
// ============================================================

// Costa Rica Official Catalog
const CR={"San José":{"Central":["Carmen","Merced","Hospital","Catedral","Zapote","San Francisco De Dos Rios","Uruca","Mata Redonda","Pavas","Hatillo","San Sebastián"],"Escazú":["Escazú","San Antonio","San Rafael"],"Desamparados":["Desamparados","San Miguel","San Juan De Dios","San Rafael Arriba","San Rafael Abajo","San Antonio","Frailes","Patarra","San Cristobal","Rosario","Damas","Gravilias","Los Guido"],"Puriscal":["Santiago","Mercedes Sur","Barbacoas","Grifo Alto","San Rafael","Candelarita","Desamparaditos","San Antonio","Chires"],"Tarrazú":["San Marcos","San Lorenzo","San Carlos"],"Aserrí":["Aserrí","Tarbaca","Vuelta De Jorco","San Gabriel","Legua","Monterrey","Salitrillos"],"Mora":["Colón","Guayabo","Tabarcia","Piedras Negras","Picagres","Jaris"],"Goicoechea":["Guadalupe","San Francisco","Calle Blancos","Mata De Platano","Ipís","Rancho Redondo","Purral"],"Santa Ana":["Santa Ana","Salitral","Pozos","Uruca","Piedades","Brasil"],"Alajuelita":["Alajuelita","San Josecito","San Antonio","Concepción","San Felipe"],"Vázquez De Coronado":["San Isidro","San Rafael","Dulce Nombre De Jesus","Patalillo","Cascajal"],"Acosta":["San Ignacio","Guaitil","Palmichal","Cangrejal","Sabanillas"],"Tibás":["San Juan","Cinco Esquinas","Anselmo Llorente","Leon XII","Colima"],"Moravia":["San Vicente","San Jeronimo","La Trinidad"],"Montes De Oca":["San Pedro","Sabanilla","Mercedes","San Rafael"],"Turrubares":["San Pablo","San Pedro","San Juan De Mata","San Luis","Carara"],"Dota":["Santa María","Jardin","Copey"],"Curridabat":["Curridabat","Granadilla","Sanchez","Tirrases"],"Pérez Zeledón":["San Isidro De El General","El General","Daniel Flores","Rivas","San Pedro","Platanares","Pejibaye","Cajon","Baru","Rio Nuevo","Páramo"],"León Cortés Castro":["San Pablo","San Andres","Llano Bonito","San Isidro","Santa Cruz","San Antonio"]},"Alajuela":{"Central":["Alajuela","San José","Carrizal","San Antonio","Guácima","San Isidro","Sabanilla","San Rafael","Rio Segundo","Desamparados","Turrucares","Tambor","Garita","Sarapiquí"],"San Ramón":["San Ramón","Santiago","San Juan","Piedades Norte","Piedades Sur","San Rafael","San Isidro","Angeles","Alfaro","Volio","Concepción","Zapotal","Peñas Blancas"],"Grecia":["Grecia","San Isidro","San José","San Roque","Tacares","Rio Cuarto","Puente De Piedra","Bolivar"],"San Mateo":["San Mateo","Desmonte","Jesús María","Labrador"],"Atenas":["Atenas","Jesús","Mercedes","San Isidro","Concepción","San José","Santa Eulalia","Escobal"],"Naranjo":["Naranjo","San Miguel","San José","Cirrí Sur","San Jerónimo","San Juan","El Rosario","Palmitos"],"Palmares":["Palmares","Zaragoza","Buenos Aires","Santiago","Candelaria","Esquipulas","La Granja"],"Poás":["San Pedro","San Juan","San Rafael","Carrillos","Sabana Redonda"],"Orotina":["Orotina","El Mastate","Hacienda Vieja","Coyolar","La Ceiba"],"San Carlos":["Quesada","Florencia","Buenavista","Aguas Zarcas","Venecia","Pital","La Fortuna","La Tigra","La Palmera","Venado","Cutris","Monterrey","Pocosol"],"Zarcero":["Zarcero","Laguna","Tapesco","Guadalupe","Palmira","Zapote","Brisas"],"Sarchí":["Sarchí Norte","Sarchí Sur","Toro Amarillo","San Pedro","Rodriguez"],"Upala":["Upala","Aguas Claras","San José o Pizote","Bijagua","Delicias","Dos Rios","Yolillal","Canalete"],"Los Chiles":["Los Chiles","Caño Negro","El Amparo","San Jorge"],"Guatuso":["San Rafael","Buenavista","Cote","Katira"],"Río Cuarto":["Río Cuarto"]},"Cartago":{"Central":["Oriental","Occidental","Carmen","San Nicolás","Aguacaliente o San Francisco","Guadalupe o Arenilla","Corralillo","Tierra Blanca","Dulce Nombre","Llano Grande","Quebradilla"],"Paraíso":["Paraiso","Santiago","Orosi","Cachí","Llanos de Santa Lucía"],"La Unión":["Tres Rios","San Diego","San Juan","San Rafael","Concepción","Dulce Nombre","San Ramón","Rio Azul"],"Jiménez":["Juan Viñas","Tucurrique","Pejibaye"],"Turrialba":["Turrialba","La Suiza","Peralta","Santa Cruz","Santa Teresita","Pavones","Tuis","Tayutic","Santa Rosa","Tres Equis","La Isabel","Chirripó"],"Alvarado":["Pacayas","Cervantes","Capellades"],"Oreamuno":["San Rafael","Cot","Potrero Cerrado","Cipreses","Santa Rosa"],"El Guarco":["El Tejar","San Isidro","Tobosi","Patio De Agua"]},"Heredia":{"Central":["Heredia","Mercedes","San Francisco","Ulloa","Varablanca"],"Barva":["Barva","San Pedro","San Pablo","San Roque","Santa Lucía","San José de la Montaña"],"Santo Domingo":["Santo Domingo","San Vicente","San Miguel","Paracito","Santo Tomás","Santa Rosa","Tures","Para"],"Santa Barbara":["Santa Bárbara","San Pedro","San Juan","Jesús","Santo Domingo","Puraba"],"San Rafael":["San Rafael","San Josecito","Santiago","Los Ángeles","Concepción"],"San Isidro":["San Isidro","San José","Concepción","San Francisco"],"Belén":["San Antonio","La Ribera","La Asuncion"],"Flores":["San Joaquín","Barrantes","Llorente"],"San Pablo":["San Pablo","Rincon De Sabanilla"],"Sarapiquí":["Puerto Viejo","La Virgen","Las Horquetas","Llanuras Del Gaspar","Cureña"]},"Guanacaste":{"Liberia":["Liberia","Cañas Dulces","Mayorga","Nacascolo","Curubande"],"Nicoya":["Nicoya","Mansión","San Antonio","Quebrada Honda","Sámara","Nosara","Belén De Nosarita"],"Santa Cruz":["Santa Cruz","Bolson","Veintisiete de Abril","Tempate","Cartagena","Cuajiniquil","Diria","Cabo Velas","Tamarindo"],"Bagaces":["Bagaces","La Fortuna","Mogote","Rio Naranjo"],"Carrillo":["Filadelfia","Palmira","Sardinal","Belen"],"Cañas":["Cañas","Palmira","San Miguel","Bebedero","Porozal"],"Abangares":["Las Juntas","Sierra","San Juan","Colorado"],"Tilarán":["Tilarán","Quebrada Grande","Tronadora","Santa Rosa","Líbano","Tierras Morenas","Arenal"],"Nandayure":["Carmona","Santa Rita","Zapotal","San Pablo","Porvenir","Bejuco"],"La Cruz":["La Cruz","Santa Cecilia","La Garita","Santa Elena"],"Hojancha":["Hojancha","Monte Romo","Puerto Carrillo","Huacas"]},"Puntarenas":{"Central":["Puntarenas","Pitahaya","Chomes","Lepanto","Paquera","Manzanillo","Guacimal","Barranca","Monte Verde","Isla Del Coco","Cóbano","Chacarita","Chira","Acapulco","El Roble","Arancibia"],"Esparza":["Espíritu Santo","San Juan Grande","Macacona","San Rafael","San Jerónimo"],"Buenos Aires":["Buenos Aires","Volcán","Potrero Grande","Boruca","Pilas","Colinas","Changuena","Biolley","Brunka"],"Montes De Oro":["Miramar","La Unión","San Isidro"],"Osa":["Puerto Cortés","Palmar","Sierpe","Bahía Ballena","Piedras Blancas","Bahía Drake"],"Quepos":["Quepos","Savegre","Naranjito"],"Golfito":["Golfito","Puerto Jiménez","Guaycara","Pavón"],"Coto Brus":["San Vito","Sabalito","Aguabuena","Limoncito","Pittier"],"Parrita":["Parrita"],"Corredores":["Corredor","La Cuesta","Canoas","Laurel"],"Garabito":["Jacó","Tárcoles"]},"Limón":{"Central":["Limón","Valle La Estrella","Rio Blanco","Matama"],"Pococí":["Guapiles","Jiménez","Rita","Roxana","Cariari","Colorado","La Colonia"],"Siquirres":["Siquirres","Pacuarito","Florida","Germania","El Cairo","Alegría"],"Talamanca":["Bratsi","Sixaola","Cahuita","Telire"],"Matina":["Matina","Batán","Carrandi"],"Guácimo":["Guácimo","Mercedes","Pocora","Rio Jiménez","Duacari"]}};

const PROVINCES=Object.keys(CR).sort();
function getCantones(p){return p&&CR[p]?Object.keys(CR[p]).sort():[];}
function getDistritos(p,c){return p&&c&&CR[p]?.[c]?[...CR[p][c]].sort():[];}
function isValidLocation(p,c,d){if(!p)return true;if(!CR[p])return false;if(c&&!CR[p][c])return false;if(d&&c&&CR[p][c]&&!CR[p][c].includes(d))return false;return true;}

const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

// ============================================================
// HELPERS
// ============================================================
function norm(s){return(s||"").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}
function genId(pre){return pre+"-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

function buildCatalogLookup(){
  const pL={},cL={},dL={};
  for(const p of Object.keys(CR)){pL[norm(p)]=p;for(const c of Object.keys(CR[p])){cL[norm(p)+"|"+norm(c)]={provincia:p,canton:c};for(const d of CR[p][c])dL[norm(p)+"|"+norm(c)+"|"+norm(d)]={provincia:p,canton:c,distrito:d};}}
  return{pL,cL,dL};
}
const CAT=buildCatalogLookup();
function matchProvincia(r){return CAT.pL[norm(r)]||r;}
function matchCanton(rp,rc){const m=CAT.cL[norm(rp)+"|"+norm(rc)];return m?m.canton:rc;}
function matchLocation(rp,rc,rd){const p=matchProvincia(rp);const c=matchCanton(rp,rc);const dk=norm(rp)+"|"+norm(rc)+"|"+norm(rd);const m=CAT.dL[dk];return{provincia:p,canton:c,distrito:m?m.distrito:rd};}

function extractCoordsFromText(val){
  if(!val)return null;
  const s=val.trim();
  // Direct coords: "9.9342, -84.0875" or "9.9342 -84.0875"
  let m=s.match(/^(-?\d{1,3}\.\d{2,})[,\s]+(-?\d{1,3}\.\d{2,})$/);
  if(m)return{lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  // Google Maps long URL patterns
  m=s.match(/@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/);
  if(m)return{lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  m=s.match(/[?&]q=(-?\d{1,3}\.?\d*),(-?\d{1,3}\.?\d*)/);
  if(m)return{lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  m=s.match(/[?&]ll=(-?\d{1,3}\.?\d*),(-?\d{1,3}\.?\d*)/);
  if(m)return{lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  m=s.match(/\/(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})/);
  if(m)return{lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  // Fallback: any two decimal numbers
  m=s.match(/(-?\d{1,2}\.\d{3,})[,\s]+(-?\d{2,3}\.\d{3,})/);
  if(m)return{lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  return null;
}

function parseCSVLine(line,sep){
  const cols=[];let cur="",inQ=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(inQ&&i+1<line.length&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}else if(ch===sep&&!inQ){cols.push(cur.trim());cur="";}else cur+=ch;}
  cols.push(cur.trim());return cols;
}

function parseSeedTSV(tsv){
  return tsv.trim().split("\n").map(line=>{
    const[id,n,a,cl,t,co,p,ca,d,b,s,lat,lng]=line.split("|");
    return{id:(id||"").trim(),nombre:(n||"").trim(),apellidos:(a||"").trim(),cliente:(cl||"").trim(),telefono:(t||"").trim(),correo:(co||"").trim(),provincia:(p||"").trim(),canton:(ca||"").trim(),distrito:(d||"").trim(),barrio:(b||"").trim(),senas:(s||"").trim(),lat:lat?parseFloat(lat)||null:null,lng:lng?parseFloat(lng)||null:null};
  }).filter(c=>c.id);
}

// ============================================================
// M2B HELPERS
// ============================================================
function fmtTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
function parseTime(str) {
  if (!str) return 480;
  const parts = (str || "08:00").split(":");
  return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
}
const GMAP_KEY = "AIzaSyDn2NHIjLjJQ7PPTu49N0-T0AA53FPyjqY";
// Haversine distance in meters
function haversineM(lat1,lng1,lat2,lng2){
  const R=6371000,toR=Math.PI/180;
  const dLat=(lat2-lat1)*toR,dLng=(lng2-lng1)*toR;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*toR)*Math.cos(lat2*toR)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// Estimate drive time: haversine * 1.4 (road factor) / avg speed 40km/h
function estimateDriveMin(lat1,lng1,lat2,lng2){
  const dist=haversineM(lat1,lng1,lat2,lng2)*1.4;
  return (dist/1000)/40*60; // minutes
}

// Nearest-neighbor TSP optimization
function optimizeNearestNeighbor(origin,stops,dest){
  if(stops.length<=1)return{ordered:[...stops],totalDist:0};
  const remaining=stops.map((s,i)=>({...s,_oi:i}));
  const ordered=[];
  let cur={lat:origin.lat,lng:origin.lng};
  let totalDist=0;
  while(remaining.length>0){
    let bestIdx=0,bestDist=Infinity;
    for(let i=0;i<remaining.length;i++){
      const d=haversineM(cur.lat,cur.lng,remaining[i].lat,remaining[i].lng);
      if(d<bestDist){bestDist=d;bestIdx=i;}
    }
    totalDist+=bestDist;
    cur=remaining[bestIdx];
    ordered.push(remaining.splice(bestIdx,1)[0]);
  }
  totalDist+=haversineM(cur.lat,cur.lng,dest.lat,dest.lng);
  return{ordered,totalDist};
}

// 2-opt improvement
// OSRM Trip API — optimize waypoint order with real road distances
async function osrmOptimize(origin, stops, dest) {
  const allPts = [origin, ...stops, dest];
  const coords = allPts.map(p => p.lng + "," + p.lat).join(";");
  const url = "https://router.project-osrm.org/trip/v1/driving/" + coords +
    "?source=first&destination=last&roundtrip=false&overview=false&steps=false";
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("OSRM error: " + resp.status);
  const data = await resp.json();
  if (data.code !== "Ok") throw new Error("OSRM: " + (data.message || data.code));
  // Map waypoint_index to original stops
  const waypoints = data.waypoints;
  const stopOrder = [];
  for (let i = 1; i < waypoints.length - 1; i++) {
    stopOrder.push({ origIdx: i - 1, tripIdx: waypoints[i].waypoint_index });
  }
  stopOrder.sort((a, b) => a.tripIdx - b.tripIdx);
  const orderedStops = stopOrder.map(s => stops[s.origIdx]);
  const legs = data.trips[0].legs;
  return { orderedStops, legs };
}

function improve2Opt(origin,stops,dest){
  if(stops.length<3)return stops;
  const arr=[...stops];
  const pts=[origin,...arr,dest];
  const dist=(a,b)=>haversineM(a.lat,a.lng,b.lat,b.lng);
  let improved=true;
  while(improved){
    improved=false;
    for(let i=1;i<arr.length-1;i++){
      for(let j=i+1;j<arr.length;j++){
        const pi=i-1<0?origin:arr[i-1];
        const pj=j+1>=arr.length?dest:arr[j+1];
        const before=dist(pi,arr[i])+dist(arr[j],pj);
        const after=dist(pi,arr[j])+dist(arr[i],pj);
        if(after<before){
          const seg=arr.slice(i,j+1);seg.reverse();
          for(let k=0;k<seg.length;k++)arr[i+k]=seg[k];
          improved=true;
        }
      }
    }
  }
  return arr;
}

function loadLeaflet(){
  return new Promise((resolve,reject)=>{
    if(window.L)return resolve();
    // Load CSS
    if(!document.querySelector('link[href*="leaflet"]')){
      const css=document.createElement("link");
      css.rel="stylesheet";
      css.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);
    }
    // Load JS
    const existing=document.querySelector('script[src*="leaflet"]');
    if(existing){
      if(window.L)return resolve();
      existing.addEventListener("load",()=>resolve());
      setTimeout(()=>resolve(),3000);
      return;
    }
    const script=document.createElement("script");
    script.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload=()=>resolve();
    script.onerror=()=>reject(new Error("No se pudo cargar Leaflet"));
    document.head.appendChild(script);
  });
}

// ============================================================
// STORAGE
// ============================================================
const KEYS={clients:"rutaverde-clients-v1",drivers:"rutaverde-drivers-v1",pickups:"rutaverde-pickups-v1",routes:"rutaverde-routes-v2",orders:"rutaverde-orders-v1",optimized:"rutaverde-optimized-v1"};
async function sLoad(k){return _sLoad(k);}
async function sSave(k,d){return _sSave(k,d);}

// ============================================================
// STYLES
// ============================================================
const COLORS={bg:"#F7F5F0",card:"#FFFFFF",primary:"#2D6A4F",primaryLight:"#40916C",primaryDark:"#1B4332",accent:"#D4A373",accentLight:"#E9C46A",text:"#1a1a1a",textMuted:"#6b7280",border:"#e5e2dc",danger:"#dc2626",dangerBg:"#fef2f2",success:"#16a34a",successBg:"#f0fdf4",infoBg:"#eff6ff",info:"#2563eb",warnBg:"#fffbeb",warn:"#d97706"};
const font="'DM Sans',system-ui,sans-serif";
const mono="'Space Mono',monospace";

const S={
  app:{fontFamily:font,background:COLORS.bg,minHeight:"100vh",color:COLORS.text},
  header:{background:`linear-gradient(135deg,${COLORS.primaryDark},${COLORS.primary})`,color:"white",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  content:{padding:"20px 24px",maxWidth:1200,margin:"0 auto"},
  card:{background:COLORS.card,borderRadius:12,border:`1px solid ${COLORS.border}`,padding:"20px",marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"},
  btn:(v="primary")=>({padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.15s",...(v==="primary"?{background:COLORS.primary,color:"white"}:v==="outline"?{background:"transparent",color:COLORS.primary,border:`1.5px solid ${COLORS.primary}`}:v==="danger"?{background:COLORS.danger,color:"white"}:v==="accent"?{background:COLORS.accent,color:"white"}:{background:"#f3f4f6",color:COLORS.text})}),
  input:{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${COLORS.border}`,fontSize:14,fontFamily:font,width:"100%",boxSizing:"border-box",outline:"none"},
  select:{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${COLORS.border}`,fontSize:14,fontFamily:font,width:"100%",boxSizing:"border-box",background:"white"},
  label:{fontSize:12,fontWeight:600,color:COLORS.textMuted,marginBottom:4,display:"block"},
  badge:(c)=>({fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,background:c==="green"?COLORS.successBg:c==="red"?COLORS.dangerBg:c==="blue"?COLORS.infoBg:COLORS.warnBg,color:c==="green"?COLORS.success:c==="red"?COLORS.danger:c==="blue"?COLORS.info:COLORS.warn}),
  stat:{textAlign:"center",padding:"12px"},
  statNum:{fontSize:28,fontWeight:800,color:COLORS.primary,fontFamily:mono},
  statLabel:{fontSize:11,color:COLORS.textMuted,fontWeight:600,marginTop:2},
  table:{width:"100%",borderCollapse:"collapse",fontSize:13},
  th:{textAlign:"left",padding:"8px 10px",borderBottom:`2px solid ${COLORS.border}`,fontSize:11,fontWeight:700,color:COLORS.textMuted,textTransform:"uppercase",letterSpacing:"0.5px"},
  td:{padding:"8px 10px",borderBottom:`1px solid ${COLORS.border}`},
  tabs:{display:"flex",gap:4,marginBottom:16,borderBottom:`2px solid ${COLORS.border}`,paddingBottom:0,flexWrap:"wrap"},
  tab:(a)=>({padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600,borderBottom:a?`3px solid ${COLORS.primary}`:"3px solid transparent",color:a?COLORS.primary:COLORS.textMuted,background:"none",border:"none",fontFamily:font,marginBottom:-2}),
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000},
  modalContent:{background:"white",borderRadius:16,padding:"24px",width:"90%",maxWidth:650,maxHeight:"85vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"},
  chip:(a)=>({padding:"4px 10px",borderRadius:16,fontSize:11,fontWeight:600,cursor:"pointer",border:`1px solid ${a?COLORS.primary:COLORS.border}`,background:a?"#e8f5e9":"white",color:a?COLORS.primary:COLORS.textMuted,transition:"all 0.15s"}),
};

// ============================================================
// SHARED COMPONENTS
// ============================================================
function LocationSelector({provincia,canton,distrito,onChange,showTodos}){
  const cantones=getCantones(provincia);const distritos=getDistritos(provincia,canton);
  return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
    <div><label style={S.label}>Provincia</label><select style={S.select} value={provincia||""} onChange={e=>onChange({provincia:e.target.value,canton:"",distrito:""})}><option value="">-- Seleccionar --</option>{PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
    <div><label style={S.label}>Cantón</label><select style={S.select} value={canton||""} onChange={e=>onChange({provincia,canton:e.target.value,distrito:""})} disabled={!provincia}><option value="">-- Seleccionar --</option>{cantones.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
    <div><label style={S.label}>Distrito</label><select style={S.select} value={distrito||""} onChange={e=>onChange({provincia,canton,distrito:e.target.value})} disabled={!canton}><option value="">{showTodos?"Todos":"-- Seleccionar --"}</option>{distritos.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
  </div>);
}

function CoordInput({lat,lng,onChange}){
  const [paste,setPaste]=useState("");
  const [latStr,setLatStr]=useState(lat!=null?String(lat):"");
  const [lngStr,setLngStr]=useState(lng!=null?String(lng):"");
  useEffect(()=>{setLatStr(lat!=null?String(lat):"");},[lat]);
  useEffect(()=>{setLngStr(lng!=null?String(lng):"");},[lng]);
  const handlePaste=(val)=>{setPaste(val);const c=extractCoordsFromText(val);if(c){onChange(c);setLatStr(String(c.lat));setLngStr(String(c.lng));}};
  const isCoordChar=(s)=>/^-?\d*\.?\d*$/.test(s);
  const handleLatStr=(val)=>{if(val!==""&&!isCoordChar(val))return;setLatStr(val);if(val==="")onChange({lat:null,lng});else{const n=parseFloat(val);if(!isNaN(n))onChange({lat:n,lng});}};
  const handleLngStr=(val)=>{if(val!==""&&!isCoordChar(val))return;setLngStr(val);if(val==="")onChange({lat,lng:null});else{const n=parseFloat(val);if(!isNaN(n))onChange({lat,lng:n});}};
  return(<div>
    <label style={S.label}>Coordenadas GPS</label>
    <div style={{marginBottom:8}}><input style={S.input} placeholder="Pegar coordenadas (ej: 9.9342, -84.0875) o link de Google Maps..." value={paste} onChange={e=>handlePaste(e.target.value)}/>
    {paste&&!extractCoordsFromText(paste)&&<div style={{fontSize:11,color:COLORS.warn,marginTop:2}}>No se detectaron coordenadas</div>}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,alignItems:"end"}}>
      <div><label style={S.label}>Latitud</label><input style={S.input} value={latStr} placeholder="9.9342" onChange={e=>handleLatStr(e.target.value)}/></div>
      <div><label style={S.label}>Longitud</label><input style={S.input} value={lngStr} placeholder="-84.0875" onChange={e=>handleLngStr(e.target.value)}/></div>
      <div>{lat!=null&&lng!=null&&<a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer" style={{...S.btn("outline"),textDecoration:"none",fontSize:12}}>Ver en Maps</a>}</div>
    </div>
  </div>);
}

// ============================================================
// MODULE 1: CLIENTES
// ============================================================
function ClientForm({client,onSave,onCancel,existingIds}){
  const[form,setForm]=useState(client||{id:"",nombre:"",apellidos:"",cliente:"",telefono:"",correo:"",provincia:"",canton:"",distrito:"",barrio:"",senas:"",lat:null,lng:null});
  const[error,setError]=useState("");
  const isNew=!client;
  const handleChange=(f,v)=>{const u={...form,[f]:v};if(f==="nombre"||f==="apellidos")u.cliente=`${f==="nombre"?v:form.nombre} ${f==="apellidos"?v:form.apellidos}`.trim();setForm(u);};
  const handleSave=()=>{if(!form.id.trim())return setError("ID es requerido");if(!form.nombre.trim())return setError("Nombre es requerido");if(isNew&&existingIds.has(form.id.trim()))return setError(`ID "${form.id}" ya existe`);onSave({...form,id:form.id.trim()});};
  const field=(l,f,ph)=>(<div><label style={S.label}>{l}</label><input style={S.input} value={form[f]||""} placeholder={ph} onChange={e=>handleChange(f,e.target.value)}/></div>);
  return(<div>
    <h3 style={{margin:"0 0 16px",fontSize:18}}>{isNew?"Nuevo Cliente":"Editar Cliente"}</h3>
    {error&&<div style={{...S.badge("red"),marginBottom:12,display:"block",padding:"8px 12px",fontSize:13}}>{error}</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 2fr",gap:10,marginBottom:12}}>{field("ID Cliente","id","ej: 1-JPA")}{field("Nombre","nombre","Juan")}{field("Apellidos","apellidos","Pérez")}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>{field("Teléfono","telefono","88881234")}{field("Correo","correo","correo@ejemplo.com")}</div>
    <div style={{marginBottom:12}}><LocationSelector provincia={form.provincia} canton={form.canton} distrito={form.distrito} onChange={({provincia,canton,distrito})=>setForm(f=>({...f,provincia,canton,distrito}))}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>{field("Barrio","barrio","Nombre del barrio")}{field("Señas","senas","Casa blanca portón negro...")}</div>
    <div style={{marginBottom:16}}><CoordInput lat={form.lat} lng={form.lng} onChange={({lat,lng})=>setForm(f=>({...f,lat:lat??f.lat,lng:lng??f.lng}))}/></div>
    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button style={S.btn("ghost")} onClick={onCancel}>Cancelar</button><button style={S.btn("primary")} onClick={handleSave}>{isNew?"Crear Cliente":"Guardar Cambios"}</button></div>
  </div>);
}

function ImportDiff({newClients,existingClients,onConfirm,onCancel,unmatchedLocations}){
  const eMap=useMemo(()=>{const m=new Map();existingClients.forEach(c=>m.set(c.id,c));return m;},[existingClients]);
  const added=newClients.filter(c=>!eMap.has(c.id));
  const duplicates=newClients.filter(c=>eMap.has(c.id));
  const fieldsDiffer=(a,b)=>["nombre","apellidos","cliente","telefono","correo","provincia","canton","distrito","barrio","senas"].some(f=>norm(a[f])!==norm(b[f]));
  const changed=duplicates.filter(nc=>fieldsDiffer(nc,eMap.get(nc.id)));
  const unchanged=duplicates.filter(nc=>!fieldsDiffer(nc,eMap.get(nc.id)));
  const[upd,setUpd]=useState(new Set());
  const toggle=(id)=>setUpd(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  return(<div>
    <h3 style={{margin:"0 0 16px",fontSize:18}}>Resultado de Importación</h3>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
      <div style={{...S.card,marginBottom:0,background:COLORS.successBg,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:COLORS.success}}>{added.length}</div><div style={{fontSize:12,color:COLORS.success,fontWeight:600}}>Nuevos</div></div>
      <div style={{...S.card,marginBottom:0,background:COLORS.warnBg,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:COLORS.warn}}>{changed.length}</div><div style={{fontSize:12,color:COLORS.warn,fontWeight:600}}>Con cambios</div></div>
      <div style={{...S.card,marginBottom:0,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:COLORS.textMuted}}>{unchanged.length}</div><div style={{fontSize:12,color:COLORS.textMuted,fontWeight:600}}>Sin cambios</div></div>
    </div>
    {unmatchedLocations?.length>0&&<div style={{marginBottom:12,padding:12,background:COLORS.warnBg,borderRadius:8,fontSize:12,color:COLORS.warn}}><strong>{unmatchedLocations.length} con ubicación no encontrada en catálogo.</strong> {unmatchedLocations.slice(0,5).map(u=>u.id).join(", ")}{unmatchedLocations.length>5?"...":""}</div>}
    {added.length>0&&<div style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:COLORS.success,marginBottom:6}}>Se agregarán {added.length} clientes nuevos</div><div style={{fontSize:12,color:COLORS.textMuted,maxHeight:80,overflow:"auto"}}>{added.slice(0,10).map(c=>c.cliente||c.id).join(", ")}{added.length>10?` y ${added.length-10} más...`:""}</div></div>}
    {changed.length>0&&<div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:13,fontWeight:700,color:COLORS.warn}}>{changed.length} con diferencias</div><div style={{display:"flex",gap:6}}><button style={{...S.btn("ghost"),fontSize:11,padding:"4px 8px"}} onClick={()=>setUpd(new Set(changed.map(c=>c.id)))}>Todos</button><button style={{...S.btn("ghost"),fontSize:11,padding:"4px 8px"}} onClick={()=>setUpd(new Set())}>Ninguno</button></div></div>
      <div style={{maxHeight:200,overflow:"auto",border:`1px solid ${COLORS.border}`,borderRadius:8}}>{changed.map(nc=>{const ec=eMap.get(nc.id);const diffs=["nombre","apellidos","cliente","telefono","correo","provincia","canton","distrito","barrio","senas"].filter(f=>norm(nc[f])!==norm(ec[f]));return(<div key={nc.id} style={{padding:"8px 12px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:8,fontSize:12,background:upd.has(nc.id)?COLORS.warnBg:"white",cursor:"pointer"}} onClick={()=>toggle(nc.id)}><input type="checkbox" checked={upd.has(nc.id)} onChange={()=>toggle(nc.id)}/><div><div style={{fontWeight:600}}>{nc.cliente||nc.id}</div><div style={{color:COLORS.textMuted,fontSize:11}}>Cambios: {diffs.join(", ")}</div></div></div>);})}</div>
    </div>}
    <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}><button style={S.btn("ghost")} onClick={onCancel}>Cancelar</button><button style={S.btn("primary")} onClick={()=>onConfirm(added,changed.filter(c=>upd.has(c.id)))}>Importar ({added.length} nuevos{upd.size>0?` + ${upd.size} actualizados`:""})</button></div>
  </div>);
}

function ClientsModule({clients,updateClients}){
  const[tab,setTab]=useState("list");const[search,setSearch]=useState("");const[filterProv,setFilterProv]=useState("");const[filterCanton,setFilterCanton]=useState("");
  const[editClient,setEditClient]=useState(null);const[showModal,setShowModal]=useState(false);const[importData,setImportData]=useState(null);const[unmatchedLocs,setUnmatchedLocs]=useState([]);
  const[msg,setMsg]=useState(null);const[deleteConfirm,setDeleteConfirm]=useState(null);const[selectedIds,setSelectedIds]=useState(new Set());
  const[visibleCount,setVisibleCount]=useState(100);const[dataFilter,setDataFilter]=useState("");const[backupClients,setBackupClients]=useState(null);

  const qualityCounts=useMemo(()=>{let notel=0,nodir=0,nogps=0,badzone=0;clients.forEach(c=>{if(!c.telefono)notel++;if(!c.senas&&!c.barrio)nodir++;if(!c.lat||!c.lng)nogps++;if(c.provincia&&!isValidLocation(c.provincia,c.canton,c.distrito))badzone++;});return{notel,nodir,nogps,badzone};},[clients]);
  const filtered=useMemo(()=>{let list=clients;if(search){const q=search.toLowerCase();list=list.filter(c=>c.id?.toLowerCase().includes(q)||c.cliente?.toLowerCase().includes(q)||c.telefono?.includes(q)||c.correo?.toLowerCase().includes(q)||c.barrio?.toLowerCase().includes(q)||c.canton?.toLowerCase().includes(q));}if(filterProv)list=list.filter(c=>c.provincia===filterProv);if(filterCanton)list=list.filter(c=>c.canton===filterCanton);if(dataFilter==="notel")list=list.filter(c=>!c.telefono);if(dataFilter==="nodir")list=list.filter(c=>!c.senas&&!c.barrio);if(dataFilter==="nogps")list=list.filter(c=>!c.lat||!c.lng);if(dataFilter==="badzone")list=list.filter(c=>c.provincia&&!isValidLocation(c.provincia,c.canton,c.distrito));return list;},[clients,search,filterProv,filterCanton,dataFilter]);
  useEffect(()=>{setVisibleCount(100);},[search,filterProv,filterCanton,dataFilter]);
  const stats=useMemo(()=>({total:clients.length,provs:new Set(clients.map(c=>c.provincia).filter(Boolean)).size,cantons:new Set(clients.map(c=>`${c.provincia}|${c.canton}`).filter(x=>!x.startsWith("|"))).size,withPhone:clients.filter(c=>c.telefono).length,withAddr:clients.filter(c=>c.senas||c.barrio).length,withCoords:clients.filter(c=>c.lat&&c.lng).length}),[clients]);
  const filterCantones=useMemo(()=>filterProv?[...new Set(clients.filter(c=>c.provincia===filterProv).map(c=>c.canton).filter(Boolean))].sort():[]  ,[clients,filterProv]);
  const existingIds=useMemo(()=>new Set(clients.map(c=>c.id)),[clients]);

  const downloadTemplate=()=>{const csv="﻿ID Cliente;Nombre;Apellidos;Telefono;Correo;Provincia;Canton;Distrito;Barrio;Senas;Latitud;Longitud\n1-JPA;Juan;Perez;88881234;juan@mail.com;San Jose;Escazu;San Rafael;Trejos;Casa blanca;9.9342;-84.0875\n";const b=new Blob([csv],{type:"text/csv;charset=utf-8;"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="plantilla_clientes.csv";a.style.display="none";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),200);};

  const handleFileUpload=async(e)=>{
    const file=e.target.files[0];if(!file)return;e.target.value="";
    const readEnc=(f,enc)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsText(f,enc);});
    let text=await readEnc(file,"UTF-8");if(text.includes("�"))text=await readEnc(file,"ISO-8859-1");
    const clean=text.replace(/^﻿/,"");const lines=clean.split(/\r?\n/).filter(l=>l.trim());
    if(lines.length<2){setMsg({type:"error",text:"Sin datos."});return;}
    const sep=";";const headers=parseCSVLine(lines[0],sep);const hm={};
    headers.forEach((h,i)=>{const hl=norm(h).replace(/[^a-z0-9\s]/g,"").trim();if(hl.includes("id cli")||hl==="id"||hl==="id cliente")hm.id=i;else if(hl==="nombre")hm.nombre=i;else if(hl.includes("apellido"))hm.apellidos=i;else if(hl==="cliente")hm.cliente=i;else if(hl.includes("telefono")||hl.includes("tel"))hm.telefono=i;else if(hl.includes("correo")||hl.includes("email"))hm.correo=i;else if(hl.includes("provincia"))hm.provincia=i;else if(hl.includes("canton"))hm.canton=i;else if(hl.includes("distrito"))hm.distrito=i;else if(hl.includes("barrio"))hm.barrio=i;else if(hl.includes("sena")||hl.includes("direccion"))hm.senas=i;else if(hl.includes("latitud")||hl==="lat")hm.lat=i;else if(hl.includes("longitud")||hl==="lng"||hl==="lon")hm.lng=i;});
    if(hm.id===undefined){setMsg({type:"error",text:"No se encontró columna ID."});return;}
    const unmatched=[];
    const imported=lines.slice(1).map(line=>{const cols=parseCSVLine(line,sep);const g=k=>(k!==undefined&&k<cols.length)?(cols[k]||"").trim().replace(/^"|"$/g,""):"";
      const id=g(hm.id);if(!id)return null;const rp=g(hm.provincia),rc=g(hm.canton),rd=g(hm.distrito);
      let provincia=rp,canton=rc,distrito=rd,matched=true;
      if(rp){const loc=matchLocation(rp,rc,rd);provincia=loc.provincia;canton=loc.canton;distrito=loc.distrito;if(rp&&!CR[provincia])matched=false;else if(rc&&provincia&&CR[provincia]&&!CR[provincia][canton])matched=false;}
      if(!matched)unmatched.push({id,rawProv:rp,rawCanton:rc,rawDist:rd});
      const latS=g(hm.lat),lngS=g(hm.lng);
      return{id,nombre:g(hm.nombre),apellidos:g(hm.apellidos),cliente:g(hm.cliente)||`${g(hm.nombre)} ${g(hm.apellidos)}`.trim(),telefono:g(hm.telefono),correo:g(hm.correo),provincia,canton,distrito,barrio:g(hm.barrio),senas:g(hm.senas),lat:latS?parseFloat(latS)||null:null,lng:lngS?parseFloat(lngS)||null:null};
    }).filter(Boolean);
    if(!imported.length){setMsg({type:"error",text:"Sin registros válidos."});return;}
    setUnmatchedLocs(unmatched);setImportData(imported);
  };

  const handleImportConfirm=(added,updated)=>{setBackupClients([...clients]);const map=new Map(clients.map(c=>[c.id,c]));updated.forEach(c=>map.set(c.id,{...map.get(c.id),...c}));added.forEach(c=>map.set(c.id,c));updateClients([...map.values()]);setImportData(null);setUnmatchedLocs([]);setMsg({type:"success",text:`${added.length} nuevos, ${updated.length} actualizados`});setTimeout(()=>setMsg(null),4000);};
  const restoreBackup=()=>{if(backupClients){updateClients(backupClients);setBackupClients(null);setMsg({type:"success",text:"Restaurado."});setTimeout(()=>setMsg(null),3000);}};
  const handleAddClient=(c)=>{updateClients([...clients,c]);setTab("list");setMsg({type:"success",text:`${c.cliente} agregado`});setTimeout(()=>setMsg(null),3000);};
  const handleEditClient=(c)=>{updateClients(clients.map(x=>x.id===c.id?c:x));setShowModal(false);setEditClient(null);};
  const confirmDelete=()=>{if(deleteConfirm==="batch"){updateClients(clients.filter(c=>!selectedIds.has(c.id)));setSelectedIds(new Set());setDeleteConfirm(null);}else if(deleteConfirm){updateClients(clients.filter(c=>c.id!==deleteConfirm));setDeleteConfirm(null);}};

  return(<div>
    {msg&&<div style={{padding:"10px 0",background:msg.type==="success"?COLORS.successBg:msg.type==="error"?COLORS.dangerBg:COLORS.warnBg,color:msg.type==="success"?COLORS.success:msg.type==="error"?COLORS.danger:COLORS.warn,fontSize:13,fontWeight:600,borderRadius:8,textAlign:"center",marginBottom:8}}>{msg.text}</div>}
    {backupClients&&<div style={{padding:"8px 12px",background:COLORS.infoBg,color:COLORS.info,fontSize:12,display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:8,marginBottom:8}}><span>Importación realizada.</span><button style={{...S.btn("outline"),fontSize:11,padding:"4px 12px"}} onClick={restoreBackup}>Deshacer</button></div>}

    <div style={{...S.card,display:"grid",gridTemplateColumns:"repeat(6,1fr)"}}>
      {[[stats.total,"Total"],[stats.provs,"Provincias"],[stats.cantons,"Cantones"],[stats.withPhone,"Con Tel"],[stats.withAddr,"Con Dir"],[stats.withCoords,"Con GPS"]].map(([n,l],i)=>(<div key={i} style={S.stat}><div style={S.statNum}>{n}</div><div style={S.statLabel}>{l}</div></div>))}
    </div>

    <div style={S.tabs}>{[["list","Lista"],["add","Nuevo"],["import","Importar"]].map(([k,l])=>(<button key={k} style={S.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>))}</div>

    {tab==="list"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,marginBottom:12}}>
        <input style={S.input} placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{...S.select,width:160}} value={filterProv} onChange={e=>{setFilterProv(e.target.value);setFilterCanton("");}}><option value="">Todas provincias</option>{[...new Set(clients.map(c=>c.provincia).filter(Boolean))].sort().map(p=><option key={p} value={p}>{p}</option>)}</select>
        <select style={{...S.select,width:160}} value={filterCanton} onChange={e=>setFilterCanton(e.target.value)} disabled={!filterProv}><option value="">Todos cantones</option>{filterCantones.map(c=><option key={c} value={c}>{c}</option>)}</select>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:11,color:COLORS.textMuted,fontWeight:600}}>Filtrar:</span>
        {[["notel",`Sin tel (${qualityCounts.notel})`],["nodir",`Sin dir (${qualityCounts.nodir})`],["nogps",`Sin GPS (${qualityCounts.nogps})`],["badzone",`Zona inv (${qualityCounts.badzone})`]].map(([k,l])=>(<span key={k} style={S.chip(dataFilter===k)} onClick={()=>setDataFilter(dataFilter===k?"":k)}>{l}</span>))}
        {dataFilter&&<span style={{fontSize:11,color:COLORS.info,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setDataFilter("")}>Limpiar</span>}
      </div>
      <div style={{fontSize:12,color:COLORS.textMuted,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>{Math.min(visibleCount,filtered.length)} de {filtered.length}</span>
        {selectedIds.size>0&&<div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,color:COLORS.primary}}>{selectedIds.size} sel.</span><button style={{...S.btn("danger"),padding:"4px 12px",fontSize:11}} onClick={()=>setDeleteConfirm("batch")}>Eliminar sel.</button><button style={{...S.btn("ghost"),padding:"4px 12px",fontSize:11}} onClick={()=>setSelectedIds(new Set())}>Deseleccionar</button></div>}
      </div>
      <div style={{...S.card,padding:0,overflow:"auto",maxHeight:"55vh"}}>
        <table style={S.table}><thead style={{position:"sticky",top:0,background:"white",zIndex:1}}><tr>
          <th style={{...S.th,width:32,textAlign:"center"}}><input type="checkbox" checked={filtered.length>0&&filtered.slice(0,visibleCount).every(c=>selectedIds.has(c.id))} onChange={e=>{const vis=filtered.slice(0,visibleCount);if(e.target.checked){const n=new Set(selectedIds);vis.forEach(c=>n.add(c.id));setSelectedIds(n);}else{const n=new Set(selectedIds);vis.forEach(c=>n.delete(c.id));setSelectedIds(n);}}}/></th>
          <th style={S.th}>ID</th><th style={S.th}>Cliente</th><th style={S.th}>Tel</th><th style={S.th}>Ubicación</th><th style={S.th}>Datos</th><th style={{...S.th,textAlign:"right"}}>Acc.</th>
        </tr></thead>
        <tbody>{filtered.slice(0,visibleCount).map(c=>(<tr key={c.id} style={{background:selectedIds.has(c.id)?COLORS.infoBg:"transparent"}} onDoubleClick={()=>{setEditClient(c);setShowModal(true);}}>
          <td style={{...S.td,width:32,textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(c.id)} onChange={()=>{const n=new Set(selectedIds);n.has(c.id)?n.delete(c.id):n.add(c.id);setSelectedIds(n);}}/></td>
          <td style={{...S.td,fontFamily:mono,fontSize:12,fontWeight:600}}>{c.id}</td>
          <td style={S.td}><div style={{fontWeight:600}}>{c.cliente}</div>{c.correo&&<div style={{fontSize:11,color:COLORS.textMuted}}>{c.correo}</div>}</td>
          <td style={{...S.td,fontFamily:mono,fontSize:12}}>{c.telefono||"—"}</td>
          <td style={S.td}><div style={{fontSize:12}}>{c.provincia&&<span>{c.provincia}</span>}{c.canton&&<span style={{color:COLORS.textMuted}}> &gt; {c.canton}</span>}</div>{c.distrito&&<div style={{fontSize:11,color:COLORS.textMuted}}>{c.distrito}</div>}</td>
          <td style={S.td}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{c.telefono&&<span style={S.badge("green")}>TEL</span>}{c.senas&&<span style={S.badge("blue")}>DIR</span>}{c.lat&&<span style={S.badge("green")}>GPS</span>}{!c.provincia&&<span style={S.badge("red")}>SIN ZONA</span>}</div></td>
          <td style={{...S.td,textAlign:"right"}}><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11}} onClick={()=>{setEditClient(c);setShowModal(true);}}>Editar</button><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,marginLeft:4,color:COLORS.danger}} onClick={()=>setDeleteConfirm(c.id)}>Elim.</button></td>
        </tr>))}</tbody></table>
        {filtered.length>visibleCount&&<div style={{padding:12,textAlign:"center"}}><button style={{...S.btn("outline"),fontSize:12}} onClick={()=>setVisibleCount(v=>v+100)}>Cargar más ({filtered.length-visibleCount} restantes)</button></div>}
        {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:COLORS.textMuted}}>No se encontraron clientes</div>}
      </div>
    </div>}

    {tab==="add"&&<div style={S.card}><ClientForm onSave={handleAddClient} onCancel={()=>setTab("list")} existingIds={existingIds}/></div>}

    {tab==="import"&&!importData&&<div style={S.card}>
      <h3 style={{margin:"0 0 12px",fontSize:18}}>Importar Clientes</h3>
      <p style={{fontSize:13,color:COLORS.textMuted,marginBottom:16}}>CSV separado por punto y coma (;)</p>
      <div style={{display:"flex",gap:8,marginBottom:16}}><button style={S.btn("outline")} onClick={downloadTemplate}>Descargar Plantilla</button></div>
      <div style={{border:`2px dashed ${COLORS.border}`,borderRadius:12,padding:"40px 20px",textAlign:"center",cursor:"pointer"}} onClick={()=>document.getElementById("rv-file-input").click()}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Click para seleccionar archivo</div>
        <input id="rv-file-input" type="file" accept=".csv,.tsv,.txt" style={{display:"none"}} onChange={handleFileUpload}/>
      </div>
    </div>}
    {tab==="import"&&importData&&<div style={S.card}><ImportDiff newClients={importData} existingClients={clients} onConfirm={handleImportConfirm} onCancel={()=>{setImportData(null);setUnmatchedLocs([]);}} unmatchedLocations={unmatchedLocs}/></div>}

    {showModal&&editClient&&<div style={S.modal} onClick={()=>{setShowModal(false);setEditClient(null);}}><div style={S.modalContent} onClick={e=>e.stopPropagation()}><ClientForm client={editClient} onSave={handleEditClient} onCancel={()=>{setShowModal(false);setEditClient(null);}} existingIds={existingIds}/></div></div>}
    {deleteConfirm&&<div style={S.modal} onClick={()=>setDeleteConfirm(null)}><div style={{...S.modalContent,maxWidth:400,textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:16,fontWeight:700,marginBottom:8}}>{deleteConfirm==="batch"?`Eliminar ${selectedIds.size} clientes?`:"Eliminar cliente?"}</div><div style={{fontSize:12,color:COLORS.danger,marginBottom:20}}>No se puede deshacer.</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button style={S.btn("ghost")} onClick={()=>setDeleteConfirm(null)}>Cancelar</button><button style={S.btn("danger")} onClick={confirmDelete}>Eliminar</button></div></div></div>}
  </div>);
}

// ============================================================
// MODULE 2A: REPARTIDORES
// ============================================================
function DriversTab({drivers,setDrivers,save}){
  const[form,setForm]=useState({nombre:"",telefono:""});const[editId,setEditId]=useState(null);const[deleteId,setDeleteId]=useState(null);
  const handleSave=()=>{if(!form.nombre.trim())return;if(editId){const u=drivers.map(d=>d.id===editId?{...d,nombre:form.nombre.trim(),telefono:form.telefono.trim()}:d);setDrivers(u);save(u);}else{const u=[...drivers,{id:genId("drv"),nombre:form.nombre.trim(),telefono:form.telefono.trim(),activo:true}];setDrivers(u);save(u);}setForm({nombre:"",telefono:""});setEditId(null);};
  const toggleActive=(id)=>{const u=drivers.map(d=>d.id===id?{...d,activo:!d.activo}:d);setDrivers(u);save(u);};
  const confirmDelete=()=>{const u=drivers.filter(d=>d.id!==deleteId);setDrivers(u);save(u);setDeleteId(null);};
  return(<div>
    <div style={S.card}><h3 style={{margin:"0 0 12px",fontSize:16}}>{editId?"Editar":"Agregar"} Repartidor</h3>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:8,alignItems:"end"}}>
        <div><label style={S.label}>Nombre</label><input style={S.input} value={form.nombre} placeholder="Nombre" onChange={e=>setForm({...form,nombre:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleSave()}/></div>
        <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.telefono} placeholder="88881234" onChange={e=>setForm({...form,telefono:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleSave()}/></div>
        <div style={{display:"flex",gap:6}}><button style={S.btn("primary")} onClick={handleSave}>{editId?"Guardar":"Agregar"}</button>{editId&&<button style={S.btn("ghost")} onClick={()=>{setEditId(null);setForm({nombre:"",telefono:""});}}>Cancelar</button>}</div>
      </div>
    </div>
    <div style={S.card}>{drivers.length===0?<div style={{textAlign:"center",padding:24,color:COLORS.textMuted}}>Sin repartidores.</div>:
      <table style={S.table}><thead><tr><th style={S.th}>Nombre</th><th style={S.th}>Tel</th><th style={S.th}>Estado</th><th style={{...S.th,textAlign:"right"}}>Acciones</th></tr></thead>
      <tbody>{drivers.map(d=>(<tr key={d.id}><td style={{...S.td,fontWeight:600}}>{d.nombre}</td><td style={{...S.td,fontFamily:mono,fontSize:12}}>{d.telefono||"—"}</td><td style={S.td}><span style={S.badge(d.activo?"green":"red")}>{d.activo?"Activo":"Inactivo"}</span></td>
        <td style={{...S.td,textAlign:"right"}}><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11}} onClick={()=>{setEditId(d.id);setForm({nombre:d.nombre,telefono:d.telefono||""});}}>Editar</button><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,marginLeft:4}} onClick={()=>toggleActive(d.id)}>{d.activo?"Desact.":"Act."}</button><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,marginLeft:4,color:COLORS.danger}} onClick={()=>setDeleteId(d.id)}>Elim.</button></td></tr>))}</tbody></table>}</div>
    {deleteId&&<div style={S.modal} onClick={()=>setDeleteId(null)}><div style={{...S.modalContent,maxWidth:400,textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:16,fontWeight:700,marginBottom:12}}>Eliminar repartidor?</div><div style={{fontSize:13,color:COLORS.textMuted,marginBottom:16}}>{drivers.find(d=>d.id===deleteId)?.nombre}</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button style={S.btn("ghost")} onClick={()=>setDeleteId(null)}>Cancelar</button><button style={S.btn("danger")} onClick={confirmDelete}>Eliminar</button></div></div></div>}
  </div>);
}

// ============================================================
// MODULE 2A: PUNTOS DE RECOLECCIÓN
// ============================================================
function PickupsTab({pickups,setPickups,save}){
  const empty={nombre:"",provincia:"",canton:"",distrito:"",direccion:"",lat:null,lng:null,activo:true};
  const[form,setForm]=useState(empty);const[editId,setEditId]=useState(null);const[showForm,setShowForm]=useState(false);const[deleteId,setDeleteId]=useState(null);
  const handleSave=()=>{if(!form.nombre.trim()||!form.lat||!form.lng)return;if(editId){const u=pickups.map(p=>p.id===editId?{...p,...form,nombre:form.nombre.trim()}:p);setPickups(u);save(u);}else{const u=[...pickups,{...form,id:genId("pk"),nombre:form.nombre.trim()}];setPickups(u);save(u);}setForm(empty);setEditId(null);setShowForm(false);};
  const startEdit=(p)=>{setEditId(p.id);setForm({nombre:p.nombre,provincia:p.provincia||"",canton:p.canton||"",distrito:p.distrito||"",direccion:p.direccion||"",lat:p.lat,lng:p.lng,activo:p.activo});setShowForm(true);};
  const toggleActive=(id)=>{const u=pickups.map(p=>p.id===id?{...p,activo:!p.activo}:p);setPickups(u);save(u);};
  const confirmDelete=()=>{const u=pickups.filter(p=>p.id!==deleteId);setPickups(u);save(u);setDeleteId(null);};
  return(<div>
    {!showForm&&<div style={{marginBottom:12}}><button style={S.btn("primary")} onClick={()=>{setShowForm(true);setEditId(null);setForm(empty);}}>+ Agregar Punto</button></div>}
    {showForm&&<div style={S.card}><h3 style={{margin:"0 0 12px",fontSize:16}}>{editId?"Editar":"Nuevo"} Punto de Recolección</h3>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8,marginBottom:12}}><div><label style={S.label}>Nombre</label><input style={S.input} value={form.nombre} placeholder="Ej: Feria Grecia" onChange={e=>setForm({...form,nombre:e.target.value})}/></div><div><label style={S.label}>Dirección</label><input style={S.input} value={form.direccion} placeholder="Frente al parque" onChange={e=>setForm({...form,direccion:e.target.value})}/></div></div>
      <div style={{marginBottom:12}}><LocationSelector provincia={form.provincia} canton={form.canton} distrito={form.distrito} onChange={({provincia,canton,distrito})=>setForm({...form,provincia,canton,distrito})}/></div>
      <div style={{marginBottom:12}}><CoordInput lat={form.lat} lng={form.lng} onChange={({lat,lng})=>setForm(f=>({...f,lat:lat??f.lat,lng:lng??f.lng}))}/>{(!form.lat||!form.lng)&&<div style={{fontSize:11,color:COLORS.danger,marginTop:4}}>Coordenadas obligatorias</div>}</div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button style={S.btn("ghost")} onClick={()=>{setShowForm(false);setEditId(null);setForm(empty);}}>Cancelar</button><button style={S.btn("primary")} onClick={handleSave} disabled={!form.nombre.trim()||!form.lat||!form.lng}>Guardar</button></div>
    </div>}
    <div style={S.card}>{pickups.length===0?<div style={{textAlign:"center",padding:24,color:COLORS.textMuted}}>Sin puntos de recolección.</div>:
      <table style={S.table}><thead><tr><th style={S.th}>Nombre</th><th style={S.th}>Ubicación</th><th style={S.th}>Coords</th><th style={S.th}>Estado</th><th style={{...S.th,textAlign:"right"}}>Acciones</th></tr></thead>
      <tbody>{pickups.map(p=>(<tr key={p.id}><td style={{...S.td,fontWeight:600}}>{p.nombre}</td><td style={S.td}><div style={{fontSize:12}}>{[p.provincia,p.canton,p.distrito].filter(Boolean).join(" > ")||"—"}</div></td>
        <td style={{...S.td,fontFamily:mono,fontSize:11}}>{p.lat&&p.lng?`${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`:"—"}</td><td style={S.td}><span style={S.badge(p.activo?"green":"red")}>{p.activo?"Activo":"Inactivo"}</span></td>
        <td style={{...S.td,textAlign:"right"}}>{p.lat&&p.lng&&<a href={`https://www.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,textDecoration:"none"}}>Maps</a>}<button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,marginLeft:4}} onClick={()=>startEdit(p)}>Editar</button><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,marginLeft:4}} onClick={()=>toggleActive(p.id)}>{p.activo?"Desact.":"Act."}</button><button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,marginLeft:4,color:COLORS.danger}} onClick={()=>setDeleteId(p.id)}>Elim.</button></td></tr>))}</tbody></table>}</div>
    {deleteId&&<div style={S.modal} onClick={()=>setDeleteId(null)}><div style={{...S.modalContent,maxWidth:400,textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Eliminar punto?</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button style={S.btn("ghost")} onClick={()=>setDeleteId(null)}>Cancelar</button><button style={S.btn("danger")} onClick={confirmDelete}>Eliminar</button></div></div></div>}
  </div>);
}

// ============================================================
// MODULE 2A: RUTAS Y ZONAS (restructured: Ruta > Zonas)
// ============================================================
function RoutesTab({routes,setRoutes,saveRoutes,drivers}){
  const activeDrivers=drivers.filter(d=>d.activo);
  // Route form
  const emptyRoute={dia:"",repartidor:"",puntoSalida:{nombre:"",lat:null,lng:null},puntoLlegada:{nombre:"",lat:null,lng:null},horaInicio:"08:00",minutosPorParada:10,margenMinutos:15,zonas:[]};
  const[rForm,setRForm]=useState(emptyRoute);const[editRouteId,setEditRouteId]=useState(null);const[showRouteForm,setShowRouteForm]=useState(false);
  // Zone form (for a route)
  const emptyZone={provincia:"",canton:"",distrito:""};
  const[zForm,setZForm]=useState(emptyZone);const[addZoneToRoute,setAddZoneToRoute]=useState(null);
  const[expandedRoute,setExpandedRoute]=useState(null);const[deleteRouteId,setDeleteRouteId]=useState(null);

  const handleSaveRoute=()=>{
    if(!rForm.dia||!rForm.repartidor)return;
    if(editRouteId){const u=routes.map(r=>r.id===editRouteId?{...r,dia:rForm.dia,repartidor:rForm.repartidor,puntoSalida:rForm.puntoSalida,puntoLlegada:rForm.puntoLlegada,horaInicio:rForm.horaInicio,minutosPorParada:rForm.minutosPorParada,margenMinutos:rForm.margenMinutos}:r);setRoutes(u);saveRoutes(u);}
    else{const nr={...rForm,id:genId("rt"),zonas:[]};const u=[...routes,nr];setRoutes(u);saveRoutes(u);}
    setRForm(emptyRoute);setEditRouteId(null);setShowRouteForm(false);
  };

  const startEditRoute=(r)=>{setEditRouteId(r.id);setRForm({dia:r.dia,repartidor:r.repartidor,puntoSalida:r.puntoSalida||{nombre:"",lat:null,lng:null},puntoLlegada:r.puntoLlegada||{nombre:"",lat:null,lng:null},horaInicio:r.horaInicio||"08:00",minutosPorParada:r.minutosPorParada||10,margenMinutos:r.margenMinutos||15,zonas:r.zonas||[]});setShowRouteForm(true);};
  const confirmDeleteRoute=()=>{const u=routes.filter(r=>r.id!==deleteRouteId);setRoutes(u);saveRoutes(u);setDeleteRouteId(null);if(expandedRoute===deleteRouteId)setExpandedRoute(null);};

  // Zone operations
  const addZone=(routeId)=>{
    if(!zForm.provincia||!zForm.canton)return;
    const dist=zForm.distrito||"Todos";
    const u=routes.map(r=>{if(r.id!==routeId)return r;const exists=r.zonas.some(z=>z.provincia===zForm.provincia&&z.canton===zForm.canton&&z.distrito===dist);if(exists)return r;return{...r,zonas:[...r.zonas,{id:genId("z"),provincia:zForm.provincia,canton:zForm.canton,distrito:dist}]};});
    setRoutes(u);saveRoutes(u);setZForm(emptyZone);
  };

  const removeZone=(routeId,zoneId)=>{
    const u=routes.map(r=>r.id===routeId?{...r,zonas:r.zonas.filter(z=>z.id!==zoneId)}:r);
    setRoutes(u);saveRoutes(u);
  };

  return(<div>
    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <button style={S.btn(showRouteForm?"ghost":"primary")} onClick={()=>{setShowRouteForm(!showRouteForm);if(showRouteForm){setEditRouteId(null);setRForm(emptyRoute);}}}>
        {showRouteForm?"Cancelar":"+ Nueva Ruta"}
      </button>
      <span style={{fontSize:12,color:COLORS.textMuted,alignSelf:"center"}}>{routes.length} ruta{routes.length!==1?"s":""}</span>
    </div>

    {showRouteForm&&<div style={S.card}>
      <h3 style={{margin:"0 0 12px",fontSize:16}}>{editRouteId?"Editar":"Nueva"} Ruta</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div><label style={S.label}>Día</label><select style={S.select} value={rForm.dia} onChange={e=>setRForm({...rForm,dia:e.target.value})}><option value="">-- Seleccionar --</option>{DIAS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
        <div><label style={S.label}>Repartidor</label><select style={S.select} value={rForm.repartidor} onChange={e=>setRForm({...rForm,repartidor:e.target.value})}><option value="">-- Seleccionar --</option>{activeDrivers.map(d=><option key={d.id} value={d.nombre}>{d.nombre}</option>)}</select></div>
      </div>
      <div style={{marginBottom:12,padding:12,background:COLORS.infoBg,borderRadius:8}}>
        <div style={{fontSize:13,fontWeight:600,color:COLORS.info,marginBottom:8}}>Punto de Salida</div>
        <div style={{marginBottom:8}}><label style={S.label}>Nombre</label><input style={S.input} value={rForm.puntoSalida.nombre} placeholder="Ej: Bodega" onChange={e=>setRForm({...rForm,puntoSalida:{...rForm.puntoSalida,nombre:e.target.value}})}/></div>
        <CoordInput lat={rForm.puntoSalida.lat} lng={rForm.puntoSalida.lng} onChange={({lat,lng})=>setRForm(f=>({...f,puntoSalida:{...f.puntoSalida,lat:lat??f.puntoSalida.lat,lng:lng??f.puntoSalida.lng}}))}/>
      </div>
      <div style={{marginBottom:12,padding:12,background:COLORS.warnBg,borderRadius:8}}>
        <div style={{fontSize:13,fontWeight:600,color:COLORS.warn,marginBottom:8}}>Punto de Llegada</div>
        <div style={{marginBottom:8}}><label style={S.label}>Nombre</label><input style={S.input} value={rForm.puntoLlegada.nombre} placeholder="Ej: Casa" onChange={e=>setRForm({...rForm,puntoLlegada:{...rForm.puntoLlegada,nombre:e.target.value}})}/></div>
        <CoordInput lat={rForm.puntoLlegada.lat} lng={rForm.puntoLlegada.lng} onChange={({lat,lng})=>setRForm(f=>({...f,puntoLlegada:{...f.puntoLlegada,lat:lat??f.puntoLlegada.lat,lng:lng??f.puntoLlegada.lng}}))}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
        <div><label style={S.label}>Hora Inicio</label><input style={S.input} type="time" value={rForm.horaInicio} onChange={e=>setRForm({...rForm,horaInicio:e.target.value})}/></div>
        <div><label style={S.label}>Min/Parada</label><input style={S.input} value={rForm.minutosPorParada} onChange={e=>setRForm({...rForm,minutosPorParada:parseInt(e.target.value)||10})}/></div>
        <div><label style={S.label}>Margen (min)</label><input style={S.input} value={rForm.margenMinutos} onChange={e=>setRForm({...rForm,margenMinutos:parseInt(e.target.value)||15})}/></div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button style={S.btn("ghost")} onClick={()=>{setShowRouteForm(false);setEditRouteId(null);setRForm(emptyRoute);}}>Cancelar</button><button style={S.btn("primary")} onClick={handleSaveRoute} disabled={!rForm.dia||!rForm.repartidor}>Guardar Ruta</button></div>
    </div>}

    {/* Route list */}
    {routes.length===0&&!showRouteForm&&<div style={{...S.card,textAlign:"center",padding:24,color:COLORS.textMuted}}>No hay rutas. Crea la primera.</div>}
    {routes.map(r=>{
      const isExp=expandedRoute===r.id;
      const isAddingZone=addZoneToRoute===r.id;
      return(<div key={r.id} style={{...S.card,borderLeft:`4px solid ${COLORS.primary}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setExpandedRoute(isExp?null:r.id)}>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>{r.dia} — {r.repartidor}</div>
            <div style={{fontSize:12,color:COLORS.textMuted}}>{r.zonas?.length||0} zona{(r.zonas?.length||0)!==1?"s":""} | Salida: {r.puntoSalida?.nombre||"—"} | Hora: {r.horaInicio||"—"}</div>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11}} onClick={e=>{e.stopPropagation();startEditRoute(r);}}>Editar</button>
            <button style={{...S.btn("ghost"),padding:"4px 8px",fontSize:11,color:COLORS.danger}} onClick={e=>{e.stopPropagation();setDeleteRouteId(r.id);}}>Elim.</button>
            <span style={{fontSize:18,color:COLORS.textMuted}}>{isExp?"▲":"▼"}</span>
          </div>
        </div>

        {isExp&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${COLORS.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:700}}>Zonas de esta ruta</div>
            <button style={S.btn(isAddingZone?"ghost":"outline")} onClick={()=>setAddZoneToRoute(isAddingZone?null:r.id)}>{isAddingZone?"Cancelar":"+ Zona"}</button>
          </div>

          {isAddingZone&&<div style={{padding:12,background:COLORS.bg,borderRadius:8,marginBottom:8}}>
            <LocationSelector provincia={zForm.provincia} canton={zForm.canton} distrito={zForm.distrito} onChange={({provincia,canton,distrito})=>setZForm({provincia,canton,distrito})} showTodos={true}/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}><button style={S.btn("primary")} onClick={()=>addZone(r.id)} disabled={!zForm.provincia||!zForm.canton}>Agregar Zona</button></div>
          </div>}

          {(!r.zonas||r.zonas.length===0)?<div style={{fontSize:12,color:COLORS.textMuted,padding:8}}>Sin zonas asignadas. Agrega zonas para que los pedidos se asignen a esta ruta.</div>:
            <table style={{...S.table,fontSize:12}}><thead><tr><th style={S.th}>Provincia</th><th style={S.th}>Cantón</th><th style={S.th}>Distrito</th><th style={{...S.th,textAlign:"right",width:60}}>Acc.</th></tr></thead>
            <tbody>{r.zonas.map(z=>(<tr key={z.id}><td style={S.td}>{z.provincia}</td><td style={S.td}>{z.canton}</td><td style={S.td}><span style={S.badge(z.distrito==="Todos"?"yellow":"blue")}>{z.distrito}</span></td>
              <td style={{...S.td,textAlign:"right"}}><button style={{...S.btn("ghost"),padding:"2px 6px",fontSize:10,color:COLORS.danger}} onClick={()=>removeZone(r.id,z.id)}>Quitar</button></td></tr>))}</tbody></table>}
        </div>}
      </div>);
    })}

    {deleteRouteId&&<div style={S.modal} onClick={()=>setDeleteRouteId(null)}><div style={{...S.modalContent,maxWidth:400,textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Eliminar ruta y sus zonas?</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button style={S.btn("ghost")} onClick={()=>setDeleteRouteId(null)}>Cancelar</button><button style={S.btn("danger")} onClick={confirmDeleteRoute}>Eliminar</button></div></div></div>}
  </div>);
}

// ============================================================
// MODULE 2A: PEDIDOS DEL DÍA
// ============================================================
function OrdersTab({drivers,pickups,routes,clients}){
  const activeDrivers=drivers.filter(d=>d.activo);
  const activePickups=pickups.filter(p=>p.activo);
  const[dia1,setDia1]=useState("");const[dia2,setDia2]=useState("");const[orders,setOrders]=useState([]);const[loadSummary,setLoadSummary]=useState(null);const[saving,setSaving]=useState(false);const[deleteConfirm,setDeleteConfirm]=useState(null);

  const saveOrders=useCallback(async(data)=>{setSaving(true);await sSave(KEYS.orders,{dia1,dia2,orders:data,timestamp:Date.now()});setTimeout(()=>setSaving(false),400);},[dia1,dia2]);
  useEffect(()=>{(async()=>{const s=await sLoad(KEYS.orders);if(s?.orders?.length>0){setOrders(s.orders);if(s.dia1)setDia1(s.dia1);if(s.dia2)setDia2(s.dia2);}})();},[]);

  const clientMap=useMemo(()=>{const m=new Map();if(clients)(Array.isArray(clients)?clients:[]).forEach(c=>m.set(c.id,c));return m;},[clients]);

  // Assign driver based on routes > zones
  const assignDriver=(prov,canton,dist,dia)=>{
    if(!dia||!prov||!canton)return null;
    for(const r of routes){
      if(r.dia!==dia)continue;
      for(const z of(r.zonas||[])){
        if(norm(z.provincia)===norm(prov)&&norm(z.canton)===norm(canton)){
          if(z.distrito!=="Todos"&&norm(z.distrito)===norm(dist))return r.repartidor;
          if(z.distrito==="Todos")return r.repartidor;
        }
      }
    }
    return null;
  };
  const assignForDays=(p,c,d)=>{const d1=dia1?assignDriver(p,c,d,dia1):null;const d2=dia2?assignDriver(p,c,d,dia2):null;return d1||d2||null;};

  const downloadTemplate=()=>{const csv="﻿# Pedido;ID Cliente;Pago;Can GRD;Can PEQ;Notas;Tipo Entrega;Lugar Recolección\nP001;1-JPA;SINPE;1;0;;Entrega;\nP002;4-ACU;Efectivo;2;1;;Recolección;Feria Grecia\n";const b=new Blob([csv],{type:"text/csv;charset=utf-8;"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="plantilla_pedidos.csv";a.style.display="none";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),200);};

  const handleFileUpload=async(e)=>{
    const file=e.target.files[0];if(!file)return;e.target.value="";
    if(!dia1){setLoadSummary({error:"Selecciona al menos un día."});return;}
    const readEnc=(f,enc)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsText(f,enc);});
    let text=await readEnc(file,"UTF-8");if(text.includes("�"))text=await readEnc(file,"ISO-8859-1");
    const lines=text.replace(/^﻿/,"").split(/\r?\n/).filter(l=>l.trim());
    if(lines.length<2){setLoadSummary({error:"Sin datos."});return;}
    const sep=";";const headers=parseCSVLine(lines[0],sep);const hm={};
    headers.forEach((h,i)=>{const hl=norm(h).replace(/[^a-z0-9\s]/g,"").trim();if(hl.includes("pedido"))hm.numPedido=i;else if(hl.includes("id cli"))hm.idCliente=i;else if(hl.includes("pago"))hm.pago=i;else if(hl.includes("grd")||hl.includes("grande"))hm.canGRD=i;else if(hl.includes("peq"))hm.canPEQ=i;else if(hl.includes("nota"))hm.notas=i;else if(hl.includes("tipo"))hm.tipoEntrega=i;else if(hl.includes("lugar")||hl.includes("recolecci"))hm.lugarRec=i;});
    let asignados=0,sinAsignar=0,noCliente=0,recolecciones=0,ignorados=0;const parsed=[];
    for(let i=1;i<lines.length;i++){
      const cols=parseCSVLine(lines[i],sep);const g=k=>(k!==undefined&&k<cols.length)?(cols[k]||"").trim().replace(/^"|"$/g,""):"";
      const numPedido=g(hm.numPedido)||`P${i}`;const idCliente=g(hm.idCliente);if(!idCliente)continue;
      const pago=g(hm.pago),canGRD=parseInt(g(hm.canGRD))||0,canPEQ=parseInt(g(hm.canPEQ))||0,notas=g(hm.notas);
      let tipoEntrega=g(hm.tipoEntrega)||"Entrega",lugarRec=g(hm.lugarRec);
      if(norm(tipoEntrega).includes("recolecci"))tipoEntrega="Recolección";else tipoEntrega="Entrega";
      if(tipoEntrega==="Recolección"&&(!lugarRec||norm(lugarRec)==="figo")){ignorados++;continue;}
      const client=clientMap.get(idCliente);let cn="",pr="",ca="",di="",la=null,ln=null,te="",se="";
      if(client){cn=client.cliente||`${client.nombre||""} ${client.apellidos||""}`.trim();pr=client.provincia||"";ca=client.canton||"";di=client.distrito||"";la=client.lat||null;ln=client.lng||null;te=client.telefono||"";se=client.senas||"";}else noCliente++;
      let aProv=pr,aCanton=ca,aDist=di,lugarRecoleccion=null,pkNombre="";
      if(tipoEntrega==="Recolección"&&lugarRec){const pk=activePickups.find(p=>norm(p.nombre)===norm(lugarRec));if(pk){lugarRecoleccion=pk.id;pkNombre=pk.nombre;aProv=pk.provincia||pr;aCanton=pk.canton||ca;aDist=pk.distrito||di;la=pk.lat;ln=pk.lng;}else pkNombre=lugarRec+" (no encontrado)";recolecciones++;}
      const ruta=assignForDays(aProv,aCanton,aDist);if(ruta)asignados++;else sinAsignar++;
      parsed.push({numPedido,idCliente,ruta:ruta||"",pago,canGRD,canPEQ,notas,tipoEntrega,lugarRecoleccion,_pickupNombre:pkNombre,estado:"pendiente",pinned:false,pinnedPosition:null,_clienteNombre:cn,_provincia:pr,_canton:ca,_distrito:di,_lat:la,_lng:ln,_telefono:te,_senas:se,_clienteEncontrado:!!client});
    }
    setOrders(parsed);saveOrders(parsed);setLoadSummary({total:parsed.length,asignados,sinAsignar,noCliente,recolecciones,ignorados});
  };

  const updateOrder=(idx,changes)=>{const u=[...orders];u[idx]={...u[idx],...changes};setOrders(u);saveOrders(u);};
  const clearOrders=()=>{setOrders([]);saveOrders([]);setLoadSummary(null);setDeleteConfirm(null);};

  const reassignAll=()=>{
    if(!dia1||orders.length===0)return;
    let asignados=0,sinAsignar=0;
    const updated=orders.map(o=>{
      // Re-enrich from current client data
      const client=clientMap.get(o.idCliente);
      let pr=o._provincia,ca=o._canton,di=o._distrito,la=o._lat,ln=o._lng,cn=o._clienteNombre,te=o._telefono,se=o._senas,found=o._clienteEncontrado;
      if(client){pr=client.provincia||"";ca=client.canton||"";di=client.distrito||"";la=client.lat||null;ln=client.lng||null;cn=client.cliente||((client.nombre||"")+" "+(client.apellidos||"")).trim();te=client.telefono||"";se=client.senas||"";found=true;}
      let aProv=pr,aCanton=ca,aDist=di;
      if(norm(o.tipoEntrega).includes("recolecci")&&o.lugarRecoleccion){const pk=activePickups.find(p=>p.id===o.lugarRecoleccion);if(pk){aProv=pk.provincia||aProv;aCanton=pk.canton||aCanton;aDist=pk.distrito||aDist;la=pk.lat;ln=pk.lng;}}
      const ruta=assignForDays(aProv,aCanton,aDist);
      if(ruta)asignados++;else sinAsignar++;
      return{...o,ruta:ruta||"",_provincia:pr,_canton:ca,_distrito:di,_lat:la,_lng:ln,_clienteNombre:cn,_telefono:te,_senas:se,_clienteEncontrado:found};
    });
    setOrders(updated);saveOrders(updated);
    setLoadSummary(s=>s?{...s,asignados,sinAsignar}:{total:updated.length,asignados,sinAsignar,noCliente:0,recolecciones:0,ignorados:0});
  };

  const grouped=useMemo(()=>{const g={};orders.forEach((o,idx)=>{const k=o.ruta||"__none__";if(!g[k])g[k]=[];g[k].push({...o,_idx:idx});});return g;},[orders]);
  const rutaNames=useMemo(()=>{const n=Object.keys(grouped).filter(k=>k!=="__none__").sort();if(grouped["__none__"])n.unshift("__none__");return n;},[grouped]);

  return(<div>
    <div style={S.card}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto auto",gap:8,alignItems:"end"}}>
      <div><label style={S.label}>Día 1</label><select style={S.select} value={dia1} onChange={e=>setDia1(e.target.value)}><option value="">-- Seleccionar --</option>{DIAS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
      <div><label style={S.label}>Día 2 (opc.)</label><select style={S.select} value={dia2} onChange={e=>setDia2(e.target.value)}><option value="">Ninguno</option>{DIAS.filter(d=>d!==dia1).map(d=><option key={d} value={d}>{d}</option>)}</select></div>
      <div><label style={S.label}>Cargar</label><div style={{display:"flex",gap:6}}><button style={S.btn("primary")} onClick={()=>document.getElementById("rv-ord").click()}>Cargar CSV</button><input id="rv-ord" type="file" accept=".csv" style={{display:"none"}} onChange={handleFileUpload}/></div></div>
      <div><button style={S.btn("outline")} onClick={downloadTemplate}>Plantilla</button></div>
      {orders.length>0&&<div><button style={{...S.btn("danger"),fontSize:11,padding:"6px 12px"}} onClick={()=>setDeleteConfirm("all")}>Limpiar</button></div>}
    </div>
    {orders.length>0&&<div style={{marginTop:8}}><button style={S.btn("accent")} onClick={reassignAll}>Reasignar pedidos a rutas</button></div>}
    {saving&&<div style={{fontSize:11,color:COLORS.textMuted,marginTop:4}}>Guardando...</div>}</div>

    {loadSummary&&!loadSummary.error&&<div style={{...S.card,background:COLORS.successBg}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,textAlign:"center"}}>
        {[[loadSummary.total,"Pedidos",COLORS.primary],[loadSummary.asignados,"Asignados",COLORS.success],[loadSummary.sinAsignar,"Sin Asignar",loadSummary.sinAsignar>0?COLORS.warn:COLORS.textMuted],[loadSummary.noCliente,"Sin Cliente",loadSummary.noCliente>0?COLORS.danger:COLORS.textMuted],[loadSummary.recolecciones,"Recolecciones",COLORS.info]].map(([n,l,c],i)=>(<div key={i}><div style={{fontSize:22,fontWeight:800,color:c}}>{n}</div><div style={{fontSize:11,color:COLORS.textMuted}}>{l}</div></div>))}
      </div>
      {loadSummary.ignorados>0&&<div style={{fontSize:12,color:COLORS.textMuted,marginTop:8,textAlign:"center"}}>{loadSummary.ignorados} recolección en Figo ignorado{loadSummary.ignorados!==1?"s":""}</div>}
    </div>}
    {loadSummary?.error&&<div style={{...S.card,background:COLORS.dangerBg,color:COLORS.danger,fontWeight:600}}>{loadSummary.error}</div>}

    {orders.length>0&&<div>
      <div style={{fontSize:13,fontWeight:600,color:COLORS.textMuted,marginBottom:8}}>{orders.length} pedido{orders.length!==1?"s":""} en {rutaNames.filter(n=>n!=="__none__").length} ruta{rutaNames.filter(n=>n!=="__none__").length!==1?"s":""}</div>
      {rutaNames.map(rk=>{const items=grouped[rk];const isUn=rk==="__none__";const tG=items.reduce((s,o)=>s+o.canGRD,0);const tP=items.reduce((s,o)=>s+o.canPEQ,0);
        return(<div key={rk} style={{...S.card,borderLeft:`4px solid ${isUn?COLORS.warn:COLORS.primary}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div style={{fontSize:16,fontWeight:700,color:isUn?COLORS.warn:COLORS.primary}}>{isUn?"Sin Asignar":rk}</div><div style={{fontSize:12,color:COLORS.textMuted}}>{items.length} pedidos | {tG}G {tP}P</div></div>
          </div>
          <div style={{overflow:"auto"}}><table style={S.table}><thead><tr><th style={{...S.th,width:60}}>#</th><th style={S.th}>Cliente</th><th style={S.th}>Ubic.</th><th style={S.th}>Tipo</th><th style={S.th}>Pago</th><th style={S.th}>Cajas</th><th style={S.th}>Ruta</th></tr></thead>
          <tbody>{items.map(o=>(<tr key={o.numPedido}>
            <td style={{...S.td,fontFamily:mono,fontSize:11,fontWeight:600}}>{o.numPedido}</td>
            <td style={S.td}><div style={{fontWeight:600,fontSize:12}}>{o._clienteNombre||o.idCliente}{!o._clienteEncontrado&&<span style={{...S.badge("red"),marginLeft:4}}>?</span>}</div><div style={{fontSize:10,color:COLORS.textMuted,fontFamily:mono}}>{o.idCliente}</div>{o.notas&&<div style={{fontSize:10,color:COLORS.info}}>{o.notas}</div>}</td>
            <td style={S.td}><div style={{fontSize:12}}>{o._canton||"—"}</div>{o._distrito&&<div style={{fontSize:10,color:COLORS.textMuted}}>{o._distrito}</div>}{o._lat&&o._lng?<span style={S.badge("green")}>GPS</span>:<span style={S.badge("red")}>Sin GPS</span>}</td>
            <td style={S.td}><select style={{...S.select,width:100,fontSize:11,padding:"4px 6px"}} value={o.tipoEntrega} onChange={e=>{const nv=e.target.value;const ch={tipoEntrega:nv};if(nv==="Entrega"){ch.lugarRecoleccion=null;ch._pickupNombre="";}updateOrder(o._idx,ch);}}><option value="Entrega">Entrega</option><option value={"Recolección"}>{"Recolección"}</option></select>{(o.tipoEntrega==="Recolección"||norm(o.tipoEntrega).includes("recolecci"))&&<select style={{...S.select,width:110,fontSize:10,padding:"3px 4px",marginTop:3}} value={o.lugarRecoleccion||""} onChange={e=>{const pkId=e.target.value;const pk=activePickups.find(p=>p.id===pkId);updateOrder(o._idx,{lugarRecoleccion:pkId||null,_pickupNombre:pk?pk.nombre:"",_lat:pk?pk.lat:o._lat,_lng:pk?pk.lng:o._lng});}}><option value="">-- Punto --</option>{activePickups.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select>}{o._pickupNombre&&<div style={{fontSize:10,color:COLORS.textMuted,marginTop:2}}>{o._pickupNombre}</div>}</td>
            <td style={{...S.td,fontSize:11}}>{o.pago||"—"}</td>
            <td style={{...S.td,fontFamily:mono,fontSize:11}}>{o.canGRD>0?o.canGRD+"G ":""}{o.canPEQ>0?o.canPEQ+"P":""}{!o.canGRD&&!o.canPEQ?"—":""}</td>
            <td style={S.td}><select style={{...S.select,width:120,fontSize:11,padding:"4px 6px"}} value={o.ruta||""} onChange={e=>updateOrder(o._idx,{ruta:e.target.value})}><option value="">Sin asignar</option>{activeDrivers.map(d=><option key={d.id} value={d.nombre}>{d.nombre}</option>)}</select></td>
          </tr>))}</tbody></table></div>
        </div>);
      })}
    </div>}

    {orders.length===0&&!loadSummary&&dia1&&<div style={{...S.card,textAlign:"center",padding:40,color:COLORS.textMuted}}>Carga un CSV con los pedidos del {dia1}{dia2?` y ${dia2}`:""}</div>}
    {deleteConfirm&&<div style={S.modal} onClick={()=>setDeleteConfirm(null)}><div style={{...S.modalContent,maxWidth:400,textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:16,fontWeight:700,marginBottom:12}}>Limpiar todos?</div><div style={{fontSize:13,color:COLORS.textMuted,marginBottom:16}}>{orders.length} pedidos se eliminarán.</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button style={S.btn("ghost")} onClick={()=>setDeleteConfirm(null)}>Cancelar</button><button style={S.btn("danger")} onClick={clearOrders}>Limpiar</button></div></div></div>}
  </div>);
}

// ============================================================
// MODULE 2B: OPTIMIZACIÓN DE RUTAS
// ============================================================
function OptimizeTab({routes,pickups,clients,refreshKey}){
  const[ordersData,setOrdersData]=useState(null);
  const[routeStates,setRouteStates]=useState({});
  const[expandedMap,setExpandedMap]=useState({});
  const[mapElems]=useState(()=>({}));
  const[mapInstances]=useState(()=>({}));
  const[loading,setLoading]=useState(true);
  const[copyMsg,setCopyMsg]=useState(null);

  // Persist optimized route states to storage for M3 (Vista Repartidor)
  const persistOptimized=useCallback((newStates,diaInfo)=>{
    const toSave={};
    for(const[rName,st] of Object.entries(newStates)){
      if(!st?.optimized||!st.stops)continue;
      toSave[rName]={stops:st.stops,totalDistKm:st.totalDistKm,totalDurMin:st.totalDurMin,endTime:st.endTime,startTime:st.startTime,config:st.config,manualOrder:st.manualOrder||false};
    }
    sSave(KEYS.optimized,{dia1:diaInfo?.dia1||"",dia2:diaInfo?.dia2||"",routes:toSave,timestamp:new Date().toISOString()});
  },[]);

  useEffect(()=>{(async()=>{
    setLoading(true);
    const s=await sLoad(KEYS.orders);
    setOrdersData(s);
    // Restore optimized route states from storage
    const opt=await sLoad(KEYS.optimized);
    if(opt?.routes){
      const restored={};
      for(const[rName,rd] of Object.entries(opt.routes)){
        if(rd?.stops)restored[rName]={optimizing:false,error:null,optimized:true,stops:rd.stops,totalDistKm:rd.totalDistKm,totalDurMin:rd.totalDurMin,endTime:rd.endTime,startTime:rd.startTime,config:rd.config,manualOrder:rd.manualOrder||false};
      }
      if(Object.keys(restored).length>0)setRouteStates(restored);
    }
    setLoading(false);
  })();},[refreshKey]);

  const orders=ordersData?.orders||[];
  const dia1=ordersData?.dia1||"";
  const dia2=ordersData?.dia2||"";

  // Group orders by ruta (driver name)
  const groupedByRuta=useMemo(()=>{
    const g={};
    orders.forEach(o=>{
      if(!o.ruta)return;
      if(!g[o.ruta])g[o.ruta]=[];
      g[o.ruta].push(o);
    });
    return g;
  },[orders]);

  // Build stops for a route
  const buildStops=useCallback((rutaName)=>{
    const rOrders=groupedByRuta[rutaName]||[];
    const stopMap={};
    rOrders.forEach(o=>{
      let key,lat,lng,label,isPickup=false,pkName="";
      if(norm(o.tipoEntrega).includes("recolecci")&&o.lugarRecoleccion){
        key="pk-"+o.lugarRecoleccion;
        const pk=(pickups||[]).find(p=>p.id===o.lugarRecoleccion);
        lat=pk?pk.lat:o._lat;lng=pk?pk.lng:o._lng;
        pkName=pk?pk.nombre:(o._pickupNombre||"Recolección");
        label=pkName;isPickup=true;
      } else {
        lat=o._lat;lng=o._lng;
        key=(lat&&lng)?"c-"+lat+","+lng:"c-"+o.numPedido;
        label=o._clienteNombre||o.idCliente;
      }
      if(!stopMap[key])stopMap[key]={key,lat,lng,label,isPickup,pkName,orders:[],pinned:false,pinnedPosition:null};
      stopMap[key].orders.push(o);
      if(o.pinned){stopMap[key].pinned=true;stopMap[key].pinnedPosition=o.pinnedPosition||1;}
    });
    return Object.values(stopMap);
  },[groupedByRuta,pickups]);

  // Find route config for a driver name
  const findRouteConfig=useCallback((rutaName)=>{
    return routes.find(r=>r.repartidor===rutaName&&(r.dia===dia1||r.dia===dia2))||null;
  },[routes,dia1,dia2]);

  // Validate a route
  const validateRoute=useCallback((rutaName)=>{
    const stops=buildStops(rutaName);
    const config=findRouteConfig(rutaName);
    const errors=[];
    if(!config)errors.push("No hay ruta configurada para "+rutaName);
    else{
      if(!config.puntoSalida?.lat||!config.puntoSalida?.lng)errors.push("Punto de salida sin coordenadas");
      if(!config.puntoLlegada?.lat||!config.puntoLlegada?.lng)errors.push("Punto de llegada sin coordenadas");
    }
    const noGps=stops.filter(s=>!s.lat||!s.lng);
    if(noGps.length>0)errors.push(noGps.length+" parada(s) sin GPS: "+noGps.map(s=>s.label).join(", "));
    return{stops,config,errors,valid:errors.length===0};
  },[buildStops,findRouteConfig]);

  // Optimize a route — tries OSRM first, falls back to local heuristic
  const optimizeRoute=useCallback(async(rutaName)=>{
    const{stops,config,errors,valid}=validateRoute(rutaName);
    if(!valid)return;
    setRouteStates(prev=>({...prev,[rutaName]:{...prev[rutaName],optimizing:true,error:null,osrmUsed:false}}));
    try{
      const pinned=stops.filter(s=>s.pinned).sort((a,b)=>(a.pinnedPosition||1)-(b.pinnedPosition||1));
      const free=stops.filter(s=>!s.pinned);
      let orderedStops;
      let osrmLegs=null;
      let osrmUsed=false;
      if(free.length===0){
        orderedStops=[...pinned];
      } else {
        // Try OSRM first
        try{
          const result=await osrmOptimize(config.puntoSalida,free,config.puntoLlegada);
          orderedStops=[...result.orderedStops];
          osrmLegs=result.legs;
          osrmUsed=true;
          // Merge pinned into OSRM-optimized order
          pinned.forEach(p=>{
            const pos=Math.min((p.pinnedPosition||1)-1,orderedStops.length);
            orderedStops.splice(pos,0,p);
          });
        }catch(osrmErr){
          console.warn("OSRM failed, using local heuristic:",osrmErr.message);
          // Fallback to local heuristic
          const{ordered}=optimizeNearestNeighbor(config.puntoSalida,free,config.puntoLlegada);
          const improved=improve2Opt(config.puntoSalida,ordered,config.puntoLlegada);
          orderedStops=[...improved];
          pinned.forEach(p=>{
            const pos=Math.min((p.pinnedPosition||1)-1,orderedStops.length);
            orderedStops.splice(pos,0,p);
          });
        }
      }
      // Calculate ETAs — use OSRM legs if available, else haversine
      const minPerStop=config.minutosPorParada||10;
      const margin=config.margenMinutos||15;
      const startMin=parseTime(config.horaInicio);
      let cumMin=startMin;
      let totalDist=0;
      let prevLat=config.puntoSalida.lat,prevLng=config.puntoSalida.lng;
      const stopsWithEta=orderedStops.map((s,i)=>{
        let legDistM,legDurMin;
        if(osrmUsed&&osrmLegs&&osrmLegs[i]){
          // OSRM gives real road distance/duration
          legDistM=osrmLegs[i].distance||0;
          legDurMin=(osrmLegs[i].duration||0)/60;
        } else {
          legDistM=haversineM(prevLat,prevLng,s.lat,s.lng)*1.4;
          legDurMin=(legDistM/1000)/40*60;
        }
        cumMin+=legDurMin;
        totalDist+=legDistM;
        const eta=cumMin;
        const result={...s,position:i+1,eta,etaTo:eta+margin,etaStr:fmtTime(eta),etaRange:fmtTime(eta)+"-"+fmtTime(eta+margin),legDurMin:Math.round(legDurMin),legDistM:Math.round(legDistM)};
        prevLat=s.lat;prevLng=s.lng;
        cumMin+=minPerStop;
        return result;
      });
      // Final leg to destination
      let lastDist,lastDur;
      if(osrmUsed&&osrmLegs&&osrmLegs[orderedStops.length]){
        lastDist=osrmLegs[orderedStops.length].distance||0;
        lastDur=(osrmLegs[orderedStops.length].duration||0)/60;
      } else {
        lastDist=haversineM(prevLat,prevLng,config.puntoLlegada.lat,config.puntoLlegada.lng)*1.4;
        lastDur=(lastDist/1000)/40*60;
      }
      totalDist+=lastDist;
      const endMin=cumMin+lastDur;
      setRouteStates(prev=>{const nxt={...prev,[rutaName]:{
        optimizing:false,error:null,optimized:true,
        stops:stopsWithEta,
        totalDistKm:(totalDist/1000).toFixed(1),
        totalDurMin:Math.round(endMin-startMin),
        endTime:fmtTime(endMin),
        startTime:config.horaInicio||"08:00",
        config
      }};persistOptimized(nxt,{dia1,dia2});return nxt;});
    }catch(err){
      setRouteStates(prev=>({...prev,[rutaName]:{optimizing:false,error:"Error: "+err.message}}));
    }
  },[validateRoute]);

  // Toggle pin on a stop in optimized view and persist to orders
  const togglePin=useCallback((rutaName,idx)=>{
    setRouteStates(prev=>{
      const st=prev[rutaName];if(!st||!st.stops)return prev;
      const arr=st.stops.map((s,i)=>{
        if(i!==idx)return s;
        const newPinned=!s.pinned;
        const newPos=newPinned?(idx+1):null;
        // Update each order in this stop
        s.orders.forEach(o=>{o.pinned=newPinned;o.pinnedPosition=newPos;});
        return{...s,pinned:newPinned,pinnedPosition:newPos};
      });
      // Persist to storage
      persistPinChanges(arr);
      const nxt={...prev,[rutaName]:{...st,stops:arr}};
      persistOptimized(nxt,{dia1,dia2});
      return nxt;
    });
  },[dia1,dia2,persistOptimized]);

  // Set pin position for a stop
  const setPinPosition=useCallback((rutaName,idx,pos)=>{
    setRouteStates(prev=>{
      const st=prev[rutaName];if(!st||!st.stops)return prev;
      const arr=st.stops.map((s,i)=>{
        if(i!==idx)return s;
        s.orders.forEach(o=>{o.pinnedPosition=pos;});
        return{...s,pinnedPosition:pos};
      });
      persistPinChanges(arr);
      const nxt={...prev,[rutaName]:{...st,stops:arr}};
      persistOptimized(nxt,{dia1,dia2});
      return nxt;
    });
  },[dia1,dia2,persistOptimized]);

  // Persist pin changes back to orders storage
  const persistPinChanges=useCallback(async(stops)=>{
    if(!ordersData)return;
    const updated={...ordersData,orders:ordersData.orders.map(o=>{
      for(const s of stops){
        const match=s.orders.find(so=>so.numPedido===o.numPedido);
        if(match)return{...o,pinned:match.pinned,pinnedPosition:match.pinnedPosition};
      }
      return o;
    })};
    setOrdersData(updated);
    await sSave(KEYS.orders,updated);
  },[ordersData]);

  // Move stop up/down
  const moveStop=useCallback((rutaName,idx,dir)=>{
    setRouteStates(prev=>{
      const st=prev[rutaName];if(!st||!st.stops)return prev;
      const arr=[...st.stops];
      const ni=idx+dir;
      if(ni<0||ni>=arr.length)return prev;
      [arr[idx],arr[ni]]=[arr[ni],arr[idx]];
      arr.forEach((s,i)=>s.position=i+1);
      const nxt={...prev,[rutaName]:{...st,stops:arr,manualOrder:true}};
      persistOptimized(nxt,{dia1,dia2});
      return nxt;
    });
  },[dia1,dia2,persistOptimized]);

  // Render map with Leaflet (cdnjs - allowed by artifact CSP)
  const renderMap=useCallback(async(rutaName)=>{
    const st=routeStates[rutaName];
    if(!st||!st.stops||!st.config)return;
    try{
      await loadLeaflet();
      const el=mapElems[rutaName];
      if(!el)return;
      // Clean previous map
      if(mapInstances[rutaName]){try{mapInstances[rutaName].remove();}catch(e){}}
      el.innerHTML="";
      const origin=st.config.puntoSalida;
      const dest=st.config.puntoLlegada;
      const map=window.L.map(el).setView([9.93,-84.08],10);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"OSM",maxZoom:18}).addTo(map);
      const bounds=[];
      // Origin marker (green)
      const gIcon=window.L.divIcon({html:'<div style="background:#16a34a;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">S</div>',className:"",iconSize:[28,28],iconAnchor:[14,14]});
      window.L.marker([origin.lat,origin.lng],{icon:gIcon,title:"Salida: "+(origin.nombre||"Origen")}).addTo(map).bindPopup("Salida: "+(origin.nombre||"Origen"));
      bounds.push([origin.lat,origin.lng]);
      // Stop markers
      const pathCoords=[[origin.lat,origin.lng]];
      st.stops.forEach(s=>{
        if(!s.lat||!s.lng)return;
        pathCoords.push([s.lat,s.lng]);
        bounds.push([s.lat,s.lng]);
        const bg=s.isPickup?"#2563eb":"#2D6A4F";
        const border=s.pinned?"3px solid #FFD700":"2px solid white";
        const icon=window.L.divIcon({html:'<div style="background:'+bg+';color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;border:'+border+';box-shadow:0 2px 4px rgba(0,0,0,0.3)">'+s.position+'</div>',className:"",iconSize:[28,28],iconAnchor:[14,14]});
        const info=s.orders.map(o=>(o._clienteNombre||o.idCliente)).join(", ");
        window.L.marker([s.lat,s.lng],{icon,title:s.label}).addTo(map).bindPopup("<b>"+s.position+". "+s.label+"</b><br>ETA: "+s.etaStr+" ("+s.etaRange+")<br>"+info);
      });
      // Destination marker (red)
      const rIcon=window.L.divIcon({html:'<div style="background:#dc2626;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">F</div>',className:"",iconSize:[28,28],iconAnchor:[14,14]});
      pathCoords.push([dest.lat,dest.lng]);
      bounds.push([dest.lat,dest.lng]);
      window.L.marker([dest.lat,dest.lng],{icon:rIcon,title:"Llegada: "+(dest.nombre||"Destino")}).addTo(map).bindPopup("Llegada: "+(dest.nombre||"Destino"));
      // Polyline
      window.L.polyline(pathCoords,{color:COLORS.primary,weight:3,opacity:0.8}).addTo(map);
      if(bounds.length>1)map.fitBounds(bounds,{padding:[30,30]});
      mapInstances[rutaName]=map;
    }catch(e){console.error("Map error:",e);}
  },[routeStates,mapElems,mapInstances]);

  // Toggle map
  const toggleMap=useCallback((rutaName)=>{
    setExpandedMap(prev=>{
      const nv={...prev,[rutaName]:!prev[rutaName]};
      if(nv[rutaName])setTimeout(()=>renderMap(rutaName),200);
      return nv;
    });
  },[renderMap]);

  // Export WhatsApp text
  const exportWhatsApp=useCallback((rutaName)=>{
    const st=routeStates[rutaName];if(!st||!st.stops)return;
    let txt="RutaVerde - Ruta "+rutaName+"\n";
    txt+=dia1+(dia2?" y "+dia2:"")+" | Inicio: "+st.startTime+"\n";
    txt+=st.stops.length+" paradas | ~"+st.totalDistKm+" km | ~"+st.totalDurMin+" min\n\n";
    st.stops.forEach(s=>{
      const totalG=s.orders.reduce((a,o)=>a+o.canGRD,0);
      const totalP=s.orders.reduce((a,o)=>a+o.canPEQ,0);
      if(s.isPickup){
        txt+=s.position+". "+s.pkName+" (Recolección - "+s.orders.length+" pedidos)\n";
      } else {
        const names=s.orders.map(o=>o._clienteNombre||o.idCliente).join(", ");
        txt+=s.position+". "+names+" - "+(s.orders[0]?._canton||"")+(s.orders[0]?._distrito?", "+s.orders[0]._distrito:"")+"\n";
      }
      txt+="   "+totalG+"G "+totalP+"P";
      const pagos=[...new Set(s.orders.map(o=>o.pago).filter(Boolean))];
      if(pagos.length)txt+=" | "+pagos.join("/");
      txt+=" | ~"+s.etaStr+"\n";
      const notas=s.orders.map(o=>o.notas).filter(Boolean);
      if(notas.length)txt+="   "+notas.join("; ")+"\n";
      if(s.lat&&s.lng)txt+="   https://www.google.com/maps?q="+s.lat+","+s.lng+"\n";
      txt+="\n";
    });
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(()=>{setCopyMsg(rutaName);setTimeout(()=>setCopyMsg(null),2000);}).catch(()=>{fallbackCopy(txt,rutaName);});
      } else {fallbackCopy(txt,rutaName);}
    }catch(e){fallbackCopy(txt,rutaName);}
  },[routeStates,dia1,dia2]);

  const fallbackCopy=useCallback((txt,rutaName)=>{
    try{
      const ta=document.createElement("textarea");
      ta.value=txt;ta.style.position="fixed";ta.style.left="-9999px";
      document.body.appendChild(ta);ta.select();
      document.execCommand("copy");document.body.removeChild(ta);
      setCopyMsg(rutaName);setTimeout(()=>setCopyMsg(null),2000);
    }catch(e2){setCopyMsg("error");}
  },[]);

  // Generate WhatsApp link for a stop's client
  const waLink=useCallback((stop,dia)=>{
    if(stop.isPickup)return null;
    // Get first order with phone
    const oWithPhone=stop.orders.find(o=>o._telefono);
    if(!oWithPhone)return null;
    let phone=oWithPhone._telefono.replace(/[^0-9]/g,"");
    if(phone.length===8)phone="506"+phone;
    const name=oWithPhone._clienteNombre||oWithPhone.idCliente;
    const txt="Hola "+name+", le saluda Marcelo. Su pedido esta programado para "+dia+" con hora aproximada de llegada entre "+stop.etaRange+". Quedo atento ante cualquier consulta.";
    return"https://wa.me/"+phone+"?text="+encodeURIComponent(txt);
  },[]);

  // Google Maps URL
  const gmapsUrl=useCallback((rutaName)=>{
    const st=routeStates[rutaName];if(!st||!st.stops||!st.config)return"";
    const pts=[st.config.puntoSalida.lat+","+st.config.puntoSalida.lng];
    st.stops.slice(0,10).forEach(s=>{if(s.lat&&s.lng)pts.push(s.lat+","+s.lng);});
    pts.push(st.config.puntoLlegada.lat+","+st.config.puntoLlegada.lng);
    return"https://www.google.com/maps/dir/"+pts.join("/");
  },[routeStates]);

  if(loading)return(<div style={{...S.card,textAlign:"center",padding:40,color:COLORS.textMuted}}>Cargando pedidos...</div>);
  if(!orders.length)return(<div style={{...S.card,textAlign:"center",padding:40,color:COLORS.textMuted}}>No hay pedidos cargados. Ve a la pestaña Pedidos primero.</div>);

  const rutaNames=Object.keys(groupedByRuta).sort();
  const unassigned=orders.filter(o=>!o.ruta).length;

  return(<div>
    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:16,fontWeight:700}}>Optimización de Rutas</div><div style={{fontSize:12,color:COLORS.textMuted}}>{dia1}{dia2?" y "+dia2:""} | {orders.length} pedidos en {rutaNames.length} rutas</div></div>
      </div>
      {unassigned>0&&<div style={{marginTop:8,padding:"6px 12px",background:COLORS.warnBg,borderRadius:8,fontSize:12,color:COLORS.warn,fontWeight:600}}>{unassigned} pedidos sin asignar (no se optimizan)</div>}
      <div style={{marginTop:8,padding:"6px 12px",background:COLORS.infoBg,borderRadius:8,fontSize:11,color:COLORS.info}}>Optimización usa OSRM (rutas reales por carretera). Si OSRM no está disponible, usa estimación local como respaldo.</div>
    </div>

    {rutaNames.map(rk=>{
      const val=validateRoute(rk);
      const st=routeStates[rk];
      const isOpt=st?.optimized;
      const isOptimizing=st?.optimizing;
      const stopsData=isOpt?st.stops:val.stops;
      const totalG=(groupedByRuta[rk]||[]).reduce((a,o)=>a+o.canGRD,0);
      const totalP=(groupedByRuta[rk]||[]).reduce((a,o)=>a+o.canPEQ,0);
      const pinnedCount=val.stops.filter(s=>s.pinned).length;

      return(<div key={rk} style={{...S.card,borderLeft:"4px solid "+(val.valid?COLORS.primary:COLORS.danger)}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:COLORS.primary}}>{rk}</div>
            <div style={{fontSize:12,color:COLORS.textMuted}}>{(groupedByRuta[rk]||[]).length} pedidos | {val.stops.length} paradas | {totalG}G {totalP}P{pinnedCount>0?" | "+pinnedCount+" pinned":""}</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {isOpt&&<span style={S.badge(st.manualOrder?"yellow":"green")}>{st.manualOrder?"Orden manual":"Optimizada"}</span>}
            {val.valid&&<button style={S.btn(isOptimizing?"ghost":"primary")} disabled={isOptimizing} onClick={()=>optimizeRoute(rk)}>{isOptimizing?"Optimizando...":isOpt?"Re-optimizar":"Optimizar"}</button>}
          </div>
        </div>

        {val.errors.length>0&&<div style={{padding:"8px 12px",background:COLORS.dangerBg,borderRadius:8,marginBottom:8}}>{val.errors.map((e,i)=><div key={i} style={{fontSize:12,color:COLORS.danger}}>{e}</div>)}</div>}
        {st?.error&&<div style={{padding:"8px 12px",background:COLORS.dangerBg,borderRadius:8,marginBottom:8,fontSize:12,color:COLORS.danger}}>{st.error}</div>}

        {isOpt&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12,textAlign:"center"}}>
            <div style={{padding:8,background:COLORS.bg,borderRadius:8}}><div style={{fontSize:18,fontWeight:800,color:COLORS.primary}}>{st.stops.length}</div><div style={{fontSize:10,color:COLORS.textMuted}}>Paradas</div></div>
            <div style={{padding:8,background:COLORS.bg,borderRadius:8}}><div style={{fontSize:18,fontWeight:800,color:COLORS.primary}}>{st.totalDistKm} km</div><div style={{fontSize:10,color:COLORS.textMuted}}>Distancia</div></div>
            <div style={{padding:8,background:COLORS.bg,borderRadius:8}}><div style={{fontSize:18,fontWeight:800,color:COLORS.primary}}>{st.totalDurMin} min</div><div style={{fontSize:10,color:COLORS.textMuted}}>Duración</div></div>
            <div style={{padding:8,background:COLORS.bg,borderRadius:8}}><div style={{fontSize:18,fontWeight:800,color:COLORS.primary}}>{st.startTime}-{st.endTime}</div><div style={{fontSize:10,color:COLORS.textMuted}}>Horario</div></div>
          </div>

          <div style={{overflow:"auto",marginBottom:12}}>
            <table style={S.table}><thead><tr><th style={{...S.th,width:30}}>#</th><th style={S.th}>Parada</th><th style={S.th}>Pedidos</th><th style={S.th}>Cajas</th><th style={S.th}>ETA</th><th style={{...S.th,width:40}}>Pin</th><th style={{...S.th,width:50}}>Orden</th><th style={{...S.th,width:60}}>Nav</th></tr></thead>
            <tbody>{st.stops.map((s,i)=>{
              const tG=s.orders.reduce((a,o)=>a+o.canGRD,0);
              const tP=s.orders.reduce((a,o)=>a+o.canPEQ,0);
              return(<tr key={s.key} style={{background:s.pinned?"#fffde7":"transparent"}}>
                <td style={{...S.td,fontFamily:mono,fontWeight:700,textAlign:"center"}}>{s.position}</td>
                <td style={S.td}><div style={{fontWeight:600,fontSize:12}}>{s.label}{s.pinned&&<span style={{marginLeft:4}}>{"📌"}{s.pinnedPosition}</span>}</div>{s.isPickup&&<span style={S.badge("blue")}>REC</span>}<div style={{fontSize:10,color:COLORS.textMuted}}>{s.orders[0]?._canton||""}{s.orders[0]?._distrito?", "+s.orders[0]._distrito:""}</div></td>
                <td style={{...S.td,fontSize:11,textAlign:"center"}}>{s.orders.length}</td>
                <td style={{...S.td,fontFamily:mono,fontSize:11}}>{tG}G {tP}P</td>
                <td style={S.td}><div style={{fontSize:12,fontWeight:600}}>{s.etaStr}</div><div style={{fontSize:10,color:COLORS.textMuted}}>{s.etaRange}</div></td>
                <td style={{...S.td,textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:2,justifyContent:"center"}}><button style={{background:s.pinned?"#ffc107":"#e0e0e0",border:"none",borderRadius:4,padding:"2px 5px",cursor:"pointer",fontSize:11}} onClick={()=>togglePin(rk,i)}>{s.pinned?"📌":"○"}</button>{s.pinned&&<input value={s.pinnedPosition||1} style={{width:28,padding:"1px 2px",border:"1px solid "+COLORS.border,borderRadius:3,fontSize:10,textAlign:"center"}} onChange={e=>setPinPosition(rk,i,parseInt(e.target.value)||1)}/>}</div></td>
                <td style={{...S.td,textAlign:"center"}}><button style={{border:"none",background:"none",cursor:"pointer",fontSize:14,padding:0}} onClick={()=>moveStop(rk,i,-1)} disabled={i===0}>{"▲"}</button><button style={{border:"none",background:"none",cursor:"pointer",fontSize:14,padding:0}} onClick={()=>moveStop(rk,i,1)} disabled={i===st.stops.length-1}>{"▼"}</button></td>
                <td style={{...S.td,textAlign:"center"}}>{s.lat&&s.lng&&<div style={{display:"flex",flexDirection:"column",gap:2}}><a href={"https://www.google.com/maps?q="+s.lat+","+s.lng} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:COLORS.info,textDecoration:"none"}}>Maps</a><a href={"https://waze.com/ul?ll="+s.lat+","+s.lng+"&navigate=yes"} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#33ccff",textDecoration:"none"}}>Waze</a>{waLink(s,dia1+(dia2?" y "+dia2:""))&&<a href={waLink(s,dia1+(dia2?" y "+dia2:""))} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#25d366",textDecoration:"none"}}>WA</a>}</div>}</td>
              </tr>);
            })}</tbody></table>
          </div>

          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            <button style={S.btn("outline")} onClick={()=>toggleMap(rk)}>{expandedMap[rk]?"Ocultar Mapa":"Ver Mapa"}</button>
            <button style={S.btn("accent")} onClick={()=>exportWhatsApp(rk)}>{copyMsg===rk?"Copiado!":"Copiar WhatsApp"}</button>
            <a href={gmapsUrl(rk)} target="_blank" rel="noopener noreferrer" style={{...S.btn("outline"),textDecoration:"none"}}>Abrir Google Maps</a>
            {st.stops.length>10&&<span style={{fontSize:11,color:COLORS.warn,alignSelf:"center"}}>Google Maps URL limitado a 10 paradas</span>}
          </div>

          {expandedMap[rk]&&<div ref={el=>{if(el)mapElems[rk]=el;}} style={{width:"100%",height:400,borderRadius:12,border:"1px solid "+COLORS.border,marginTop:8,background:"#e5e7eb"}}></div>}
        </div>}

        {!isOpt&&val.valid&&<div style={{fontSize:12,color:COLORS.textMuted,padding:8}}>Listo para optimizar. {val.stops.length} paradas detectadas.</div>}
      </div>);
    })}
  </div>);
}

// ============================================================
// MODULE 3: VISTA REPARTIDOR
// ============================================================
const DIAS_SEMANA=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
function getDiaHoy(){return DIAS_SEMANA[new Date().getDay()];}

function DriverView({drivers}){
  const[optimizedData,setOptimizedData]=useState(null);
  const[selectedDriver,setSelectedDriver]=useState(null);
  const[selectedDia,setSelectedDia]=useState(null);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const opt=await sLoad(KEYS.optimized);
    setOptimizedData(opt);
    setLoading(false);
  })();},[]);

  // Refresh data when becoming visible or driver changes
  const refreshData=useCallback(async()=>{
    const opt=await sLoad(KEYS.optimized);
    setOptimizedData(opt);
  },[]);

  useEffect(()=>{refreshData();},[selectedDriver]);

  const activeDrivers=useMemo(()=>(drivers||[]).filter(d=>d.activo),[drivers]);

  // Available days from optimized data
  const availableDias=useMemo(()=>{
    if(!optimizedData?.routes)return[];
    const dias=[];
    if(optimizedData.dia1)dias.push(optimizedData.dia1);
    if(optimizedData.dia2)dias.push(optimizedData.dia2);
    return dias;
  },[optimizedData]);

  // Auto-select day
  useEffect(()=>{
    if(selectedDriver&&availableDias.length>0&&!selectedDia){
      const hoy=getDiaHoy();
      setSelectedDia(availableDias.includes(hoy)?hoy:availableDias[0]);
    }
  },[availableDias,selectedDia,selectedDriver]);

  // Current route for selected driver
  const currentRoute=useMemo(()=>{
    if(!selectedDriver||!optimizedData?.routes)return null;
    return optimizedData.routes[selectedDriver.nombre]||null;
  },[selectedDriver,optimizedData]);

  if(loading)return(<div style={{padding:40,textAlign:"center",color:COLORS.textMuted}}>Cargando datos del repartidor...</div>);

  // Driver selection
  if(!selectedDriver){
    if(activeDrivers.length===0)return(<div style={{...S.card,textAlign:"center",padding:40}}><div style={{fontSize:16,fontWeight:700,color:COLORS.text,marginBottom:8}}>No hay repartidores activos</div><div style={{fontSize:13,color:COLORS.textMuted}}>{"Configurá repartidores en la pestaña Rutas > Repartidores."}</div></div>);
    return(<div style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{...S.card,textAlign:"center",padding:"24px 20px"}}><div style={{fontSize:18,fontWeight:700,color:COLORS.primary,marginBottom:4}}>Vista Repartidor</div><div style={{fontSize:13,color:COLORS.textMuted}}>{"Seleccioná el repartidor para ver su ruta del día."}</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:10,padding:"0 4px"}}>
        {activeDrivers.map(d=>(<button key={d.id} onClick={()=>{setSelectedDriver(d);setSelectedDia(null);}} style={{
          ...S.card,padding:"16px 20px",cursor:"pointer",border:"2px solid "+COLORS.border,display:"flex",alignItems:"center",gap:14,transition:"all 0.15s",marginBottom:0
        }}>
          <div style={{width:44,height:44,borderRadius:"50%",background:COLORS.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,flexShrink:0}}>{d.nombre.charAt(0)}</div>
          <span style={{fontSize:17,fontWeight:700,color:COLORS.text}}>{d.nombre}</span>
        </button>))}
      </div>
    </div>);
  }

  // Route view
  const totalG=currentRoute?currentRoute.stops.reduce((a,s)=>a+s.orders.reduce((b,o)=>b+(o.canGRD||0),0),0):0;
  const totalP=currentRoute?currentRoute.stops.reduce((a,s)=>a+s.orders.reduce((b,o)=>b+(o.canPEQ||0),0),0):0;

  return(<div style={{maxWidth:540,margin:"0 auto"}}>
    {/* Sub-header with back button */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <button onClick={()=>{setSelectedDriver(null);setSelectedDia(null);}} style={{...S.btn("outline"),padding:"6px 14px",fontSize:12}}>
        {"← Cambiar"}
      </button>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:18,fontWeight:800,color:COLORS.primary}}>{selectedDriver.nombre}</div>
        {availableDias.length>0&&<div style={{fontSize:11,color:COLORS.textMuted}}>{availableDias.join(" y ")}</div>}
      </div>
    </div>

    {/* Day selector */}
    {availableDias.length>1&&<div style={{display:"flex",gap:6,marginBottom:12}}>
      {availableDias.map(d=>(<button key={d} onClick={()=>setSelectedDia(d)} style={{
        padding:"8px 18px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,
        background:d===selectedDia?COLORS.primary:"#e5e7eb",color:d===selectedDia?"#fff":COLORS.text,transition:"all 0.15s"
      }}>{d}</button>))}
    </div>}

    {!currentRoute?(<div style={{...S.card,textAlign:"center",padding:40}}>
      <div style={{fontSize:40,marginBottom:12}}>{"🗺️"}</div>
      <div style={{fontSize:16,fontWeight:700,color:COLORS.text,marginBottom:8}}>No hay ruta optimizada</div>
      <div style={{fontSize:13,color:COLORS.textMuted,lineHeight:1.5}}>{"No se encontró ruta optimizada para "}<strong>{selectedDriver.nombre}</strong>{". Optimizá primero desde la pestaña Rutas > Optimizar."}</div>
    </div>):(<div>
      {/* Summary */}
      <div style={{...S.card,padding:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,textAlign:"center"}}>
          <div><div style={{fontSize:20,fontWeight:800,color:COLORS.primary,fontFamily:mono}}>{currentRoute.stops.length}</div><div style={{fontSize:10,color:COLORS.textMuted,fontWeight:600}}>Paradas</div></div>
          <div><div style={{fontSize:20,fontWeight:800,color:COLORS.primary,fontFamily:mono}}>{currentRoute.totalDistKm}</div><div style={{fontSize:10,color:COLORS.textMuted,fontWeight:600}}>km</div></div>
          <div><div style={{fontSize:16,fontWeight:800,color:COLORS.primary,fontFamily:mono}}>{currentRoute.startTime}-{currentRoute.endTime}</div><div style={{fontSize:10,color:COLORS.textMuted,fontWeight:600}}>Horario</div></div>
          <div><div style={{fontSize:20,fontWeight:800,color:COLORS.primary,fontFamily:mono}}>{totalG}G {totalP}P</div><div style={{fontSize:10,color:COLORS.textMuted,fontWeight:600}}>Cajas</div></div>
        </div>
      </div>

      {/* Start point */}
      {currentRoute.config?.puntoSalida&&<div style={{...S.card,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderLeft:"4px solid "+COLORS.success}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:COLORS.success,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,flexShrink:0}}>S</div>
        <div><div style={{fontSize:11,fontWeight:600,color:COLORS.success,textTransform:"uppercase",letterSpacing:"0.5px"}}>Punto de salida</div><div style={{fontSize:14,fontWeight:700}}>{currentRoute.config.puntoSalida.nombre||"Origen"}</div></div>
      </div>}

      {/* Stop cards */}
      {currentRoute.stops.map((stop,idx)=>{
        const stG=stop.orders.reduce((a,o)=>a+(o.canGRD||0),0);
        const stP=stop.orders.reduce((a,o)=>a+(o.canPEQ||0),0);
        const pagos=[...new Set(stop.orders.map(o=>o.pago).filter(Boolean))];
        const notas=stop.orders.map(o=>o.notas).filter(Boolean);
        const senas=stop.orders.map(o=>o._senas).filter(Boolean);
        const telefono=stop.orders.find(o=>o._telefono)?._telefono||"";
        const isPickup=stop.isPickup;

        // Navigation links
        const mapsLink=(stop.lat&&stop.lng)?"https://www.google.com/maps/dir/?api=1&destination="+stop.lat+","+stop.lng+"&travelmode=driving":null;
        const wazeLink=(stop.lat&&stop.lng)?"https://waze.com/ul?ll="+stop.lat+","+stop.lng+"&navigate=yes":null;

        // WhatsApp link
        let waLnk=null;
        if(!isPickup&&telefono){
          let phone=telefono.replace(/[^0-9]/g,"");
          if(phone.length===8)phone="506"+phone;
          const cName=stop.orders[0]?._clienteNombre||stop.orders[0]?.idCliente||"";
          const msg="Hola "+cName+", le saluda "+selectedDriver.nombre+". Estaré llegando con su pedido en unos 10 a 15 minutos. Saludos.";
          waLnk="https://wa.me/"+phone+"?text="+encodeURIComponent(msg);
        }

        return(<div key={stop.key||idx} style={{...S.card,padding:0,overflow:"hidden"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid "+COLORS.border}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:isPickup?COLORS.info:COLORS.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,fontFamily:mono,flexShrink:0}}>{stop.position}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:700,color:COLORS.text}}>
                {stop.label}
                {isPickup&&<span style={{...S.badge("blue"),marginLeft:8,fontSize:10}}>{"RECOLECCIÓN"}</span>}
              </div>
              <div style={{fontSize:12,color:COLORS.textMuted,marginTop:1}}>{stop.orders[0]?._canton||""}{stop.orders[0]?._distrito?", "+stop.orders[0]._distrito:""}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:15,fontWeight:700,color:COLORS.primary,fontFamily:mono}}>{stop.etaStr}</div>
              <div style={{fontSize:10,color:COLORS.textMuted}}>{stop.etaRange}</div>
            </div>
          </div>

          {/* Details */}
          <div style={{padding:"10px 16px 8px"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              <span style={{...S.badge("green"),fontFamily:mono}}>{stG>0?stG+"G ":""}{stP>0?stP+"P":""}{!stG&&!stP?"0":""}</span>
              {pagos.map(p=><span key={p} style={S.badge("yellow")}>{p}</span>)}
              {stop.orders.length>1&&<span style={{...S.badge("blue"),background:COLORS.bg,color:COLORS.textMuted}}>{stop.orders.length} pedidos</span>}
            </div>
            {isPickup&&stop.orders.length>0&&<div style={{background:COLORS.infoBg,borderRadius:10,padding:"8px 12px",marginBottom:8,fontSize:12,color:COLORS.info}}>
              <div style={{fontWeight:700,marginBottom:4}}>Pedidos en esta {"recolección"}:</div>
              {stop.orders.map(o=><div key={o.numPedido}>{"#"}{o.numPedido} - {o._clienteNombre||o.idCliente} ({o.canGRD>0?o.canGRD+"G ":""}{o.canPEQ>0?o.canPEQ+"P":""})</div>)}
            </div>}
            {notas.length>0&&<div style={{background:COLORS.warnBg,borderRadius:10,padding:"8px 12px",marginBottom:8,fontSize:12,color:COLORS.warn}}><span style={{fontWeight:700}}>Notas: </span>{notas.join(" | ")}</div>}
            {senas.length>0&&<div style={{background:"#f0f9ff",borderRadius:10,padding:"8px 12px",marginBottom:8,fontSize:12,color:"#0369a1"}}><span style={{fontWeight:700}}>{"Señas"}: </span>{senas.join(" | ")}</div>}
            {telefono&&!isPickup&&<div style={{fontSize:12,color:COLORS.textMuted,marginBottom:6}}>Tel: <a href={"tel:"+telefono} style={{color:COLORS.primary,fontWeight:600,textDecoration:"none"}}>{telefono}</a></div>}
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",borderTop:"1px solid "+COLORS.border}}>
            {mapsLink&&<a href={mapsLink} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"12px 8px",textAlign:"center",textDecoration:"none",fontSize:12,fontWeight:700,color:COLORS.primary,fontFamily:font,borderRight:"1px solid "+COLORS.border}}>Maps</a>}
            {wazeLink&&<a href={wazeLink} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"12px 8px",textAlign:"center",textDecoration:"none",fontSize:12,fontWeight:700,color:"#33ccff",fontFamily:font,borderRight:waLnk?"1px solid "+COLORS.border:"none"}}>Waze</a>}
            {waLnk&&<a href={waLnk} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"12px 8px",textAlign:"center",textDecoration:"none",fontSize:12,fontWeight:700,color:"#25d366",fontFamily:font}}>WhatsApp</a>}
            {!mapsLink&&!wazeLink&&!waLnk&&<div style={{flex:1,padding:"12px 8px",textAlign:"center",fontSize:12,color:COLORS.textMuted}}>Sin GPS</div>}
          </div>
        </div>);
      })}

      {/* End point */}
      {currentRoute.config?.puntoLlegada&&<div style={{...S.card,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderLeft:"4px solid "+COLORS.danger}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:COLORS.danger,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,flexShrink:0}}>F</div>
        <div><div style={{fontSize:11,fontWeight:600,color:COLORS.danger,textTransform:"uppercase",letterSpacing:"0.5px"}}>Punto de llegada</div><div style={{fontSize:14,fontWeight:700}}>{currentRoute.config.puntoLlegada.nombre||"Destino"}</div></div>
      </div>}

      {/* Full route in Maps */}
      {(()=>{
        const pts=[currentRoute.config.puntoSalida.lat+","+currentRoute.config.puntoSalida.lng];
        currentRoute.stops.forEach(s=>{if(s.lat&&s.lng)pts.push(s.lat+","+s.lng);});
        pts.push(currentRoute.config.puntoLlegada.lat+","+currentRoute.config.puntoLlegada.lng);
        const url="https://www.google.com/maps/dir/"+pts.join("/");
        return(<div style={{marginBottom:16}}><a href={url} target="_blank" rel="noopener noreferrer" style={{display:"block",padding:16,borderRadius:12,textAlign:"center",background:COLORS.primary,color:"#fff",textDecoration:"none",fontSize:14,fontWeight:700,fontFamily:font}}>Abrir ruta completa en Google Maps</a>
          {currentRoute.stops.length>10&&<div style={{textAlign:"center",fontSize:11,color:COLORS.warn,marginTop:6}}>Google Maps puede limitar la cantidad de paradas</div>}
        </div>);
      })()}
    </div>)}
  </div>);
}

// ============================================================
// SEED DATA (abbreviated - full dataset from CSV import)
// ============================================================
const SEED_TSV=`4-ACU|Adela|Cuadra|Adela Cuadra|||San José|Curridabat|||||
1-AOR|Adrián|Orozco|Adrián Orozco|||Alajuela|San Ramón|||||
1-ADR|Adriana|Blanco|Adriana Blanco|88720512||Alajuela|Palmares|||||
2-BHO|Bart|Hodister|Bart Hodister|60445966|barthodister@hotmail.com|Alajuela|Atenas||Lomas del Paraiso|||`;

// ============================================================
// MAIN APP
// ============================================================
function App(){
  const[module,setModule]=useState("clients");
  const[loading,setLoading]=useState(true);
  const[clients,setClients]=useState([]);
  const[drivers,setDrivers]=useState([]);
  const[pickups,setPickups]=useState([]);
  const[routes,setRoutes]=useState([]);
  const[m2Tab,setM2Tab]=useState("drivers");
  const[optRefresh,setOptRefresh]=useState(0);
  const[saving,setSaving]=useState(false);

  useEffect(()=>{(async()=>{
    await preloadCache(Object.values(KEYS));
    const[cl,dr,pk,rt]=await Promise.all([sLoad(KEYS.clients),sLoad(KEYS.drivers),sLoad(KEYS.pickups),sLoad(KEYS.routes)]);
    if(cl?.length>0)setClients(cl);else{const seed=parseSeedTSV(SEED_TSV);setClients(seed);await sSave(KEYS.clients,seed);}
    if(dr?.length>0)setDrivers(dr);else{const seed=[{id:"drv-adriana",nombre:"Adriana",telefono:"",activo:true},{id:"drv-mario",nombre:"Mario",telefono:"",activo:true},{id:"drv-fanny",nombre:"Fanny",telefono:"",activo:true}];setDrivers(seed);await sSave(KEYS.drivers,seed);}
    if(pk?.length>0)setPickups(pk);else{const seed=[{id:"pk-grecia",nombre:"Feria Grecia",provincia:"Alajuela",canton:"Grecia",distrito:"Grecia",direccion:"",lat:10.0733,lng:-84.3116,activo:true},{id:"pk-atenas",nombre:"Ticas Café Atenas",provincia:"Alajuela",canton:"Atenas",distrito:"Atenas",direccion:"",lat:9.9784,lng:-84.3788,activo:true}];setPickups(seed);await sSave(KEYS.pickups,seed);}
    setRoutes(rt||[]);
    setLoading(false);
  })();},[]);

  const updateClients=useCallback((data)=>{setClients(data);sSave(KEYS.clients,data);},[]);
  const saveDrivers=useCallback(d=>sSave(KEYS.drivers,d),[]);
  const savePickups=useCallback(p=>sSave(KEYS.pickups,p),[]);
  const saveRoutes=useCallback(r=>sSave(KEYS.routes,r),[]);

  if(loading)return(<div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:COLORS.primary}}>RutaVerde</div><div style={{fontSize:13,color:COLORS.textMuted,marginTop:4}}>Cargando...</div></div></div>);

  return(<div style={S.app}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');*::-webkit-scrollbar{width:6px;height:6px}*::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}`}</style>

    <div style={S.header}>
      <div><div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.5px"}}>RutaVerde</div><div style={{fontSize:12,opacity:0.8,marginTop:2}}>{module==="clients"?"Clientes":module==="driver"?"Repartidor":"Rutas y Pedidos"}</div></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:12,opacity:0.7}}>{clients.length} clientes</span>
        <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.3)",background:module==="clients"?"rgba(255,255,255,0.2)":"transparent",color:"white",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:font}} onClick={()=>setModule("clients")}>Clientes</button>
        <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.3)",background:module==="routes"?"rgba(255,255,255,0.2)":"transparent",color:"white",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:font}} onClick={()=>setModule("routes")}>Rutas</button>
        <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.3)",background:module==="driver"?"rgba(255,255,255,0.2)":"transparent",color:"white",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:font}} onClick={()=>setModule("driver")}>Repartidor</button>
      </div>
    </div>

    <div style={S.content}>
      {module==="clients"&&<ClientsModule clients={clients} updateClients={updateClients}/>}
      {module==="driver"&&<DriverView drivers={drivers}/>}
      {module==="routes"&&<div>
        <div style={S.tabs}>{[["drivers","Repartidores"],["pickups","Puntos Recolección"],["routes","Rutas y Zonas"],["orders","Pedidos"],["optimize","Optimizar"]].map(([k,l])=>(<button key={k} style={S.tab(m2Tab===k)} onClick={()=>{setM2Tab(k);if(k==="optimize")setOptRefresh(p=>p+1);}}>{l}</button>))}</div>
        {m2Tab==="drivers"&&<DriversTab drivers={drivers} setDrivers={setDrivers} save={saveDrivers}/>}
        {m2Tab==="pickups"&&<PickupsTab pickups={pickups} setPickups={setPickups} save={savePickups}/>}
        {m2Tab==="routes"&&<RoutesTab routes={routes} setRoutes={setRoutes} saveRoutes={saveRoutes} drivers={drivers}/>}
        {m2Tab==="orders"&&<OrdersTab drivers={drivers} pickups={pickups} routes={routes} clients={clients}/>}
        <div style={{display:m2Tab==="optimize"?"block":"none"}}><OptimizeTab routes={routes} pickups={pickups} clients={clients} refreshKey={optRefresh}/></div>
      </div>}
    </div>
  </div>);
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(e => console.log("SW:", e));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
