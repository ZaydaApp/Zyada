# Zyada MVP (static, zero recurring cost)

**Stack**
- Static HTML/CSS/JS (no build)
- Leaflet + OpenStreetMap tiles
- Google Sheets + Apps Script JSON endpoint
- GitHub Pages hosting (free)

## 1) Run locally (no backend)
1. Download this folder and open `index.html` in your browser.
2. The Customers page (`customers.html`) will load sample data by default.

## 2) Go live on GitHub Pages (free)
1. Create a new repo (e.g., `zyada`).
2. Upload all files at the repo root.
3. In **Settings → Pages**, set **Branch** = `main` and **Folder** = `/ (root)`.
4. Wait 1–2 minutes. Your site will appear at `https://<username>.github.io/zyada/`.

## 3) Connect Google Sheets (live data)
1. Make a Google Sheet with a tab called `Offers`. Suggested columns:

   ```
   Partner, Outlet, ItemName, Cuisine, Original, Sale, Halal, Veg, Qty, PickupStart, PickupEnd, Address, Lat, Lng, ImageUrl
   ```

2. Put your existing sample data there or connect your Google Form to this Sheet.

3. Open `apps-script/Code.gs` and paste into **Extensions → Apps Script** in your Sheet.

4. **Deploy** → **New deployment** → **Web app**:
   - Description: Zyada API
   - Execute as: Me
   - Who has access: Anyone
   - Copy the URL

5. Edit `js/config.js`:
   - Set `API_URL` to the web app URL
   - Set `USE_SAMPLE_DATA` to `false`
   - (Optional) Set `PARTNER_FORM_URL` to your Google Form

6. Commit changes and refresh `customers.html` on your live site.

## 4) Tiles / credits (OSM)
OpenStreetMap tiles are fine for an MVP. For production, consider a hosted provider.

## 5) Customization
- Colors: edit CSS variables at the top of `styles.css`
- Fonts: loaded via Google Fonts (Inter + Tajawal)
- Logo: `assets/zyada-logo.svg` (simple wordmark with a "bite")
