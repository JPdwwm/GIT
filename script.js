/* ============================================================
   Data model — deux sociétés de démonstration (multi-tenant)
   ============================================================ */
const COMPANIES = {
  nova: {
    name: "Nova Industries",
    sector: "Industrie / Manufacturing",
    dotColor: "var(--source-a)",
    kpis: { open: 18, openDelta: "+3 vs mois dernier", mttr: "4,2", mttrDelta: "-0,6 j", closeRate: 87, closeDelta: "+4 pts", causes: 6, causesDelta: "stable" },
    types: [
      { label: "Phishing ciblé", value: 34 },
      { label: "Poste compromis", value: 21 },
      { label: "Tentative d'intrusion", value: 18 },
      { label: "Accès non autorisé", value: 14 },
      { label: "Fuite de données", value: 9 },
      { label: "Ransomware", value: 4 },
    ],
    gravite: [
      { key: "haute", label: "Haute", value: 22 },
      { key: "moyenne", label: "Moyenne", value: 46 },
      { key: "faible", label: "Faible", value: 32 },
    ],
    source: [
      { label: "Remontée métier", value: 63, color: "var(--source-a)" },
      { label: "Détection supervision", value: 37, color: "var(--source-b)" },
    ],
    trend: { months: ["Sep","Oct","Nov","Déc","Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû"], values: [5,7,6,9,8,11,10,13,9,12,14,11] },
    causes: [
      { label: "Absence de MFA sur comptes à privilèges", value: 12 },
      { label: "Sensibilisation phishing insuffisante", value: 9 },
      { label: "Postes non patchés (CVE connue)", value: 7 },
      { label: "Partage d'identifiants entre collaborateurs", value: 5 },
      { label: "Règles pare-feu trop permissives", value: 4 },
    ],
    incidents: [
      { id:"INC-0142", titre:"Mail frauduleux imitant la DAF", type:"Phishing ciblé", gravite:"haute", statut:"en_analyse", source:"metier", date:"22/08/2026" },
      { id:"INC-0141", titre:"Connexion suspecte hors plage horaire", type:"Accès non autorisé", gravite:"moyenne", statut:"en_cours", source:"supervision", date:"21/08/2026" },
      { id:"INC-0139", titre:"Poste infecté par un dropper", type:"Poste compromis", gravite:"haute", statut:"en_cours", source:"supervision", date:"19/08/2026" },
      { id:"INC-0136", titre:"Scan de ports depuis IP externe", type:"Tentative d'intrusion", gravite:"faible", statut:"resolu", source:"supervision", date:"15/08/2026" },
      { id:"INC-0133", titre:"Pièce jointe .eml suspecte signalée", type:"Phishing ciblé", gravite:"moyenne", statut:"nouveau", source:"metier", date:"14/08/2026" },
      { id:"INC-0129", titre:"Export massif d'un dossier RH", type:"Fuite de données", gravite:"haute", statut:"cloture", source:"metier", date:"08/08/2026" },
    ],
  },
  aeroport: {
    name: "Aéroport Sud Logistique",
    sector: "Transport / Logistique",
    dotColor: "var(--source-b)",
    kpis: { open: 9, openDelta: "-2 vs mois dernier", mttr: "3,1", mttrDelta: "-0,2 j", closeRate: 93, closeDelta: "+1 pt", causes: 4, causesDelta: "+1" },
    types: [
      { label: "Tentative d'intrusion", value: 27 },
      { label: "Phishing ciblé", value: 16 },
      { label: "Accès non autorisé", value: 12 },
      { label: "Poste compromis", value: 8 },
      { label: "Fuite de données", value: 5 },
      { label: "Ransomware", value: 1 },
    ],
    gravite: [
      { key: "haute", label: "Haute", value: 11 },
      { key: "moyenne", label: "Moyenne", value: 29 },
      { key: "faible", label: "Faible", value: 29 },
    ],
    source: [
      { label: "Remontée métier", value: 21, color: "var(--source-a)" },
      { label: "Détection supervision", value: 48, color: "var(--source-b)" },
    ],
    trend: { months: ["Sep","Oct","Nov","Déc","Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû"], values: [8,6,9,7,10,9,7,6,8,5,7,6] },
    causes: [
      { label: "Périmètre réseau industriel mal segmenté", value: 8 },
      { label: "Absence de MFA sur comptes à privilèges", value: 6 },
      { label: "Badges d'accès partagés", value: 4 },
      { label: "Firmware IoT non mis à jour", value: 3 },
    ],
    incidents: [
      { id:"INC-0087", titre:"Balayage réseau détecté sur segment logistique", type:"Tentative d'intrusion", gravite:"moyenne", statut:"en_cours", source:"supervision", date:"23/08/2026" },
      { id:"INC-0085", titre:"Badge d'accès cloné signalé par le gardiennage", type:"Accès non autorisé", gravite:"haute", statut:"en_analyse", source:"metier", date:"20/08/2026" },
      { id:"INC-0082", titre:"Terminal de piste hors ligne après reboot suspect", type:"Poste compromis", gravite:"moyenne", statut:"resolu", source:"supervision", date:"12/08/2026" },
      { id:"INC-0079", titre:"Email de phishing ciblant la logistique", type:"Phishing ciblé", gravite:"faible", statut:"cloture", source:"metier", date:"05/08/2026" },
    ],
  },
};

let CURRENT = "nova";

/* ============================================================
   Small icon library (severity + status) — shape ≠ meaning by color alone
   ============================================================ */
const SEV_ICON = {
  haute: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 3 2 20h20L12 3Z" fill="currentColor"/><rect x="11" y="10" width="2" height="5" fill="var(--sev-high-soft)"/><rect x="11" y="16.5" width="2" height="2" fill="var(--sev-high-soft)"/></svg>`,
  moyenne: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2 22 12 12 22 2 12 12 2Z" fill="currentColor"/></svg>`,
  faible: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>`,
};
const SEV_LABEL = { haute: "Haute", moyenne: "Moyenne", faible: "Faible" };

const STATUS_ICON = {
  nouveau: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2.4"/></svg>`,
  en_cours: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 6.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg>`,
  en_analyse: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2.2"/><path d="m19 19-3.2-3.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  resolu: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4 12.5 9.5 18 20 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cloture: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="1.6" stroke="currentColor" stroke-width="2.1"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2.1"/></svg>`,
};
const STATUS_LABEL = { nouveau: "Nouveau", en_cours: "En cours", en_analyse: "En analyse", resolu: "Résolu", cloture: "Clôturé" };

function sevChip(key){
  return `<span class="sev-chip sev-${key}">${SEV_ICON[key]}${SEV_LABEL[key]}</span>`;
}
function statusPill(key){
  return `<span class="status-pill st-${key}">${STATUS_ICON[key]}${STATUS_LABEL[key]}</span>`;
}

/* ============================================================
   Tooltip helper (shared floating element per chart container)
   ============================================================ */
function attachTooltip(container){
  container.classList.add("chart-relative");
  const tip = document.createElement("div");
  tip.className = "chart-tooltip";
  container.appendChild(tip);
  return {
    show(x, y, html){
      tip.innerHTML = html;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
      tip.style.opacity = "1";
    },
    hide(){ tip.style.opacity = "0"; }
  };
}

/* ============================================================
   Horizontal bar chart (magnitude by category — single hue)
   ============================================================ */
function renderTypeChart(data){
  const el = document.getElementById("typeChart");
  const max = Math.max(...data.map(d => d.value));
  const tt = attachTooltip(el);
  const rowsHtml = data.map((d, i) => `
    <div class="hbar-row" data-i="${i}">
      <span class="lbl">${d.label}</span>
      <div class="hbar-track"><div class="hbar-fill" style="width:${(d.value/max*100).toFixed(1)}%"></div></div>
      <span class="val tabular">${d.value}</span>
    </div>`).join("");
  el.innerHTML = rowsHtml;
  el.querySelectorAll(".hbar-row").forEach((row, i) => {
    row.addEventListener("mouseenter", e => {
      const r = row.getBoundingClientRect(), cr = el.getBoundingClientRect();
      tt.show(r.left - cr.left + r.width/2, r.top - cr.top, `${data[i].label} : <b>${data[i].value}</b>`);
    });
    row.addEventListener("mousemove", e => {
      const r = row.getBoundingClientRect(), cr = el.getBoundingClientRect();
      tt.show(e.clientX - cr.left, r.top - cr.top);
    });
    row.addEventListener("mouseleave", () => tt.hide());
  });
  addDataToggle(el, "Voir les données", ["Type","Incidents"], data.map(d => [d.label, d.value]));
}

/* ============================================================
   Gravité bar chart — status-style semantic colours (fixed, not categorical order)
   ============================================================ */
function renderGraviteChart(data){
  const el = document.getElementById("graviteChart");
  const max = Math.max(...data.map(d => d.value));
  const tt = attachTooltip(el);
  el.innerHTML = data.map((d,i) => `
    <div class="grav-row" data-i="${i}">
      ${sevChip(d.key)}
      <div class="hbar-track"><div class="hbar-fill" style="width:${(d.value/max*100).toFixed(1)}%; background:var(--sev-${d.key==='haute'?'high':d.key==='moyenne'?'medium':'low'})"></div></div>
      <span class="val tabular">${d.value}</span>
    </div>`).join("");
  el.querySelectorAll(".grav-row").forEach((row,i) => {
    row.addEventListener("mouseenter", () => {
      const r = row.getBoundingClientRect(), cr = el.getBoundingClientRect();
      tt.show(r.left - cr.left + r.width/2, r.top - cr.top, `${data[i].label} : <b>${data[i].value}</b>`);
    });
    row.addEventListener("mouseleave", () => tt.hide());
  });
  addDataToggle(el, "Voir les données", ["Gravité","Incidents"], data.map(d => [d.label, d.value]));
}

/* ============================================================
   Donut chart (2 categories — direct labels + legend)
   ============================================================ */
function arcPath(cx, cy, r, a0, a1){
  const toXY = a => [cx + r*Math.cos(a), cy + r*Math.sin(a)];
  const [x0,y0] = toXY(a0), [x1,y1] = toXY(a1);
  const large = (a1 - a0) % (2*Math.PI) > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}
function renderSourceChart(data){
  const el = document.getElementById("sourceChart");
  const total = data.reduce((s,d) => s + d.value, 0);
  const cx = 64, cy = 64, r = 50, sw = 18;
  let angle = -Math.PI/2;
  const tt = attachTooltip(el);
  const arcs = data.map((d,i) => {
    const frac = d.value/total;
    const a0 = angle, a1 = angle + frac*2*Math.PI;
    angle = a1;
    return { ...d, i, a0, a1, pct: Math.round(frac*100) };
  });
  const svgArcs = arcs.map(a => `
    <path d="${arcPath(cx,cy,r,a.a0,a.a1)}" stroke="${a.color}" stroke-width="${sw}" fill="none" data-i="${a.i}" style="cursor:pointer"/>
  `).join("");
  const legend = arcs.map(a => `
    <div class="legend-row" data-i="${a.i}" style="cursor:pointer">
      <span class="swatch" style="background:${a.color}"></span>
      <span class="name">${a.label}</span>
      <span class="pct tabular">${a.pct}%</span>
    </div>`).join("");
  el.innerHTML = `
    <div class="donut-wrap">
      <svg class="donut-svg" width="128" height="128" viewBox="0 0 128 128">
        <circle cx="${cx}" cy="${cy}" r="${r}" stroke="var(--surface-sunken)" stroke-width="${sw}" fill="none"/>
        ${svgArcs}
        <text x="${cx}" y="${cy-4}" text-anchor="middle" class="donut-center" font-size="20" font-weight="700" fill="var(--ink)">${total}</text>
        <text x="${cx}" y="${cy+13}" text-anchor="middle" font-size="9.5" fill="var(--ink-muted)" font-family="Inter">incidents</text>
      </svg>
      <div class="donut-legend">${legend}</div>
    </div>`;
  const showFor = i => {
    const a = arcs[i];
    tt.show(64, 6, `${a.label} : <b>${a.value}</b> (${a.pct}%)`);
  };
  el.querySelectorAll("[data-i]").forEach(node => {
    node.addEventListener("mouseenter", () => showFor(+node.dataset.i));
    node.addEventListener("mouseleave", () => tt.hide());
  });
  addDataToggle(el, "Voir les données", ["Source","Incidents","Part"], arcs.map(a => [a.label, a.value, a.pct + "%"]));
}

/* ============================================================
   Trend line/area chart with crosshair + tooltip
   ============================================================ */
function renderTrendChart(trend){
  const el = document.getElementById("trendChart");
  const W = 640, H = 190, padL = 8, padR = 8, padT = 14, padB = 26;
  const vals = trend.values;
  const max = Math.max(...vals) * 1.15;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const x = i => padL + (i/(vals.length-1)) * innerW;
  const y = v => padT + innerH - (v/max)*innerH;
  const points = vals.map((v,i) => [x(i), y(v)]);
  const linePath = points.map((p,i) => (i===0?"M":"L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const areaPath = linePath + ` L ${points[points.length-1][0].toFixed(1)} ${padT+innerH} L ${points[0][0].toFixed(1)} ${padT+innerH} Z`;
  const gridLines = [0.25,0.5,0.75,1].map(f => {
    const gy = padT + innerH * (1-f);
    return `<line x1="${padL}" x2="${W-padR}" y1="${gy}" y2="${gy}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2 4"/>`;
  }).join("");
  const monthLabels = trend.months.map((m,i) => `<text x="${x(i)}" y="${H-6}" text-anchor="middle" font-size="10" fill="var(--ink-muted)" font-family="Inter">${m}</text>`).join("");
  const lastPt = points[points.length-1];

  el.innerHTML = `
    <svg class="trend-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:190px;">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="var(--chart-primary)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaPath}" fill="url(#trendFill)"/>
      <path d="${linePath}" fill="none" stroke="var(--chart-primary)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="4" fill="var(--chart-primary)" stroke="var(--surface)" stroke-width="2"/>
      <line id="crosshair" x1="0" y1="${padT}" x2="0" y2="${padT+innerH}" stroke="var(--ink-muted)" stroke-width="1" opacity="0"/>
      <circle id="crosshairDot" r="4.5" fill="var(--chart-primary)" stroke="var(--surface)" stroke-width="2" opacity="0"/>
      ${monthLabels}
      <rect id="hitArea" x="${padL}" y="0" width="${innerW}" height="${H}" fill="transparent"/>
    </svg>`;

  const svg = el.querySelector("svg");
  const crosshair = el.querySelector("#crosshair");
  const crosshairDot = el.querySelector("#crosshairDot");
  const hitArea = el.querySelector("#hitArea");
  const tt = attachTooltip(el);

  function handleMove(evt){
    const rect = svg.getBoundingClientRect();
    const relX = (evt.clientX - rect.left) / rect.width * W;
    let idx = Math.round(((relX - padL) / innerW) * (vals.length-1));
    idx = Math.max(0, Math.min(vals.length-1, idx));
    const [px, py] = points[idx];
    crosshair.setAttribute("x1", px); crosshair.setAttribute("x2", px); crosshair.setAttribute("opacity", 1);
    crosshairDot.setAttribute("cx", px); crosshairDot.setAttribute("cy", py); crosshairDot.setAttribute("opacity", 1);
    const cr = el.getBoundingClientRect();
    const screenX = rect.left - cr.left + (px/W)*rect.width;
    const screenY = rect.top - cr.top + (py/H)*rect.height;
    tt.show(screenX, screenY, `${trend.months[idx]} : <b>${vals[idx]} incidents</b>`);
  }
  hitArea.addEventListener("mousemove", handleMove);
  hitArea.addEventListener("mouseleave", () => { crosshair.setAttribute("opacity",0); crosshairDot.setAttribute("opacity",0); tt.hide(); });

  addDataToggle(el, "Voir les données", ["Mois","Incidents"], trend.months.map((m,i) => [m, vals[i]]));
}

/* ============================================================
   Data table toggle (accessibility fallback for each chart)
   ============================================================ */
function addDataToggle(container, label, headers, rows){
  const details = document.createElement("details");
  details.className = "data-toggle";
  details.innerHTML = `<summary>${label}</summary>
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`;
  container.appendChild(details);
}

/* ============================================================
   Causes list
   ============================================================ */
function renderCauses(causes){
  const el = document.getElementById("causesList");
  const max = Math.max(...causes.map(c => c.value));
  el.innerHTML = causes.map((c,i) => `
    <div class="cause-item">
      <span class="cause-rank">${String(i+1).padStart(2,"0")}</span>
      <div class="cause-body">
        <div class="name">${c.label}</div>
        <div class="cause-track"><div class="cause-fill" style="width:${(c.value/max*100).toFixed(0)}%"></div></div>
      </div>
      <span class="cause-count tabular">${c.value}×</span>
    </div>`).join("");
}

/* ============================================================
   Incidents table
   ============================================================ */
function renderIncidents(list){
  const body = document.getElementById("incidentsBody");
  body.innerHTML = list.map(inc => `
    <tr>
      <td class="id">${inc.id}</td>
      <td class="title" title="${inc.titre}">${inc.titre}</td>
      <td>${inc.type}</td>
      <td>${sevChip(inc.gravite)}</td>
      <td>${statusPill(inc.statut)}</td>
      <td class="source">
        <span class="src-flag"><span class="dot" style="background:${inc.source==='metier' ? 'var(--source-a)' : 'var(--source-b)'}"></span>${inc.source==='metier' ? 'Remontée métier' : 'Supervision'}</span>
      </td>
      <td class="date">${inc.date}</td>
    </tr>`).join("");
  document.getElementById("incidentCountHint").textContent = list.length + " derniers incidents";
}

/* ============================================================
   KPIs
   ============================================================ */
function renderKpis(k){
  const el = document.getElementById("kpiRow");
  el.innerHTML = `
    <div class="kpi k-open"><span class="bar"></span>
      <span class="label">Incidents ouverts</span>
      <span class="value tabular">${k.open}</span>
      <span class="delta up">▲ ${k.openDelta}</span>
    </div>
    <div class="kpi k-mttr"><span class="bar"></span>
      <span class="label">Temps moyen de résolution</span>
      <span class="value tabular">${k.mttr}<small>jours</small></span>
      <span class="delta down">▼ ${k.mttrDelta}</span>
    </div>
    <div class="kpi k-close"><span class="bar"></span>
      <span class="label">Taux de clôture (30j)</span>
      <span class="value tabular">${k.closeRate}<small>%</small></span>
      <span class="delta down">▲ ${k.closeDelta}</span>
    </div>
    <div class="kpi k-causes"><span class="bar"></span>
      <span class="label">Causes récurrentes</span>
      <span class="value tabular">${k.causes}</span>
      <span class="delta flat">■ ${k.causesDelta}</span>
    </div>`;
}

/* ============================================================
   Company switcher
   ============================================================ */
function renderCompanyMenu(){
  const menu = document.getElementById("companyMenu");
  menu.innerHTML = Object.entries(COMPANIES).map(([key,c]) => `
    <button class="opt ${key===CURRENT?'active':''}" data-key="${key}">
      <span class="dot" style="background:${c.dotColor}"></span>
      <span class="txt"><b>${c.name}</b><span>${c.sector}</span></span>
    </button>`).join("") + `
    <hr/>
    <div class="add">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Gérer les sociétés…
    </div>`;
  menu.querySelectorAll(".opt").forEach(btn => {
    btn.addEventListener("click", () => {
      CURRENT = btn.dataset.key;
      menu.classList.remove("open");
      renderAll();
    });
  });
}

document.getElementById("companyBtn").addEventListener("click", (e) => {
  document.getElementById("companyMenu").classList.toggle("open");
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".company-switch")) document.getElementById("companyMenu").classList.remove("open");
});

/* ============================================================
   Master render
   ============================================================ */
function renderAll(){
  const c = COMPANIES[CURRENT];
  document.getElementById("companyDot").style.background = c.dotColor;
  document.getElementById("companyName").textContent = c.name;
  document.getElementById("companySector").textContent = c.sector;
  document.getElementById("sectorTag").textContent = c.sector;
  renderCompanyMenu();
  renderKpis(c.kpis);
  renderTypeChart(c.types);
  renderGraviteChart(c.gravite);
  renderSourceChart(c.source);
  renderTrendChart(c.trend);
  renderCauses(c.causes);
  renderIncidents(c.incidents);
}

renderAll();
