// Leser innholdet fra data.js (variabelen JULEBORD) og bygger siden.
// Du trenger normalt ikke endre denne filen.

(function () {
  "use strict";

  const data = JULEBORD;
  const SNART_DAGER = 7; // Frister innen så mange dager markeres som "snart"

  const datoFormat = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric" });
  const kortDato = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short" });

  // Tolker "ÅÅÅÅ-MM-DD" som lokal dato (unngår tidssoneforskyvning).
  function tilDato(str) {
    const [a, m, d] = String(str).split("-").map(Number);
    return new Date(a, (m || 1) - 1, d || 1);
  }

  function idag() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function dagerTil(dato) {
    return Math.round((dato - idag()) / 86400000);
  }

  function el(tag, klasse, tekst) {
    const e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (tekst != null) e.textContent = tekst;
    return e;
  }

  function statusKlasse(status) {
    return String(status).toLowerCase()
      .replace("å", "a").replace("ø", "o").replace("æ", "ae")
      .replace(/\s+/g, "-");
  }

  // ----- Topp -----
  document.title = data.tittel;
  document.getElementById("tittel").textContent = data.tittel;
  document.getElementById("beskrivelse").textContent = data.beskrivelse || "";
  const festdato = tilDato(data.dato);
  document.getElementById("dato").textContent =
    datoFormat.format(festdato) + (data.klokkeslett ? " kl. " + data.klokkeslett : "");
  document.getElementById("sted").textContent = data.sted || "–";

  const igjen = dagerTil(festdato);
  document.getElementById("nedtelling").textContent =
    igjen > 1 ? igjen + " dager igjen" :
    igjen === 1 ? "I morgen!" :
    igjen === 0 ? "I dag! 🎄" : "Gjennomført";

  // ----- Program -----
  const programListe = document.getElementById("program");
  (data.program || []).forEach(function (p) {
    const li = el("li");
    li.appendChild(el("span", "tid", p.tid));
    li.appendChild(el("span", "akt", p.aktivitet));
    if (p.beskrivelse) li.appendChild(el("p", null, p.beskrivelse));
    programListe.appendChild(li);
  });

  // ----- Oppgaver -----
  const oppgaver = data.oppgaver || [];
  const liste = document.getElementById("oppgaveliste");
  const tom = document.getElementById("tom");
  const velgKategori = document.getElementById("filter-kategori");
  const velgStatus = document.getElementById("filter-status");
  const velgSortering = document.getElementById("sortering");

  // Fremdrift
  const antallFerdig = oppgaver.filter(function (o) { return o.status === "Ferdig"; }).length;
  document.getElementById("fremdrift").textContent =
    antallFerdig + " av " + oppgaver.length + " oppgaver ferdig";
  document.getElementById("fremdrift-bar").style.width =
    (oppgaver.length ? (antallFerdig / oppgaver.length) * 100 : 0) + "%";

  // Kategorier i nedtrekksmenyen
  Array.from(new Set(oppgaver.map(function (o) { return o.kategori; }).filter(Boolean)))
    .sort(function (a, b) { return a.localeCompare(b, "nb"); })
    .forEach(function (k) {
      const opt = el("option", null, k);
      opt.value = k;
      velgKategori.appendChild(opt);
    });

  function fristTekst(dager) {
    if (dager < 0) return "Forfalt for " + Math.abs(dager) + (dager === -1 ? " dag" : " dager") + " siden";
    if (dager === 0) return "Frist i dag";
    if (dager === 1) return "Frist i morgen";
    return "Om " + dager + " dager";
  }

  function tegn() {
    const kat = velgKategori.value;
    const stat = velgStatus.value;
    const sort = velgSortering.value;

    const utvalg = oppgaver.filter(function (o) {
      if (kat && o.kategori !== kat) return false;
      if (stat === "aktive") return o.status !== "Ferdig";
      if (stat && o.status !== stat) return false;
      return true;
    });

    utvalg.sort(function (a, b) {
      if (sort === "kategori") {
        return (a.kategori || "").localeCompare(b.kategori || "", "nb") || tilDato(a.frist) - tilDato(b.frist);
      }
      const diff = tilDato(a.frist) - tilDato(b.frist);
      return sort === "frist-synkende" ? -diff : diff;
    });

    liste.innerHTML = "";
    tom.hidden = utvalg.length > 0;

    utvalg.forEach(function (o) {
      const frist = tilDato(o.frist);
      const dager = dagerTil(frist);
      const ferdig = o.status === "Ferdig";

      const li = el("li", "task");
      if (ferdig) li.classList.add("ferdig");
      else if (dager < 0) li.classList.add("forfalt");
      else if (dager <= SNART_DAGER) li.classList.add("snart");

      const tittel = el("p", "task-title");
      if (o.lenke) {
        const a = el("a", null, o.tittel);
        a.href = o.lenke;
        a.target = "_blank";
        a.rel = "noopener";
        tittel.appendChild(a);
      } else {
        tittel.textContent = o.tittel;
      }
      li.appendChild(tittel);
      li.appendChild(el("span", "badge " + statusKlasse(o.status), o.status));

      const meta = el("div", "task-meta");
      meta.appendChild(el("span", null, "📅 " + kortDato.format(frist)));
      if (!ferdig) meta.appendChild(el("span", "frist-merke", fristTekst(dager)));
      if (o.kategori) meta.appendChild(el("span", null, "🏷️ " + o.kategori));
      if (o.ansvarlig) meta.appendChild(el("span", null, "👥 " + o.ansvarlig));
      li.appendChild(meta);

      if (o.notat) li.appendChild(el("p", "task-note", o.notat));
      liste.appendChild(li);
    });
  }

  [velgKategori, velgStatus, velgSortering].forEach(function (s) {
    s.addEventListener("change", tegn);
  });
  tegn();
})();
