// Minimal sample data so the customers page works before you connect Google Sheets.
// Format expected by the app (one object per offer):
// { id, itemName, partnerName, cuisine, priceOriginal, priceSale, halal, veg, qty, pickupStart, pickupEnd, address, lat, lng, imageUrl }
window.ZYADA_SAMPLE_DATA = [
  {
    id: "SAMPLE-1",
    itemName: "Assorted Pastry Box",
    partnerName: "Al Reef Bakery - JLT",
    cuisine: "Bakery",
    priceOriginal: 30,
    priceSale: 12,
    halal: true,
    veg: true,
    qty: 8,
    pickupStart: "18:00",
    pickupEnd: "21:00",
    address: "Cluster D, JLT, Dubai",
    lat: 25.0746,
    lng: 55.1440,
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "SAMPLE-2",
    itemName: "Chicken Biryani Portion",
    partnerName: "Karachi Kitchen - Al Barsha",
    cuisine: "Pakistani",
    priceOriginal: 28,
    priceSale: 15,
    halal: true,
    veg: false,
    qty: 12,
    pickupStart: "19:00",
    pickupEnd: "21:30",
    address: "Al Barsha 1, Dubai",
    lat: 25.1104,
    lng: 55.1999,
    imageUrl: "https://images.unsplash.com/photo-1604908553613-69474a4db1df?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "SAMPLE-3",
    itemName: "Sushi Surprise Box (6pc)",
    partnerName: "Umi Sushi - Marina",
    cuisine: "Japanese",
    priceOriginal: 48,
    priceSale: 24,
    halal: false,
    veg: false,
    qty: 5,
    pickupStart: "20:00",
    pickupEnd: "22:00",
    address: "Dubai Marina Walk",
    lat: 25.0790,
    lng: 55.1406,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
  }
];
