(async function(){
  const { fmtAED, pct, fetchOffers } = window.Zyada;
  const C = window.ZYADA_CONFIG || {};
  const map = L.map('map').setView(C.DEFAULT_CENTER || [25.2048,55.2708], C.DEFAULT_ZOOM || 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap' }).addTo(map);

  const state = { offers: [], filtered: [], markers: [] };

  function renderList(items){
    const list = document.getElementById('list');
    list.innerHTML = '';
    if(!items.length){ list.innerHTML = '<div class="card">No deals match your filters right now. Try widening filters or come back later.</div>'; return; }
    for(const o of items){
      const el = document.createElement('div');
      el.className = 'offer';
      el.innerHTML = `
        <img src="${o.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop'}" alt="">
        <div>
          <div class="name">${o.itemName || '(untitled)'} <span class="badge discount">${pct(o.priceOriginal||0, o.priceSale||0)}% off</span></div>
          <div class="meta">${o.partnerName || ''} • ${o.cuisine || 'Misc'} • ${o.address || ''}</div>
          <div class="price"><span class="now">${fmtAED(o.priceSale||0)}</span> <span class="was">${fmtAED(o.priceOriginal||0)}</span></div>
          <div class="meta">Pickup: ${o.pickupStart || '?'} – ${o.pickupEnd || '?'}</div>
        </div>
      `;
      el.addEventListener('mouseenter', () => { if(o._marker){ o._marker.openPopup(); }});
      list.appendChild(el);
    }
  }

  function clearMarkers(){ state.markers.forEach(m => m.remove()); state.markers=[]; }
  function addMarkers(items){
    clearMarkers();
    for(const o of items){
      if(!(o.lat && o.lng)) continue;
      const popup = `
        <div style="font-weight:800">${o.itemName || ''}</div>
        <div style="font-size:12px;color:#6b7280">${o.partnerName || ''} • ${o.cuisine || ''}</div>
        <div style="margin-top:6px"><span style="font-weight:800;color:var(--primary)">${fmtAED(o.priceSale||0)}</span> <span style="text-decoration:line-through;color:#9ca3af">${fmtAED(o.priceOriginal||0)}</span></div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">Pickup: ${o.pickupStart || '?'} – ${o.pickupEnd || '?'}</div>
      `;
      const m = L.marker([o.lat, o.lng]).addTo(map).bindPopup(popup);
      o._marker = m;
      state.markers.push(m);
    }
  }

  function unique(arr){ return [...new Set(arr.filter(Boolean))]; }

  function applyFilters(){
    const q = document.getElementById('search').value.trim().toLowerCase();
    const maxPrice = Number(document.getElementById('maxPrice').value || 9999);
    const halal = document.getElementById('halal').checked;
    const veg = document.getElementById('veg').checked;
    const cuisineSel = Array.from(document.getElementById('cuisine').selectedOptions).map(o => o.value).filter(Boolean);

    const filtered = state.offers.filter(o => {
      const matchesQ = !q || (o.itemName||'').toLowerCase().includes(q) || (o.partnerName||'').toLowerCase().includes(q);
      const matchesPrice = !maxPrice || Number(o.priceSale||o.priceOriginal||0) <= maxPrice;
      const matchesHalal = !halal || !!o.halal;
      const matchesVeg = !veg || !!o.veg;
      const matchesCuisine = !cuisineSel.length || cuisineSel.includes((o.cuisine||'').toString());
      return matchesQ && matchesPrice && matchesHalal && matchesVeg && matchesCuisine;
    });
    state.filtered = filtered;
    renderList(filtered);
    addMarkers(filtered);
  }

  function initCuisineFilter(list){
    const sel = document.getElementById('cuisine');
    const cuisines = unique(list.map(o => o.cuisine));
    sel.innerHTML = '<option value="">All cuisines</option>' + cuisines.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // UI bindings
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('maxPrice').addEventListener('input', (e)=>{
    document.getElementById('maxPriceLabel').textContent = 'AED ≤ ' + e.target.value;
    applyFilters();
  });
  document.getElementById('halal').addEventListener('change', applyFilters);
  document.getElementById('veg').addEventListener('change', applyFilters);
  document.getElementById('cuisine').addEventListener('change', applyFilters);
  document.getElementById('refresh').addEventListener('click', load);
  document.getElementById('loc').addEventListener('click', ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        map.setView([pos.coords.latitude, pos.coords.longitude], 13);
      }, console.warn, {enableHighAccuracy:true, timeout:5000});
    }
  });

  async function load(){
    try{
      const offers = await fetchOffers();
      state.offers = offers.filter(o => o.itemName && o.partnerName); // basic hygiene
      initCuisineFilter(state.offers);
      applyFilters();
      // Fit map to markers if any
      const pts = state.offers.filter(o=>o.lat&&o.lng).map(o=>[o.lat,o.lng]);
      if(pts.length){
        const bounds = L.latLngBounds(pts);
        map.fitBounds(bounds.pad(0.2));
      }
    }catch(err){
      console.error(err);
      document.getElementById('list').innerHTML = '<div class="card">Could not load offers. Please try again later.</div>';
    }
  }

  load();
})();
