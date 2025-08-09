(function(){
  const C = window.ZYADA_CONFIG || {};
  const AED = C.AED_SYMBOL || "AED";

  function fmtAED(n){ try { return new Intl.NumberFormat('en-AE', {style:'currency', currency:'AED', maximumFractionDigits:0}).format(n); } catch(e){ return AED+' '+Number(n).toFixed(0); } }
  function pct(oldP, newP){ const d = (1 - (newP / Math.max(1, oldP))) * 100; return Math.round(d); }

  function normalize(row){
    // Accept flexible headers coming from Sheets
    const pick = (keys, def=null) => {
      for(const k of keys){
        if(row[k] !== undefined && row[k] !== "") return row[k];
        const lk = Object.keys(row).find(x => x.toLowerCase() === (k+'').toLowerCase());
        if(lk && row[lk] !== "") return row[lk];
      }
      return def;
    };
    const priceOriginal = Number(pick(['priceOriginal','original','price_before','original_price','was','priceWas'], 0));
    const priceSale = Number(pick(['priceSale','sale','price_after','sale_price','now','priceNow'], 0));
    const halalRaw = pick(['halal'], '').toString().toLowerCase();
    const vegRaw = pick(['veg','vegetarian'], '').toString().toLowerCase();
    const lat = Number(pick(['lat','latitude'], 0));
    const lng = Number(pick(['lng','lon','long','longitude'], 0));
    return {
      id: pick(['id','ID','timestamp','Timestamp'], cryptoRandomId()),
      itemName: pick(['itemName','item','name','ItemName','Product']),
      partnerName: pick(['partnerName','partner','restaurant','outlet','brand']),
      cuisine: pick(['cuisine','Cuisine','Category'],''),
      priceOriginal: priceOriginal,
      priceSale: priceSale,
      halal: halalRaw === 'yes' || halalRaw === 'true' || halalRaw === '1',
      veg: vegRaw === 'yes' || vegRaw === 'true' || vegRaw === '1',
      qty: Number(pick(['qty','quantity','Qty'], 1)),
      pickupStart: pick(['pickupStart','pickup_start','start','startTime','pickup from'], ''),
      pickupEnd: pick(['pickupEnd','pickup_end','end','endTime','pickup to'], ''),
      address: pick(['address','Address','location'], ''),
      lat, lng,
      imageUrl: pick(['imageUrl','image','img','photo'],'')
    };
  }

  function cryptoRandomId(){
    if(window.crypto && crypto.getRandomValues){
      const arr = new Uint32Array(2); crypto.getRandomValues(arr); return 'ID-' + arr[0].toString(16) + arr[1].toString(16);
    }
    return 'ID-' + Math.random().toString(16).slice(2);
  }

  async function fetchOffers(){
    if(C.USE_SAMPLE_DATA) return window.ZYADA_SAMPLE_DATA.map(x => normalize(x));
    const url = C.API_URL;
    if(!url){ console.warn('No API_URL set in config.js'); return []; }
    const res = await fetch(url, {mode:'cors'});
    if(!res.ok){ console.error('Bad response from API', res.status); return []; }
    const data = await res.json();
    if(Array.isArray(data)) return data.map(x => normalize(x));
    if(data && Array.isArray(data.items)) return data.items.map(x => normalize(x));
    return [];
  }

  // Expose helpers to page scripts
  window.Zyada = { fmtAED, pct, fetchOffers, normalize };
})();
