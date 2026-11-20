// =====================================================================
//  INNSTILLINGER – endre teksten her for å tilpasse siden.
// =====================================================================

// 1) Informasjon om julebordet
const JULEBORD = {
  tittel: "Julebord med tapas",
  dato: "2026-12-27",   // Skriv på formen ÅÅÅÅ-MM-DD, f.eks. "2026-12-12"
  tid: "18:00",         // Skriv på formen TT:MM, f.eks. "18:30"
  sted: "Naufgården",   // F.eks. "Hos Kari, Storgata 1"
  intro: "Ta med én tapasrett!"   // Vises nederst på invitasjonskortet
};

// 2) Firebase-oppsett. Lim inn verdiene fra Firebase-konsollen (se README.md).
//    Disse verdiene er ikke hemmelige – de identifiserer bare prosjektet.
//    Det er sikkerhetsreglene i database.rules.json som beskytter dataene.
const FIREBASE_CONFIG = {
  apiKey: "LIM-INN-HER",
  authDomain: "LIM-INN-HER",
  databaseURL: "LIM-INN-HER",
  projectId: "LIM-INN-HER",
  storageBucket: "LIM-INN-HER",
  messagingSenderId: "LIM-INN-HER",
  appId: "LIM-INN-HER"
};

// 3) Kategorier. Hvis du endrer id-ene her, må du også endre dem i
//    database.rules.json (linjen med "kategori").
const KATEGORIER = [
  { id: "kjott",   navn: "Kjøtt",           ikon: "🥩" },
  { id: "fisk",    navn: "Fisk og sjømat",  ikon: "🦐" },
  { id: "vegetar", navn: "Vegetar",         ikon: "🥕" },
  { id: "brod",    navn: "Brød og tilbehør", ikon: "🥖" },
  { id: "dessert", navn: "Dessert",         ikon: "🍮" }
];

// 4) Forslag til retter. Står listen tom, skjules forslagsseksjonen på siden.
//    Legg til én linje per forslag, f.eks.:
//    { rett: "Patatas bravas", kategori: "vegetar" },
//    { rett: "Gambas al ajillo", kategori: "fisk" },
//    "kategori" må være en av id-ene over.
const FORSLAG = [
];
