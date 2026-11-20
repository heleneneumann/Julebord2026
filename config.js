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

// 3) Forslag til retter. Står listen tom, skjules forslagsseksjonen på siden.
//    Skriv ett forslag per linje i anførselstegn, med komma etter, f.eks.:
//    "Patatas bravas",
//    "Gambas al ajillo",
const FORSLAG = [
  "Focaccia",
];
