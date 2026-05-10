const destinations = [
  { city: "Paris", country: "France", popularity: 98, costLevel: "HIGH", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
  { city: "Kyoto", country: "Japan", popularity: 94, costLevel: "MEDIUM", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" },
  { city: "Bali", country: "Indonesia", popularity: 91, costLevel: "LOW", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4" },
  { city: "Dubai", country: "United Arab Emirates", popularity: 89, costLevel: "HIGH", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
  { city: "Goa", country: "India", popularity: 87, costLevel: "LOW", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" },
  { city: "Rome", country: "Italy", popularity: 92, costLevel: "MEDIUM", image: "https://images.unsplash.com/photo-1529260830199-42c24126f198" }
];

const searchCities = (req, res) => {
  const { q, country, costLevel } = req.query;
  const query = q ? q.toLowerCase() : "";
  const results = destinations.filter((item) => {
    const matchesQuery = !query || item.city.toLowerCase().includes(query) || item.country.toLowerCase().includes(query);
    const matchesCountry = !country || item.country === country;
    const matchesCost = !costLevel || item.costLevel === costLevel;
    return matchesQuery && matchesCountry && matchesCost;
  });
  res.json({ destinations: results });
};

module.exports = { searchCities, destinations };

