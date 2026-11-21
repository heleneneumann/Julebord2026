// =====================================================================
//  INNSTILLINGER – endre teksten her for å tilpasse siden.
// =====================================================================

// 1) Informasjon om julebordet
const JULEBORD = {
  tittel: "Julebord med tapas",
  dato: "2026-12-27",   // Skriv på formen ÅÅÅÅ-MM-DD, f.eks. "2026-12-12"
  tid: "18:00",         // Skriv på formen TT:MM, f.eks. "18:30"
  sted: "Naufgården",   // F.eks. "Hos Kari, Storgata 1"
  intro: ""   // Valgfri hilsen nederst på invitasjonskortet (tom = ingen)
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

// 3) Kategorier og forslag.
//    Forslagene vises når gjesten velger kategori i skjemaet, og forsvinner
//    når noen har meldt på retten. Skriv ett forslag per linje i
//    anførselstegn, med komma etter.
//    Hvis du endrer en "id", må du også endre den i database.rules.json
//    (linjen med "kategori"). "navn" kan du endre fritt.
const KATEGORIER = [
  {
    id: "kjott", navn: "Kjøtt",
    forslag: [
      "Kjøttboller i tomatsaus",
      "Baconsurrede dadler",
      "Kyllingspyd",
      "Spekeskinke med melon",
      "Chorizo i rødvin",
      "Salamiruller med kremost",
    ]
  },
  {
    id: "fisk", navn: "Fisk",
    forslag: [
      "Gambas al ajillo",
      "Røkelaks på blini",
      "Skagenrøre på toast",
      "Laksespyd med sitron",
    ]
  },
  {
    id: "brod", navn: "Brød",
    forslag: [
      "Focaccia med aioli",
      "Bruschetta",
      "Pan con tomate",
      "Grissini",
    ]
  },
  {
    id: "ost", navn: "Ost",
    forslag: [
      "Ostefat",
      "Manchego med honning",
      "Mozzarellaspyd med tomat og basilikum",
      "Bakt brie",
      "Fylte dadler med geitost",
    ]
  },
  {
    id: "sott", navn: "Søtt",
    forslag: [
      "Sjokoladetrøfler",
      "Fruktspyd",
      "Minibrownies",
      "Sjokoladedyppede jordbær",
      "Cookies",
    ]
  },
  {
    id: "dipp", navn: "Dipp og tilbehør",
    forslag: [
      "Patatas bravas",
      "Marinerte oliven",
      "Guacamole med nachos",
    ]
  },
];
