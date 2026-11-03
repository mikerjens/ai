# FIXER AI produktionskalender

Kalender med vejrfarver, sceneplaceringer fra KALENDER, scener uden dato, TEAM og personligt skema. Offentlig kildekode indeholder ingen kontaktliste, produktionsdatasæt eller adgangsnøgler.

## Forbindelse uden Make

Google Sheets → Google Apps Script → Netlify Function → kalender.

Når kalenderen er åben, læser den planen én gang i minuttet og ved tilbagevenden til fanen. Funktionen læser direkte fra Google hver gang. Der er ingen baggrundsopgave eller genudgivelse af kode ved ændringer i arket. Ved fejl vises senest læste plan med fejlmarkering. Ændringer i kalenderplaceringer foretages i fanen KALENDER. Øvrige faner bevares som deres respektive datakilder.

## Engangsopsætning

1. Åbn produktionsarket som mk@fixer.fo. Vælg Udvidelser → Apps Script. Indsæt google-apps-script/Code.gs.
2. Opret Script Property GOOGLE_APPS_SCRIPT_SECRET med en tilfældig hemmelig værdi på mindst 32 tegn. Gem ikke værdien i regnearket eller GitHub.
3. Deploy → New deployment → Web app. Execute as: dig selv. Who has access: Anyone. Arket forbliver privat; scriptet afviser alle dataanmodninger uden den hemmelige værdi. Google adgang og denne afgrænsede udgivelse skal godkendes af ejeren.
4. Forbind dette repository til et separat Netlify projekt. Build og publish er angivet i netlify.toml. Aktivér privat adgang eller team login. API funktionen afviser anonyme forespørgsler, også hvis projektet ved en fejl er offentligt. Navnevalg i kalenderen er kun et visningsfilter.
5. Tilføj web app /exec adressen som GOOGLE_APPS_SCRIPT_URL og samme hemmelige værdi som GOOGLE_APPS_SCRIPT_SECRET i Netlify. Begge skal være tilgængelige for Functions og markeres som secrets. Redeploy efter ændring af miljøvariabler.
6. Log ind på portalen og lav en aftalt rettelse i KALENDER. Kontrollér at rettelsen og hentetid opdateres. Før dette er bekræftet, må synkronisering ikke kaldes testet eller aktiv.

Netlify team login kræver Netlify brugere og relevant projektadgang. Den eksisterende ChatGPT portal ændres ikke ved blot at lægge denne kode på GitHub. Der er ingen Netlify produktion tilknyttet denne kode, før opsætningen er gennemført.

## Kontrol

`npm test` kontrollerer at API'et afviser anonyme brugere, ikke lækker nøgler og kun returnerer validerede Google data. `npm run build` kopierer kun index.html til public. Serverkode og Google script ligger uden for publish mappen. Funktionssvar sætter deres egne private/no-store headers.
