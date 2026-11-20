# Julebord 2026

En enkel, statisk nettside med oversikt over program, oppgaver og frister for julebordet.
Siden publiseres med GitHub Pages og trenger ingen installasjon eller byggesteg.

## Filer

| Fil          | Innhold                                              |
|--------------|------------------------------------------------------|
| `data.js`    | **Alt innholdet.** Dette er den eneste filen du trenger å endre. |
| `index.html` | Strukturen på siden                                  |
| `style.css`  | Utseende                                             |
| `script.js`  | Leser `data.js`, filtrerer, sorterer og markerer frister |

## Oppdatere innholdet

Åpne `data.js` og endre verdiene i `JULEBORD`:

- `tittel`, `dato` (format `ÅÅÅÅ-MM-DD`), `klokkeslett`, `sted`, `beskrivelse`
- `program` – én linje per punkt i kveldens program
- `oppgaver` – én linje per oppgave

Slik legger du til en ny oppgave: kopier en eksisterende linje i `oppgaver`, lim den inn
under, og endre feltene. Husk komma mellom linjene:

```js
{ tittel: "Kjøpe gaver til utlodning", kategori: "Praktisk", frist: "2026-12-05", status: "Ikke startet", ansvarlig: "Komiteen", lenke: "", notat: "" },
```

- `status` skal være `"Ikke startet"`, `"Pågår"` eller `"Ferdig"`.
- `lenke` og `notat` kan stå tomme (`""`).
- Frister innen 7 dager markeres med gult, og frister som er passert med rødt.

Du kan sjekke resultatet ved å åpne `index.html` direkte i nettleseren. Når du er fornøyd,
committer og pusher du endringene, og siden oppdateres automatisk etter et minutt eller to.

> ⚠️ Repoet er offentlig. Ikke legg inn navn, telefonnumre, e-postadresser eller annen
> personlig informasjon – bruk roller som «Komiteen» eller «Matansvarlig».

## Skru på GitHub Pages

1. Gå til repoet på GitHub og velg **Settings → Pages**.
2. Under **Build and deployment** velger du **Source: Deploy from a branch**.
3. Velg branchen **main** og mappen **/ (root)**, og trykk **Save**.
4. Etter litt tid vises adressen øverst på siden, vanligvis
   `https://<brukernavn>.github.io/Julebord2026/`.
