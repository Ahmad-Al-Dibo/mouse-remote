# PROJECT_MAP.md — TV Mouse Remote Product Map

## [TECH_STACK]

### Datum- en dependency-baseline
- Systeemdatum bepaald met `date '+%Y-%m-%d %H:%M:%S %Z'`: **2026-05-11 07:55:05 UTC**.
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
