# Julebord med tapas 🎄

En nettside der gjestene melder på hvilken tapasrett de tar med. Alle ser de samme
påmeldingene i sanntid. Siden er statisk (GitHub Pages) og bruker Firebase Realtime
Database (gratis) til felles lagring.

## Filer

| Fil                   | Innhold                                                        |
|-----------------------|----------------------------------------------------------------|
| `config.js`           | **Det du endrer:** dato/tid/sted, Firebase-config, kategorier, allergener og forslag |
| `database.rules.json` | Sikkerhetsreglene du limer inn i Firebase                      |
| `index.html`          | Strukturen på siden                                            |
| `style.css`           | Utseende                                                       |
| `script.js`           | Logikk (påmelding, sjekk av duplikater, sletting, nedtelling)  |

## 1. Endre julebordinfo

Åpne `config.js` og bytt ut plassholderne:

```js
dato: "2026-12-12",   // ÅÅÅÅ-MM-DD
tid:  "18:30",        // TT:MM
sted: "Festsalen, Storgata 1",
```

Forslagslisten (`FORSLAG`) ligger i samme fil. Legg til en linje for å lage et nytt forslag.

## 2. Sette opp Firebase (ca. 10 minutter)

**a) Opprett prosjekt**
1. Gå til <https://console.firebase.google.com> og logg inn med en Google-konto.
2. Trykk **Opprett et prosjekt** (*Create a project*), gi det et navn (f.eks. `julebord-2026`).
3. Google Analytics trengs ikke, så du kan slå det av. Trykk **Opprett prosjekt**.

**b) Slå på anonym innlogging**
Den brukes for at hver gjest bare skal kunne slette sin egen påmelding. Gjestene merker ingenting.
1. Velg **Build → Authentication** i menyen til venstre og trykk **Get started**.
2. Velg fanen **Sign-in method**, velg **Anonymous**, slå den på og trykk **Save**.
3. Gå til fanen **Settings → Authorized domains**, trykk **Add domain** og legg til
   `heleneneumann.github.io`.

**c) Opprett databasen**
1. Velg **Build → Realtime Database** og trykk **Create Database**.
2. Velg plassering **Belgium (europe-west1)**.
3. Velg **Start in locked mode** og trykk **Enable**.

**d) Legg inn sikkerhetsreglene**
1. I Realtime Database åpner du fanen **Rules**.
2. Slett alt som står der, og lim inn hele innholdet fra `database.rules.json`.
3. Trykk **Publish**.

Reglene sørger for at:
- bare besøkende via siden (med anonym innlogging) kan lese listen,
- hver person bare kan opprette, endre eller slette **sin egen** påmelding,
- bare feltene `navn` (maks 40 tegn), `rett` (maks 60 tegn), `kategori` (én av de fem)
  og `allergener` (bare de fire kjente) kan lagres. Alt annet avvises.

**e) Hent config og lim den inn**
1. Trykk tannhjulet ved **Project Overview → Project settings**.
2. Under **Your apps** trykker du web-ikonet **`</>`**, gir appen et navn og trykker
   **Register app** (Firebase Hosting trengs ikke).
3. Du får se en kodeblokk med `const firebaseConfig = { ... }`. Kopier verdiene inn i
   `FIREBASE_CONFIG` i `config.js`:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "julebord-2026.firebaseapp.com",
  databaseURL: "https://julebord-2026-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "julebord-2026",
  storageBucket: "julebord-2026.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

> Mangler `databaseURL`? Det skjer hvis appen ble registrert før databasen ble opprettet.
> Kopier da adressen som står øverst i fanen **Data** i Realtime Database.

Disse verdiene er ikke hemmelige og kan ligge i et offentlig repo. Det er reglene som
beskytter dataene.

## 3. Skru på GitHub Pages

1. Commit og push endringene i `config.js`.
2. På GitHub går du til **Settings → Pages**.
3. Velg **Source: Deploy from a branch**, branch **main** og mappe **/ (root)**, og trykk **Save**.
4. Etter et par minutter ligger siden på `https://heleneneumann.github.io/Julebord2026/`.

## Greit å vite

- **Test lokalt:** siden må åpnes via en webserver, ikke ved å dobbeltklikke på
  `index.html`. Kjør `python3 -m http.server` i mappen og åpne <http://localhost:8000>.
- **Én påmelding per nettleser:** påmeldingen er knyttet til nettleseren den ble laget i.
  Hvis noen bytter telefon eller tømmer nettleserdata, kan de ikke lenger slette sin egen
  påmelding. Da kan du slette den manuelt i Firebase-konsollen (Realtime Database → Data →
  `pameldinger`, hold musen over oppføringen og trykk **✕**).
- **Navnene er synlige** for alle som har lenken. Be gjestene bruke bare fornavn.
- Hvis du endrer id-ene til kategorier eller allergener i `config.js`, må du også oppdatere
  dem i `database.rules.json` og publisere reglene på nytt.
- Når julebordet er over, kan du slette dataene eller hele prosjektet i Firebase-konsollen.
