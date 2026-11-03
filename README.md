# FIXER AI produktionskalender

Kalender med live vejr, sceneplaceringer fra KALENDER, scener uden dato, TEAM og personligt skema.

## Automatisk læsning uden Make eller Apps Script

Google Sheets → serverens /api/production → kalender.

Arket er allerede delt med læseadgang for alle med linket. Ingen delingsindstillinger ændres af denne kode. Serveren læser de ni navngivne faner direkte som CSV ved hver forespørgsel. Kalenderen henter ved åbning, hvert minut og når man vender tilbage til fanen. Der er ingen lagret produktionsplan i GitHub, ingen timer der skal installeres, ingen Google login eller adgangsnøgle til datalæsningen og ingen genudgivelse ved ændringer i arket. Hvis arkets linkadgang senere fjernes, vises en forbindelsesfejl; der vises ikke en falsk succes.

Ret sceneplaceringer i KALENDER. Scenedetaljer redigeres i SCENER, opgaver i OPGAVER og kontaktoplysninger i TEAM. Netlify Function koden ligger uden for public mappen. Portalen og dens læse API er offentlige efter ejerens ønske. Navnevalget er kun et visningsfilter.

Den allerede udgivne ChatGPT Site har sin egen beskyttede server og kræver ikke en Netlify udgivelse for at fungere. Dette repository indeholder samme kalender og en Netlify backend til brug ved flytning til Netlify. At pushe her opdaterer ikke automatisk det eksisterende ChatGPT Site.

## Netlify

Forbind repositoryet til et separat offentligt Netlify projekt, og brug netlify.toml. Der er ingen Google miljøvariabler at oprette. Den eksisterende portalløsning ændres ikke ved denne opsætning. Portalen kræver ikke login. Der findes ingen skrive API.

## Kontrol

`npm test` tester afvisning af skrivekald, CSV med kommaer og linjeskift samt kildebaseret datalæsning. `npm run build` kopierer kun index.html til public. Responsen viser sourceAt, som er hentetid for en vellykket læsning af alle fanerne. Det er ikke Googles seneste redigeringstid.
