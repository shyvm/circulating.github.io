# shyvm.github.io

Polished single-page portfolio frontend for showcasing:
- Presentations
- Documents
- Articles

## Edit your content
Update the `works` array in `script.js`:
- `title`
- `type` (`presentation`, `document`, `article`)
- `year`
- `summary`
- `tags`
- `link`

If `link` stays as `"#"`, the card will show `Add project URL`.

## Dedicated presentation subpage
Included example subpage for your uploaded deck:
- `work/normal-vr-case-study.html`
- `work/normal-vr-case-study.css`
- `work/normal-vr-case-study.js`
- `assets/normal-vr-case-study.pdf`

This subpage uses PDF.js to render slide pages with thumbnails and keyboard navigation.

## Local preview
Open from a local server (recommended):
```powershell
python -m http.server 5500
```
Then open `http://localhost:5500`.

## Deploy
This repository is configured for GitHub Pages using custom domain:
- `CNAME`: `www.circulating.io`
