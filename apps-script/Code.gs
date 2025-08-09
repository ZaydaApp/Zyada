/**
 * Zyada Apps Script: publish Offers as JSON
 * Expected Sheet: a tab named "Offers" with headers in row 1.
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Offers');
  if(!sh) return ContentService.createTextOutput(JSON.stringify({error:'Missing Offers sheet'})).setMimeType(ContentService.MimeType.JSON);

  const range = sh.getDataRange();
  const values = range.getValues();
  if(values.length < 2) return jsonOut([]);

  const headers = values[0].map(String);
  const rows = values.slice(1).filter(r => r.join('').trim().length);
  const items = rows.map(r => {
    const obj = {};
    headers.forEach((h,i) => obj[h] = r[i]);
    // Ensure numbers for prices and lat/lng if present
    if(obj.Original) obj.Original = Number(obj.Original);
    if(obj.Sale) obj.Sale = Number(obj.Sale);
    if(obj.Lat) obj.Lat = Number(obj.Lat);
    if(obj.Lng) obj.Lng = Number(obj.Lng);
    return obj;
  });

  const res = items.map(x => ({
    id: x.ID || x.Timestamp || new Date().getTime(),
    itemName: x.ItemName || x.Item || x.Name,
    partnerName: x.Partner || x.Outlet || x.Restaurant,
    cuisine: x.Cuisine || '',
    priceOriginal: Number(x.Original || x.PriceOriginal || x.Price_Before || 0),
    priceSale: Number(x.Sale || x.PriceSale || x.Price_After || 0),
    halal: parseYesNo(x.Halal),
    veg: parseYesNo(x.Veg || x.Vegetarian),
    qty: Number(x.Qty || x.Quantity || 1),
    pickupStart: x.PickupStart || x.Start || '',
    pickupEnd: x.PickupEnd || x.End || '',
    address: x.Address || '',
    lat: Number(x.Lat || 0),
    lng: Number(x.Lng || 0),
    imageUrl: x.ImageUrl || x.Image || ''
  }));

  return jsonOut(res);
}

function parseYesNo(v){
  if(v === true) return true;
  if(v === false) return false;
  const s = String(v || '').toLowerCase();
  return s === 'yes' || s === 'true' || s === 'y' || s === '1';
}

function jsonOut(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Cache-Control', 'no-cache');
}
