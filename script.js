// Logikken for siden. Innstillinger og tekster ligger i config.js.
// Firebase lastes fra Googles CDN – ingen installasjon nødvendig.

(() => {
"use strict";

const FIREBASE_VERSJON = "10.12.2";
const MAKS_NAVN = 40;  // må stemme med database.rules.json
const MAKS_RETT = 60;  // må stemme med database.rules.json

const $ = (id) => document.getElementById(id);

function el(tag, klasse, tekst) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (tekst != null) e.textContent = tekst;
  return e;
}


let db = null;
let fb = null;            // Firebase-funksjoner (ref, set, remove)
let minUid = null;        // Anonym ID for denne nettleseren
let tilkoblet = false;
let tilkoblingFeilet = false;
let pameldinger = {};     // uid -> { navn, rett, kategori }

// ---------------------------------------------------------------------
//  Sammenligning av retter
// ---------------------------------------------------------------------

// Gjør "Patatas Bravas  " og "patata brava" like: små bokstaver, uten
// aksenter/tegnsetting, ett mellomrom, og enkle flertalls-/bøyningsendelser fjernet.
function normaliser(tekst) {
  return String(tekst || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9æø\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(stamme)
    .join(" ");
}

function stamme(ord) {
  if (ord.length <= 4) return ord;
  for (const endelse of ["ene", "er", "en", "s", "e"]) {
    if (ord.endsWith(endelse) && ord.length - endelse.length >= 3) {
      return ord.slice(0, -endelse.length);
    }
  }
  return ord;
}

function finnTatt(rett) {
  const n = normaliser(rett);
  if (!n) return null;
  for (const [uid, p] of Object.entries(pameldinger)) {
    if (normaliser(p.rett) === n) return { uid, ...p };
  }
  return null;
}

// ---------------------------------------------------------------------
//  Toppfelt og nedtelling
// ---------------------------------------------------------------------

function lesDato() {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(JULEBORD.dato || "");
  if (!d) return null;
  const t = /^(\d{1,2})[:.](\d{2})$/.exec(JULEBORD.tid || "") || [null, "18", "00"];
  return new Date(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]);
}

function visInfo() {
  document.title = JULEBORD.tittel;
  // "Julebord med tapas" vises på to linjer: "Julebord" / "med tapas"
  const tittel = $("tittel");
  const deler = JULEBORD.tittel.split(/ (?=med )/);
  tittel.replaceChildren(...deler.map((d) => el("span", null, d)));
  $("intro").textContent = JULEBORD.intro || "";
  const dato = lesDato();
  const datoTekst = dato
    ? new Intl.DateTimeFormat("nb-NO", { weekday: "long", day: "numeric", month: "long" }).format(dato)
    : JULEBORD.dato;
  $("info-dato").textContent = datoTekst.charAt(0).toUpperCase() + datoTekst.slice(1);
  $("info-tid").textContent = JULEBORD.tid ? "kl. " + JULEBORD.tid.replace(":", ".") : "";
  $("info-sted").textContent = JULEBORD.sted;
  oppdaterNedtelling();
  setInterval(oppdaterNedtelling, 30000);
}

function oppdaterNedtelling() {
  const boks = $("nedtelling");
  const maal = lesDato();
  const melding = (tekst) => boks.replaceChildren(el("p", "nedtelling-melding", tekst));
  if (!maal) return melding("Nedtellingen starter når datoen er satt.");
  const ms = maal - Date.now();
  if (ms <= 0) {
    return melding(ms > -12 * 3600e3 ? "Det er julebord nå! 🎄" : "Julebordet er over – takk for sist! ✨");
  }
  const min = Math.floor(ms / 60000);
  const deler = [
    [Math.floor(min / 1440), "dag", "dager"],
    [Math.floor((min % 1440) / 60), "time", "timer"],
    [min % 60, "minutt", "minutter"]
  ];
  boks.replaceChildren(...deler.map(([tall, en, flere]) => {
    const d = el("div", "enhet");
    d.append(el("b", null, String(tall)), el("span", null, tall === 1 ? en : flere));
    return d;
  }));
}

// ---------------------------------------------------------------------
//  Statusmeldinger
// ---------------------------------------------------------------------

function visStatus(tekst, feil) {
  const s = $("status");
  s.textContent = tekst;
  s.classList.toggle("feil", !!feil);
  s.hidden = false;
  if (feil) {
    tilkoblingFeilet = true;
    visOversikt();
  }
}

function visMelding(tekst, feil) {
  const m = $("melding");
  m.textContent = tekst;
  m.classList.toggle("feil", !!feil);
  m.hidden = !tekst;
}

// ---------------------------------------------------------------------
//  Skjema
// ---------------------------------------------------------------------

const kategoriFraId = Object.fromEntries(KATEGORIER.map((k) => [k.id, k]));
let valgtKategori = "";

function byggSkjema() {
  const boks = $("kategorier");
  KATEGORIER.forEach((k) => {
    const lab = el("label", "kategori-valg");
    const radio = el("input");
    radio.type = "radio";
    radio.name = "kategori";
    radio.value = k.id;
    radio.addEventListener("change", () => {
      valgtKategori = k.id;
      visMelding("");
      visForslag();
    });
    lab.append(radio, el("span", null, k.navn));
    boks.appendChild(lab);
  });

  $("navn").maxLength = MAKS_NAVN;
  $("rett").maxLength = MAKS_RETT;
  $("rett").addEventListener("input", () => { visMelding(""); sjekkDuplikat(); });
  $("skjema").addEventListener("submit", sendInn);
  $("slett-min").addEventListener("click", slettMin);
  oppdaterKnapp();
}

function sjekkDuplikat() {
  const tatt = finnTatt($("rett").value);
  const varsel = $("varsel");
  if (tatt) {
    const meg = tatt.uid === minUid ? " (deg)" : "";
    varsel.textContent = `Denne retten er allerede tatt av ${tatt.navn}${meg}. Velg en annen rett.`;
  }
  varsel.hidden = !tatt;
  oppdaterKnapp();
  return tatt;
}

function oppdaterKnapp() {
  $("send").disabled = !tilkoblet || !$("varsel").hidden;
}

function velgForslag(rett) {
  $("rett").value = rett;
  visMelding("");
  sjekkDuplikat();
  if (!$("navn").value.trim()) $("navn").focus();
}

const ryddTekst = (t) => t.trim().replace(/\s+/g, " ");

async function sendInn(e) {
  e.preventDefault();
  if (!tilkoblet || !minUid) return visMelding("Ikke koblet til ennå – vent litt og prøv igjen.", true);

  const navn = ryddTekst($("navn").value);
  const rett = ryddTekst($("rett").value);

  if (!navn) return visMelding("Skriv inn navnet ditt.", true);
  if (!kategoriFraId[valgtKategori]) return visMelding("Velg en kategori.", true);
  if (!rett) return visMelding("Velg et forslag eller skriv inn hvilken rett du tar med.", true);
  if (sjekkDuplikat()) return;

  const data = { navn: navn.slice(0, MAKS_NAVN), rett: rett.slice(0, MAKS_RETT), kategori: valgtKategori };

  $("send").disabled = true;
  try {
    await fb.set(fb.ref(db, `pameldinger/${minUid}`), data);
    $("skjema").reset();
    valgtKategori = "";
    visMelding("");
    visForslag();
    $("pamelding").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    console.error(err);
    visMelding("Kunne ikke lagre påmeldingen. Sjekk nettforbindelsen og prøv igjen.", true);
  } finally {
    oppdaterKnapp();
  }
}

async function slettMin() {
  if (!minUid || !pameldinger[minUid]) return;
  if (!confirm(`Er du sikker på at du vil slette påmeldingen din (${pameldinger[minUid].rett})?`)) return;
  try {
    await fb.remove(fb.ref(db, `pameldinger/${minUid}`));
  } catch (err) {
    console.error(err);
    alert("Kunne ikke slette påmeldingen. Prøv igjen.");
  }
}

// ---------------------------------------------------------------------
//  Visning
// ---------------------------------------------------------------------

function visMinPamelding() {
  const min = minUid && pameldinger[minUid];
  $("skjema").hidden = !!min;
  $("min-pamelding").hidden = !min;
  if (min) $("min-rett").textContent = min.rett;
}

// Viser ledige forslag for kategorien som er valgt i skjemaet
function visForslag() {
  const k = kategoriFraId[valgtKategori];
  const boks = $("forslag-boks");
  boks.hidden = !k;
  if (!k) return;

  const liste = $("forslag");
  liste.replaceChildren();
  const ledige = (k.forslag || []).filter((rett) => !finnTatt(rett));

  $("forslag-tittel").textContent = ledige.length
    ? `Forslag til ${k.navn.toLowerCase()} – trykk for å velge, eller skriv din egen:`
    : `Alle forslagene til ${k.navn.toLowerCase()} er tatt – skriv gjerne inn din egen:`;

  ledige.forEach((rett) => {
    const b = el("button", "chip", rett);
    b.type = "button";
    b.addEventListener("click", () => velgForslag(rett));
    liste.appendChild(b);
  });
}

function lagLapp(p, nr) {
  const li = el("li", "lapp");
  li.style.setProperty("--d", `${-((nr * 1.7) % 5)}s`); // lappene svinger litt i utakt
  li.appendChild(el("span", "lapp-rett", p.rett));
  li.appendChild(el("span", "lapp-navn", p.uid === minUid ? `${p.navn} (deg)` : p.navn));
  if (p.uid === minUid) {
    li.classList.add("min");
    const slett = el("button", "slett-lenke", "Slett");
    slett.type = "button";
    slett.addEventListener("click", slettMin);
    li.appendChild(slett);
  }
  return li;
}

function visOversikt() {
  const alle = Object.entries(pameldinger).map(([uid, p]) => ({ uid, ...p }));
  $("totalt").textContent = `${alle.length} ${alle.length === 1 ? "rett" : "retter"} påmeldt`;

  const boks = $("oversikt");
  boks.replaceChildren();
  if (!alle.length) {
    const tekst = tilkoblet ? "Ingen har meldt seg på ennå. Bli den første!"
      : tilkoblingFeilet ? "Påmeldingene kan ikke vises akkurat nå. Prøv å laste inn siden på nytt."
      : "Laster påmeldinger …";
    boks.appendChild(el("p", "tom", tekst));
    return;
  }

  // Påmeldinger uten gyldig kategori havner under "Annet"
  const grupper = [...KATEGORIER, { id: "", navn: "Annet" }];
  grupper.forEach((k) => {
    const i = alle
      .filter((p) => (kategoriFraId[p.kategori] ? p.kategori : "") === k.id)
      .sort((a, b) => a.navn.localeCompare(b.navn, "nb"));
    if (!i.length) return;
    const gruppe = el("div", "kategori");
    const h = el("h3", "kategori-navn", k.navn);
    h.appendChild(el("span", "kategori-antall", String(i.length)));
    gruppe.appendChild(h);
    const ul = el("ul", "lapper");
    i.forEach((p, nr) => ul.appendChild(lagLapp(p, nr)));
    gruppe.appendChild(ul);
    boks.appendChild(gruppe);
  });
}

function visAlt() {
  visMinPamelding();
  visForslag();
  visOversikt();
  sjekkDuplikat();
}

// ---------------------------------------------------------------------
//  Firebase
// ---------------------------------------------------------------------

function erKonfigurert() {
  return FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith("LIM")
    && FIREBASE_CONFIG.databaseURL && FIREBASE_CONFIG.databaseURL.startsWith("https://");
}

async function kobleTil() {
  if (!erKonfigurert()) {
    visStatus("Firebase er ikke satt opp ennå. Lim inn config-verdiene i config.js (se README.md).", true);
    return;
  }
  try {
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSJON}`;
    const [appMod, authMod, dbMod] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`),
      import(`${base}/firebase-database.js`)
    ]);
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    const auth = authMod.getAuth(app);
    db = dbMod.getDatabase(app);
    fb = { ref: dbMod.ref, set: dbMod.set, remove: dbMod.remove };

    let lytter = false;
    authMod.onAuthStateChanged(auth, (bruker) => {
      if (!bruker) return;
      minUid = bruker.uid;
      if (lytter) return;
      lytter = true;
      dbMod.onValue(dbMod.ref(db, "pameldinger"), (snap) => {
        pameldinger = snap.val() || {};
        tilkoblet = true;
        $("status").hidden = true;
        visAlt();
      }, (err) => {
        console.error(err);
        tilkoblet = false;
        visStatus("Fikk ikke tilgang til påmeldingene. Sjekk sikkerhetsreglene i Firebase.", true);
        oppdaterKnapp();
      });
    });

    await authMod.signInAnonymously(auth);
  } catch (err) {
    console.error(err);
    visStatus("Kunne ikke koble til. Sjekk nettforbindelsen, og at anonym innlogging er slått på i Firebase.", true);
  }
}

// ---------------------------------------------------------------------
//  Snøfall i bakgrunnen
// ---------------------------------------------------------------------

function startSno() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const lerret = $("sno");
  const ctx = lerret.getContext("2d");
  let fnugg = [];
  let b = 0, h = 0;

  function tilpass() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    b = window.innerWidth;
    h = window.innerHeight;
    lerret.width = b * dpr;
    lerret.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const antall = Math.round(Math.min(90, (b * h) / 9000));
    fnugg = Array.from({ length: antall }, () => ({
      x: Math.random() * b,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 2.2,
      fart: 0.25 + Math.random() * 0.6,
      fase: Math.random() * Math.PI * 2,
      alfa: 0.35 + Math.random() * 0.5
    }));
  }

  function tegn() {
    ctx.clearRect(0, 0, b, h);
    for (const f of fnugg) {
      f.y += f.fart;
      f.fase += 0.01;
      f.x += Math.sin(f.fase) * 0.3;
      if (f.y > h + 5) { f.y = -5; f.x = Math.random() * b; }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 230, 200, ${f.alfa})`;
      ctx.fill();
    }
    requestAnimationFrame(tegn);
  }

  tilpass();
  window.addEventListener("resize", tilpass);
  requestAnimationFrame(tegn);
}

// ---------------------------------------------------------------------
//  Start
// ---------------------------------------------------------------------

startSno();
visInfo();
byggSkjema();
visAlt();
kobleTil();
})();
