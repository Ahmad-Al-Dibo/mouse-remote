<<<<<< codex/define-planning-protocol-for-project-p8yv5d
# PROJECT_MAP.md — TV Mouse Remote Product Map
=======
# PROJECT_MAP.md — TV Mouse Remote Planning Protocol
>>>>>> remote-v2

## [TECH_STACK]

### Datum- en dependency-baseline
- Systeemdatum bepaald met `date '+%Y-%m-%d %H:%M:%S %Z'`: **2026-05-11 07:55:05 UTC**.
<<<<<< codex/define-planning-protocol-for-project-p8yv5d
- Lokale npm/PyPI registry checks via shell kregen `403 Forbidden`; dependencykeuzes zijn daarom beperkt gehouden en er zijn geen nieuwe npm packages toegevoegd.
- Backend: Python Flask API met lazy-loaded `pyautogui` voor host-OS muisbesturing.
- Frontend: React + Vite webapp.

### Productie-baseline
- Python dependencies vastgezet op `flask==3.1.3`, `pyautogui==0.9.54`, `flask-cors==6.0.2`.
- npm runtime blijft `react@^19.2.5`, `react-dom@^19.2.5`.
- npm dev stack blijft bestaand: Vite, ESLint en React plugins; er is geen extra frontend dependency nodig.

## [SYSTEM_FLOW]

### Gekozen MVP-beslissing
- Doelplatform: **pc_hdmi**.
- Betekenis: de computer waarop de Flask backend draait is aangesloten op de TV of projecteert naar de TV; de app bestuurt die zichtbare TV-weergave.
- Netwerkmodel: **LAN-only** via browser naar Flask API.
- Native Android TV, Samsung Tizen, LG webOS, Apple TV, discovery, pairing en internetbediening zijn uitgesloten van deze release.

### Verifieerbare GUI-gebruikersreis
- VG-1: Gebruiker opent React app en ziet status `Niet verbonden`.
- VG-2: Gebruiker laat targetnaam op `local-display` staan of vult een naam in en drukt op `Connect TV`.
- VG-3: UI toont verbonden status wanneer `POST /api/tv/connect` een `target_id` teruggeeft.
- VG-4: Gebruiker sleept op het touchpad; UI stuurt relatieve `dx/dy` naar `POST /api/tv/move`.
- VG-5: Gebruiker drukt op `Klik / Selecteer`, `OK` of tikt op het touchpad; UI stuurt `POST /api/tv/click`.
- VG-6: D-pad knoppen bewegen de cursor met vaste stappen.
- VG-7: Reset zet de hostcursor terug naar `(10,10)`.
- VG-8: API-fouten verschijnen als korte foutmelding in de UI.

### Verifieerbare API-dataflow
- `POST /api/tv/connect` met `{ "host": "local-display", "platform": "pc_hdmi" }` geeft `{ "status": "success", "target_id": "local-tv" }`.
- `POST /api/tv/move` met `{ "target_id": "local-tv", "dx": 40, "dy": 0 }` beweegt de cursor en geeft de nieuwe positie terug.
- `POST /api/tv/click` met `{ "target_id": "local-tv" }` voert één click/select uit.
- Bewegen of klikken zonder actieve target geeft HTTP `409`.
- Niet-ondersteund platform geeft HTTP `400`.

## [ARCHITECTURE]

### Simplicity First
- Er is geen generieke TV-SDK-laag gebouwd.
- De backend bevat één minimale `TvTargetController` voor het gekozen `pc_hdmi` target.
- `pyautogui` wordt lazy geladen zodat backend tests zonder grafische `DISPLAY` kunnen draaien.
- De React app gebruikt één scherm met connectiekaart, touchpad, click/select, D-pad en reset.

### Backend
- `PythonServer/cli.py` beheert routes, inputvalidatie, `TvTargetController`, legacy mouse endpoints en async logging.
- `PyAutoGuiMouseDriver` kapselt alleen de herhaalde OS-muisacties in: `position`, `move_to`, `click`.
- Fouten zijn expliciet: validatiefouten `400`, ontbrekende targetconnectie `409`, onverwachte backendfouten `500` met veilige boodschap.

### Frontend
- `ReactApp/src/hooks/useMouseRemote.js` bevat alle API-calls: bestaande mouse endpoints plus `connectTv`, `moveTv`, `clickTv`.
- `ReactApp/src/App.jsx` implementeert de gevraagde gebruikersreis zonder extra schermen of speculatieve features.
- `ReactApp/src/App.css` bevat alleen styling voor de nieuwe connectiestatus, touchpad-state, controls en foutmelding.

### Safe Logging
- Backend logging gebruikt `QueueHandler` + `QueueListener` voor niet-blokkerende logs.
- Niveaus: `INFO`, `WARNING`, `ERROR`; `DEBUG` blijft beschikbaar via standaard loggingconfiguratie.
- Gelogd wordt: endpoint, status, latency, target type en veilige fouttekst.
- Niet gelogd wordt: volledige request body, tokens of pairingcodes.

## [ORPHANS & PENDING]

- Geen open productonderdelen voor de gekozen `pc_hdmi` MVP.
- Native Smart TV-platformdrivers blijven bewust buiten scope van deze release.
=======
- Lokale npm/PyPI CLI-checks zijn geprobeerd, maar registry-verkeer kreeg `403 Forbidden`; daarom zijn officiële webbronnen gebruikt waar bereikbaar.
- Huidige backend: Python Flask API met `pyautogui` voor host-OS muisbesturing.
- Huidige frontend: React + Vite webapp.

### Huidige dependencies in repo
- Python: `flask==2.3.0`, `pyautogui==0.9.53`, `flask-cors==4.0.0`.
- npm runtime: `react@^19.2.5`, `react-dom@^19.2.5`, `cors@^2.8.6`.
- npm dev: `vite@^8.0.10`, `@vitejs/plugin-react@^6.0.1`, `eslint@^10.2.1`, `@eslint/js@^10.0.1`, `eslint-plugin-react-hooks@^7.1.1`, `eslint-plugin-react-refresh@^0.5.2`, `globals@^17.5.0`, `@types/react@^19.2.14`, `@types/react-dom@^19.2.3`.

### Gecontroleerde stabiele versies tot en met 2026-05
- React / React DOM: GitHub release `v19.2.6` op 2026-05-06; gebruiken als stabiele baseline voor nieuwe planning.
- Flask: PyPI `3.1.3` op 2026-02-19; huidige `2.3.0` is oud en moet vóór featurebouw worden geüpdatet of expliciet vastgezet met reden.
- PyAutoGUI: PyPI `0.9.54` op 2023-05-24; huidige `0.9.53` is oud maar de library blijft bruikbaar voor host-computerbesturing, niet voor native TV-besturing.
- Flask-CORS: PyPI `6.0.2` op 2025-12-12; huidige `4.0.0` is oud en moet vóór featurebouw worden geüpdatet of vervangen door beperkte CORS-configuratie.
- Vite: lokale `package.json` gebruikt `^8.0.10`; npm CLI-verificatie faalde door registry-403, dus geen dependency bump plannen zonder herverificatie in een open registry-omgeving.

### Dependency-regel
- Geen deprecated of yanked packages toevoegen.
- Geen nieuwe TV SDK of ADB/HID dependency toevoegen voordat het TV-platform expliciet gekozen is.
- Voor de eenvoudigste eerste versie is geen extra frontend dependency nodig.

## [SYSTEM_FLOW]

### Think Before Coding — aannames
- De bestaande app bestuurt nu de muis van de machine waarop `PythonServer/cli.py` draait; dit is praktisch voor een laptop/PC, niet automatisch voor een Smart TV.
- De gewenste “TV mouse remote” betekent waarschijnlijk: telefoon/browser als touchpad, backend maakt verbinding met TV, cursor beweegt op TV en klikken werken.
- Native muisbesturing op een TV is platform-afhankelijk en niet generiek: Android TV, Google TV, Samsung Tizen, LG webOS en een PC via HDMI hebben verschillende APIs en beperkingen.
- Klikken en bewegen zijn in scope; tekstinvoer, app-launching, schermstreaming, pairing-wizard en macro’s zijn buiten scope totdat ze expliciet gevraagd worden.

### Onduidelijkheden — blokkeren implementatie
1. Welk doelplatform moet bestuurd worden: Android/Google TV, Samsung Tizen, LG webOS, Apple TV, of een PC die op de TV is aangesloten?
2. Moet de muis op de TV zelf bewegen, of op een PC/laptop die via HDMI op de TV zichtbaar is?
3. Mag de TV in developer/debug mode gezet worden, bijvoorbeeld Android TV met ADB over netwerk?
4. Is alleen LAN-gebruik acceptabel, of moet dit via internet werken?

### Verifieerbare doelen: GUI-gebruikersreis
- VG-1: Gebruiker opent React app op telefoon/browser en ziet verbindingsstatus.
- VG-2: Gebruiker kiest één bekende TV/target en drukt op “Connect”.
- VG-3: App toont “Connected” alleen als backend de target-connectie succesvol heeft gevalideerd.
- VG-4: Gebruiker sleept op touchpad; backend ontvangt relatieve `dx/dy` en target voert cursorbeweging uit.
- VG-5: Gebruiker tikt op touchpad; backend voert één click/select uit.
- VG-6: Bij connectie- of target-fout toont de UI één korte foutmelding en stopt verdere input.

### Verifieerbare doelen: API-dataflow
- `POST /api/tv/connect` met `{ host, platform }` geeft `{ status, target_id }` of HTTP 400/502.
- `POST /api/tv/move` met `{ target_id, dx, dy }` geeft `{ status: "success" }` of fout.
- `POST /api/tv/click` met `{ target_id }` geeft `{ status: "success" }` of fout.
- Geen streaming, discovery of macro-endpoints in de eerste scope.

## [ARCHITECTURE]

### Praktische beoordeling huidige code
- Praktisch voor PC-muisbediening: ja, omdat Flask endpoints direct `pyautogui` aanroepen.
- Praktisch voor TV-muisbediening: alleen als de TV eigenlijk een PC-scherm is, of als er een TV-specifieke driver wordt toegevoegd.
- Grootste architectuurrisico: de huidige backend mengt HTTP-routes, validatie en device-acties in één bestand; voor één extra target kan dat nog, maar TV-platformlogica mag niet in route handlers groeien.

### Simplicity First — voorgestelde richting
- Eerste stap is géén generiek “alle TV’s” framework.
- Kies exact één target-driver na beantwoording van de platformvragen.
- Houd React UI grotendeels gelijk: touchpad en click-knop hergebruiken; alleen verbindingsstatus en target-config toevoegen.
- Backend krijgt maximaal één kleine target-laag: `TargetController` met `connect()`, `move(dx, dy)`, `click()` als en alleen als dezelfde interface door bestaande host-PC en gekozen TV-driver gebruikt wordt.

### Feature-gebaseerde structuur, zonder micro-files
- Backend feature: `PythonServer/cli.py` mag initieel routes houden; alleen bij gekozen TV-driver één module toevoegen, bijvoorbeeld `PythonServer/tv_control.py`.
- Frontend feature: bestaande `Touchpad` en hook uitbreiden; geen nieuwe component per knop.
- Shared/core-laag alleen maken als host-PC en TV-driver dezelfde acties delen; anders geen abstractie.

### Safe Logging
- Gebruik standaard Python `logging` met `QueueHandler` + `QueueListener` voor niet-blokkerende backendlogs.
- Niveaus: `DEBUG`, `INFO`, `WARNING`, `ERROR`.
- Log alleen: connect-pogingen, target type, endpointnaam, succes/foutcode, latency.
- Log nooit: volledige request bodies met IP/token/TV-pairingcodes.
- Frontend logging blijft beperkt tot ontwikkelmodus; productie toont alleen gebruikersmeldingen.

### No Feature Creep
- Niet bouwen vóór platformkeuze: auto-discovery, multi-TV support, pairing wizard, screen mirror, keyboard, volume/channel controls, macro recorder, accounts/auth via internet.
- Wel toestaan in eerste versie: handmatige host/IP-config, connect, move, click, reset/error-state.

### Milestones op basis van verifieerbare doelen
1. **M0 — Platformbesluit**: de vier open vragen zijn beantwoord; één target is gekozen.
2. **M1 — Dependency baseline**: Python dependencies geüpdatet of bewust vastgezet; `npm install`/`pip install` reproduceerbaar.
3. **M2 — Backend target spike**: één handmatige connectie naar gekozen target werkt; `connect`, `move`, `click` zijn via curl verifieerbaar.
4. **M3 — UI integratie**: React toont connectiestatus en stuurt touchpad-events naar de nieuwe target endpoints.
5. **M4 — Veiligheid en logging**: async logging actief, request-validatie aanwezig, duidelijke foutmeldingen zonder gevoelige data.
6. **M5 — Acceptatie**: gebruiker kan op LAN verbinden, cursor bewegen en één click uitvoeren op het gekozen target.

## [ORPHANS & PENDING]

- Beslissing nodig: TV-platform en toegestane verbindingsmethode.
- Beslissing nodig: LAN-only of internet; advies is LAN-only voor eerste versie.
- Beslissing nodig: PC via HDMI als eenvoudigste haalbare MVP of native TV-driver.
- Pending: dependency herverificatie via npm registry zodra `403 Forbidden` opgelost is.
- Pending: bepalen of `pyautogui` voldoende blijft of vervangen moet worden door platform-specifieke input API.
- Pending: teststrategie voor echte TV-input, omdat headless CI geen fysieke cursor/TV kan valideren.

## Goedkeuringspunt

Wacht op expliciete goedkeuring en antwoorden op de open platformvragen voordat er featurecode wordt aangepast.
>>>>>> remote-v2
