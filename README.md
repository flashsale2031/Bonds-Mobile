# Bonds-Mobile

Fast and reliable 5G data network.

## GPS Signal Console

This repository now includes a self-contained browser GPS dashboard in [`index.html`](./index.html). It uses the browser's secure `navigator.geolocation` API to request a one-time location reading after the user presses **Connect to GPS**. The page displays:

- Current latitude and longitude, plus an accuracy estimate
- A best-effort device name and device type from browser platform information
- Local time zone, UTC offset, live clock, language, and platform
- Clear permission, loading, success, unsupported-browser, and error states

No location data is sent to a server or stored by the page. GPS access requires a secure context (HTTPS or localhost) and user permission.

### Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` and select **Connect to GPS**.
