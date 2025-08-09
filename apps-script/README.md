# Apps Script for Zyada

1. Open your Google Sheet (the one that will store offers).
2. Go to **Extensions → Apps Script**.
3. Replace the default code with `Code.gs` from this folder.
4. Click **Deploy → New deployment → Web app**:
   - Execute as: Me
   - Who has access: Anyone
5. Copy the deployment URL and paste it into `js/config.js` as `API_URL`.
6. Back on the Sheet, ensure your tab is named **Offers** and has headers in row 1.
