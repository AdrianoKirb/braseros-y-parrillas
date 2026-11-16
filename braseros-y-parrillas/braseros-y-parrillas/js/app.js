const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });
const money = n => "$ " + n.toLocaleString("es-AR", { maximumFractionDigits: 2 });
const num = id => Math.max(0, parseFloat($("#" + id).value) || 0);
const KG = { 8: .395, 10: .617, 12: .888 };
const KEY = "brasero-parrilla-v1";

/* ---------- Modelos: devuelven la lista de corte (cm) ---------- */
function parrilla() {
  const A = num("pA"), B = num("pB"), S = Math.max(1, num("pS")), H = num("pH");
  const n = Math.max(0, Math.ceil(A / S) - 1);
  const cuts = [
    { p: "Marco, lados A", q: 2, l: A, d: 10 },
    { p: "Marco, lados B", q: 2, l: B, d: 10 },
    { p: "Barras de la parrilla", q: n, l: B, d: 8 },
    { p: "Refuerzo inferior central", q: 1, l: A, d: 10 }
  ];
  if (H > 0) cuts.push({ p: "Patas", q: 4, l: H, d: 10 });
  return { A, B, H, n, sp: A / (n + 1), cuts };
}

function brasero() {
  const D = num("bD"), H = num("bH"), S = Math.max(1, num("bS")), L = num("bL"), R = D / 2;
  const n = Math.ceil(Math.PI * D / S);
  const chords = [];
  for (let x = -R + 4; x < R - 1; x += 4) chords.push(2 * Math.sqrt(R * R - x * x));
  const avg = chords.length ? chords.reduce((a, b) => a + b, 0) / chords.length : 0;
  const cuts = [
    { p: "Aros (superior e inferior)", q: 2, l: Math.PI * D, d: 10 },
    { p: "Varillas verticales", q: n, l: H, d: 8 },
    { p: "Varillas del fondo (largo promedio)", q: chords.length, l: avg, d: 8 },
    { p: "Patas", q: 3, l: L, d: 12 },
    { p: "Asas", q: 2, l: 30, d: 10 }
  ];
  return { D, H, L, R, n, chords, cuts };
}

/* ---------- Instrucciones ---------- */
const pasosParrilla = g => [
  `Cortá las varillas según la lista de corte. Usá una amoladora con disco de corte y limá las rebabas.`,
  `Armá el marco rectangular de ${fmt(g.A)} × ${fmt(g.B)} cm con las varillas de Ø 10 mm. Verificá que las diagonales midan lo mismo para asegurar la escuadra y punteá las cuatro esquinas.`,
  `Marcá sobre los dos lados A la posición de cada barra, cada ${fmt(g.sp)} cm. Hacé una marca igual en ambos lados para que queden paralelas.`,
  `Apoyá las ${g.n} barras de Ø 8 mm sobre el marco, en las marcas, y punteá cada extremo antes de soldar a fondo.`,
  `Soldá el refuerzo central de Ø 10 mm por debajo de las barras, cruzado, para que no se deformen con el calor.`,
  g.H > 0 ? `Soldá las 4 patas de ${fmt(g.H)} cm en las esquinas del marco, bien verticales, y apoyá la parrilla del revés sobre una superficie plana para nivelarlas.` : `Como no lleva patas, apoyá la parrilla sobre soportes o ladrillos al usarla.`,
  `Terminá las soldaduras con cepillo de acero. Para el primer uso, curá la parrilla con aceite y calor suave. No uses pintura común: solo pintura para altas temperaturas.`
];
const pasosBrasero = g => [
  `Cortá las varillas según la lista de corte. Los aros se hacen con varilla de Ø 10 mm: curvala sobre un molde o un caño de ${fmt(g.D)} cm de diámetro.`,
  `Cerrá cada aro con una soldadura a tope y verificá que midan ${fmt(g.D)} cm de diámetro.`,
  `Marcá en ambos aros ${g.n} puntos a la misma distancia entre sí (cada ${fmt(Math.PI * g.D / g.n)} cm aprox.). Dividí primero en 4 y luego en partes iguales.`,
  `Soldá las ${g.n} varillas verticales de Ø 8 mm entre los dos aros, de ${fmt(g.H)} cm de alto. Empezá por 4 varillas opuestas para fijar la forma.`,
  `Soldá las varillas de Ø 8 mm del fondo en el aro inferior, cada 4 cm, cruzando de lado a lado, para que caigan las cenizas y entre aire.`,
  `Soldá las 3 patas de Ø 12 mm, de ${fmt(g.L)} cm, al aro inferior, a 120° entre sí.`,
  `Soldá las 2 asas de Ø 10 mm en el aro superior, enfrentadas, un poco hacia afuera para agarrarlas sin quemarte.`,
  `Limpiá las soldaduras y pintá con pintura para altas temperaturas. Dejala curar con un fuego chico antes del primer uso.`
];

/* ---------- Plano (SVG) ---------- */
function svgParrilla(g) {
  const k = Math.min(380 / (g.A || 1), 200 / (g.B || 1)), w = g.A * k, h = g.B * k, m = 46, hs = g.H * k;
  const W = w + 2 * m, y2 = m + h + 50, Ht = y2 + hs + 40;
  let s = `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Plano de la parrilla"><text x="${m}" y="16">VISTA SUPERIOR</text>`;
  for (let i = 1; i <= g.n; i++) s += `<line class="l" stroke-width="1.5" x1="${m + i * g.sp * k}" y1="${m}" x2="${m + i * g.sp * k}" y2="${m + h}"/>`;
  s += `<line class="a d" stroke-width="2" x1="${m}" y1="${m + h / 2}" x2="${m + w}" y2="${m + h / 2}"/>`;
  s += `<rect class="l" stroke-width="3.5" x="${m}" y="${m}" width="${w}" height="${h}"/>`;
  s += `<text x="${m + w / 2}" y="${m - 8}" text-anchor="middle">A = ${fmt(g.A)} cm</text>`;
  s += `<text transform="translate(${m - 10} ${m + h / 2}) rotate(-90)" text-anchor="middle">B = ${fmt(g.B)} cm</text>`;
  s += `<text x="${m + w + 4}" y="${m + h / 2 - 4}" font-size="10">refuerzo</text>`;
  s += `<text x="${m}" y="${y2 - 14}">VISTA LATERAL</text><rect class="f" x="${m}" y="${y2}" width="${w}" height="5"/>`;
  if (g.H > 0) {
    for (const x of [m + 3, m + w - 3]) s += `<line class="l" stroke-width="3.5" x1="${x}" y1="${y2 + 5}" x2="${x}" y2="${y2 + 5 + hs}"/>`;
    s += `<text x="${m + w / 2}" y="${y2 + hs / 2 + 8}" text-anchor="middle">patas = ${fmt(g.H)} cm</text>`;
  }
  return s + `</svg>`;
}

function svgBrasero(g) {
  const k = Math.min(300 / (g.D || 1), 230 / ((g.H + g.L) || 1)), R = g.R * k, m = 40, cx = m + R;
  const W = 2 * R + 2 * m, y2 = m + 2 * R + 50, Ht = y2 + (g.H + g.L) * k + 30, cy = m + R;
  let s = `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Plano del brasero"><text x="${m}" y="16">VISTA SUPERIOR</text>`;
  s += `<defs><clipPath id="cp"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>`;
  for (const c of g.chords) { }
  for (let x = -g.R + 4; x < g.R - 1; x += 4) s += `<line class="l" stroke-width="1.2" clip-path="url(#cp)" x1="${cx + x * k}" y1="${cy - R}" x2="${cx + x * k}" y2="${cy + R}"/>`;
  s += `<circle class="l" stroke-width="3.5" cx="${cx}" cy="${cy}" r="${R}"/>`;
  for (const a of [90, 210, 330]) s += `<circle class="f" cx="${cx + R * Math.cos(a * Math.PI / 180)}" cy="${cy - R * Math.sin(a * Math.PI / 180)}" r="5"/>`;
  s += `<text x="${cx}" y="${m - 8}" text-anchor="middle">D = ${fmt(g.D)} cm</text>`;
  const top = y2, hh = g.H * k;
  s += `<text x="${m}" y="${y2 - 14}">VISTA LATERAL</text>`;
  const nv = Math.min(g.n, 24);
  for (let i = 0; i < nv; i++) { const x = cx + R * Math.cos(Math.PI * (i + .5) / nv); s += `<line class="l" stroke-width="1.2" x1="${x}" y1="${top}" x2="${x}" y2="${top + hh}"/>`; }
  s += `<line class="l" stroke-width="3.5" x1="${cx - R}" y1="${top}" x2="${cx + R}" y2="${top}"/><line class="l" stroke-width="3.5" x1="${cx - R}" y1="${top + hh}" x2="${cx + R}" y2="${top + hh}"/>`;
  for (const x of [cx - .87 * R, cx + .87 * R]) s += `<line class="l" stroke-width="4" x1="${x}" y1="${top + hh}" x2="${x}" y2="${top + hh + g.L * k}"/>`;
  s += `<line class="a d" stroke-width="2" x1="${cx}" y1="${top + hh}" x2="${cx}" y2="${top + hh + g.L * k}"/>`;
  s += `<text x="${cx + R + 6}" y="${top + hh / 2}">H = ${fmt(g.H)} cm</text><text x="${cx + R + 6}" y="${top + hh + g.L * k / 2}">patas = ${fmt(g.L)} cm</text>`;
  return s + `</svg>`;
}

/* ---------- Render ---------- */
const sumByD = cuts => { const t = { 8: 0, 10: 0, 12: 0 }; cuts.forEach(c => t[c.d] += c.q * c.l / 100); return t; };

function tabla(el, cuts) {
  const tot = cuts.reduce((a, c) => a + c.q * c.l / 100, 0);
  el.innerHTML = `<thead><tr><th>Pieza</th><th class="n">Cant.</th><th class="n">Largo (cm)</th><th class="n">Varilla Ø (mm)</th><th class="n">Total (m)</th></tr></thead><tbody>` +
    cuts.map(c => `<tr><td>${c.p}</td><td class="n">${c.q}</td><td class="n">${fmt(c.l)}</td><td class="n">${c.d}</td><td class="n">${fmt(c.q * c.l / 100)}</td></tr>`).join("") +
    `</tbody><tfoot><tr><td colspan="4"><b>Total de varilla</b></td><td class="n tot">${fmt(tot)} m</td></tr></tfoot>`;
}

function stats(el, cuts) {
  const m = cuts.reduce((a, c) => a + c.q * c.l / 100, 0), pz = cuts.reduce((a, c) => a + c.q, 0);
  const kg = cuts.reduce((a, c) => a + c.q * c.l / 100 * KG[c.d], 0);
  el.innerHTML = [[fmt(m), "metros de varilla"], [pz, "piezas a cortar"], [fmt(kg), "kg aprox."]]
    .map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
}

function steppers() {
  document.querySelectorAll(".fields input").forEach(inp => {
    const w = document.createElement("div"); w.className = "step";
    inp.before(w);
    const st = parseFloat(inp.step) || 1;
    const mk = (t, d) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.setAttribute("aria-label", d > 0 ? "Sumar" : "Restar");
      b.onclick = () => { const v = (parseFloat(inp.value) || 0) + d * st, mn = inp.min === "" ? 0 : +inp.min; inp.value = Math.max(mn, Math.round(v * 100) / 100); inp.dispatchEvent(new Event("input", { bubbles: true })); }; return b; };
    w.append(mk("−", -1), inp, mk("+", 1));
  });
}

function update() {
  const p = parrilla(), b = brasero();
  $("#pPlano").innerHTML = svgParrilla(p); tabla($("#pCorte"), p.cuts); stats($("#pStats"), p.cuts);
  $("#pPasos").innerHTML = pasosParrilla(p).map(t => `<li>${t}</li>`).join("");
  $("#bPlano").innerHTML = svgBrasero(b); tabla($("#bCorte"), b.cuts); stats($("#bStats"), b.cuts);
  $("#bPasos").innerHTML = pasosBrasero(b).map(t => `<li>${t}</li>`).join("");

  const np = num("mP"), nb = num("mB"), w = 1 + num("mW") / 100;
  const sp = sumByD(p.cuts), sb = sumByD(b.cuts);
  let total = 0;
  document.querySelectorAll("#mTabla tbody tr").forEach(tr => {
    const d = tr.dataset.d, mp = sp[d] * np, mb = sb[d] * nb, mt = (mp + mb) * w;
    const price = parseFloat(tr.querySelector("input").value) || 0, sub = mt * price;
    total += sub;
    const set = (c, v) => tr.querySelector(`[data-c="${c}"]`).textContent = v;
    set("p", fmt(mp)); set("b", fmt(mb)); set("t", fmt(mt)); set("r", mt ? Math.ceil(mt / 12) : 0); set("s", money(sub));
  });
  $("#mTotal").textContent = money(total);
  save();
}

function save() {
  try {
    const d = {}; document.querySelectorAll("input").forEach(i => d[i.id || "price" + i.dataset.price] = i.value);
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch (e) { }
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "null"); if (!d) return;
    document.querySelectorAll("input").forEach(i => { const k = i.id || "price" + i.dataset.price; if (d[k] !== undefined) i.value = d[k]; });
  } catch (e) { }
}

document.querySelectorAll(".tabs button").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-selected", b === btn));
  document.querySelectorAll(".tab").forEach(t => t.hidden = t.id !== "tab-" + btn.dataset.tab);
}));
document.addEventListener("input", update);
steppers(); load(); update();

/* ---------- App instalable (PWA) ---------- */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { }));
}
