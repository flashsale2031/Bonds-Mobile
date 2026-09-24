# Bonds-Mobile

Fast and reliable 5G data network.

## GPS Signal Console

This repository now includes a self-contained browser GPS dashboard in [`index.html`](./index.html). The dedicated [`permissions.js`](./permissions.js) module checks the browser's Geolocation permission state and only requests a precise reading after the user presses **Connect to GPS** and approves the native browser prompt. The page displays:

- Current latitude and longitude, plus an accuracy estimate
- A best-effort device name and device type from browser platform information
- Local time zone, UTC offset, live clock, language, and platform
- Clear permission, loading, success, unsupported-browser, and error states

No location data is sent to a server or stored by the page. The dashboard stays locked until permission is granted, and renders the coordinate readout only from the approved GPS result. GPS access requires a secure context (HTTPS or localhost) and user permission. A static site cannot grant permission through a file or code; the browser's native approval prompt is the security boundary.

## Site navigation

The home page includes a responsive Bonds Mobile header menu. Each menu object has its own standalone page under [`pages/`](./pages/): Account, Your Device, Your Number, Data & Usage, Hotspot, Security & Privacy, Support, and About.

### Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` and select **Connect to GPS**.
