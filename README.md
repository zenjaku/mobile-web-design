# Intranet Suite Preview

Modern intranet UI (HRIS, Payroll, Employees, Document Routing, Time In/Out) presented inside iPhone 13 mini and MacBook Air device frames for side‑by‑side comparison.

## Quick Start
1. Open `index.html` in a browser.
2. The device frames load the app UI from `app.html`.
3. Use the floating **Capture** button to download a side‑by‑side screenshot of both screens.

## Files
- `index.html` – preview shell (device frames + capture button)
- `app.html` – actual intranet UI
- `styles.css` – all styling (preview + app)
- `app.js` – app UI interactions (tabs, modal)
- `preview.js` – preview scaling and capture logic
- `apple-iphone-13-mini-2021-medium.png` – iPhone device frame
- `macbook-air-medium.png` – MacBook device frame

## Capture
The capture button uses `html2canvas` from a CDN to render the app inside each frame and download a PNG.

## Notes
- The preview page is scaled to 67% using `body.preview-body` and compensated in `preview.js` so the app fits the device screens correctly.
- If you want to run without the preview, open `app.html` directly.

## Customize
- Device screen alignment: edit CSS variables in `.device-preview` and `.device-preview.device-macbook`.
- App content and layout: edit `app.html`, `styles.css`, and `app.js`.
