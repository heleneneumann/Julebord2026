// =====================================================================
//  INNSTILLINGER – endre teksten her for å tilpasse siden.
// =====================================================================

// 1) Informasjon om julebordet
const JULEBORD = {
  tittel: "Julebord med tapas",
  dato: "2026-12-27",   // Skriv på formen ÅÅÅÅ-MM-DD, f.eks. "2026-12-12"
  tid: "18:00",         // Skriv på formen TT:MM, f.eks. "18:30"
  sted: "[STED]",   // F.eks. "Hos Kari, Storgata 1"
  intro: "Alle tar med én tapasrett. Se hva som er ledig, og meld på din rett!"
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

// 4) Allergener man kan krysse av for (samme regel som over for id-ene).
const ALLERGENER = [
  { id: "gluten",   navn: "Gluten" },
  { id: "laktose",  navn: "Laktose" },
  { id: "notter",   navn: "Nøtter" },
  { id: "skalldyr", navn: "Skalldyr" }
];

// 5) Forslag til retter. "allergener" er bare et forslag som krysses av
//    automatisk – gjesten kan endre det selv.
const FORSLAG = [
  { rett: "Chorizo i rødvin",            kategori: "kjott",   allergener: [] },
  { rett: "Spekeskinke og melon",        kategori: "kjott",   allergener: [] },
  { rett: "Albóndigas i tomatsaus",      kategori: "kjott",   allergener: ["gluten"] },
  { rett: "Baconsurrede dadler",         kategori: "kjott",   allergener: [] },
  { rett: "Kyllingspyd med paprika",     kategori: "kjott",   allergener: [] },
  { rett: "Pinnekjøtt-biter",            kategori: "kjott",   allergener: [] },

  { rett: "Gambas al ajillo",            kategori: "fisk",    allergener: ["skalldyr"] },
  { rett: "Blåskjell i hvitvin",         kategori: "fisk",    allergener: ["skalldyr"] },
  { rett: "Bacalao-kroketter",           kategori: "fisk",    allergener: ["gluten", "laktose"] },
  { rett: "Røkelaks på blini",           kategori: "fisk",    allergener: ["gluten", "laktose"] },
  { rett: "Marinerte ansjos (boquerones)", kategori: "fisk",  allergener: [] },

  { rett: "Patatas bravas",              kategori: "vegetar", allergener: [] },
  { rett: "Tortilla española",           kategori: "vegetar", allergener: [] },
  { rett: "Pimientos de padrón",         kategori: "vegetar", allergener: [] },
  { rett: "Marinerte oliven",            kategori: "vegetar", allergener: [] },
  { rett: "Manchego med honning",        kategori: "vegetar", allergener: ["laktose"] },
  { rett: "Champignon i hvitløk",        kategori: "vegetar", allergener: [] },
  { rett: "Fylte dadler med geitost",    kategori: "vegetar", allergener: ["laktose"] },

  { rett: "Aioli",                       kategori: "brod",    allergener: [] },
  { rett: "Bruschetta",                  kategori: "brod",    allergener: ["gluten"] },
  { rett: "Pan con tomate",              kategori: "brod",    allergener: ["gluten"] },
  { rett: "Romescosaus",                 kategori: "brod",    allergener: ["notter"] },
  { rett: "Grissini med spekeskinke",    kategori: "brod",    allergener: ["gluten"] },

  { rett: "Churros med sjokoladesaus",   kategori: "dessert", allergener: ["gluten", "laktose"] },
  { rett: "Crema catalana",              kategori: "dessert", allergener: ["laktose"] },
  { rett: "Mandelkake",                  kategori: "dessert", allergener: ["notter"] },
  { rett: "Pepperkaker med blåmuggost",  kategori: "dessert", allergener: ["gluten", "laktose"] }
];
