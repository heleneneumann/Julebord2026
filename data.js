// =====================================================================
//  INNHOLD FOR SIDEN – rediger bare denne filen for å oppdatere siden.
//  Husk: repoet er offentlig. Ikke skriv inn navn, telefonnumre,
//  e-postadresser eller andre personopplysninger.
// =====================================================================

const JULEBORD = {
  // Generell informasjon om arrangementet
  tittel: "Julebord 2026",
  dato: "2026-12-11",          // Format: ÅÅÅÅ-MM-DD
  klokkeslett: "18:00",
  sted: "Festlokalet i sentrum",
  beskrivelse: "Oversikt over program, planlegging og frister frem mot årets julebord.",

  // Kveldens program. Rekkefølgen her blir rekkefølgen på siden.
  program: [
    { tid: "18:00", aktivitet: "Velkomstdrink", beskrivelse: "Mingling i foajeen" },
    { tid: "19:00", aktivitet: "Middag", beskrivelse: "Tre retter med tradisjonell julemat" },
    { tid: "20:30", aktivitet: "Underholdning", beskrivelse: "Quiz og allsang" },
    { tid: "22:00", aktivitet: "Dessert og kaffe", beskrivelse: "" },
    { tid: "22:30", aktivitet: "Dans", beskrivelse: "DJ til lokalet stenger" }
  ],

  // Oppgaver i planleggingen.
  //   tittel:    Hva som skal gjøres
  //   kategori:  Fritekst, f.eks. "Lokale", "Mat", "Underholdning", "Praktisk"
  //   frist:     ÅÅÅÅ-MM-DD
  //   status:    "Ikke startet", "Pågår" eller "Ferdig"
  //   ansvarlig: Bruk en rolle (f.eks. "Komiteen"), ikke et navn
  //   lenke:     Valgfritt – la stå tom ("") om du ikke har en lenke
  //   notat:     Valgfritt
  oppgaver: [
    { tittel: "Bestille lokale", kategori: "Lokale", frist: "2026-10-15", status: "Ferdig", ansvarlig: "Komiteen", lenke: "", notat: "Bekreftet" },
    { tittel: "Sende ut invitasjon", kategori: "Praktisk", frist: "2026-11-01", status: "Ferdig", ansvarlig: "Komiteen", lenke: "", notat: "" },
    { tittel: "Påmeldingsfrist", kategori: "Praktisk", frist: "2026-11-25", status: "Pågår", ansvarlig: "Alle", lenke: "", notat: "Husk å oppgi allergier" },
    { tittel: "Bestille meny", kategori: "Mat", frist: "2026-11-27", status: "Pågår", ansvarlig: "Matansvarlig", lenke: "", notat: "Vegetaralternativ må med" },
    { tittel: "Lage quiz", kategori: "Underholdning", frist: "2026-12-04", status: "Ikke startet", ansvarlig: "Underholdning", lenke: "", notat: "" },
    { tittel: "Booke DJ", kategori: "Underholdning", frist: "2026-11-20", status: "Ikke startet", ansvarlig: "Underholdning", lenke: "", notat: "" },
    { tittel: "Kjøpe pynt og bordkort", kategori: "Lokale", frist: "2026-12-08", status: "Ikke startet", ansvarlig: "Komiteen", lenke: "", notat: "" },
    { tittel: "Bordplassering", kategori: "Praktisk", frist: "2026-12-09", status: "Ikke startet", ansvarlig: "Komiteen", lenke: "", notat: "" }
  ]
};
