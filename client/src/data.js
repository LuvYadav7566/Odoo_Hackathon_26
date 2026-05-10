export const sampleTrips = [
  {
    id: "demo-1",
    title: "Japan Spring Loop",
    description: "Tokyo, Kyoto and Osaka with cherry blossom walks.",
    startingPlace: "Ahmedabad",
    destinationPlace: "Japan",
    startDate: "2026-04-04",
    endDate: "2026-04-15",
    status: "PLANNING",
    coverImage: "https://images.unsplash.com/photo-1528164344705-47542687000d",
    stops: [{ city: "Tokyo" }, { city: "Kyoto" }, { city: "Osaka" }]
  },
  {
    id: "demo-2",
    title: "Bali Reset",
    description: "Beach mornings, temples, rice terraces and slow cafes.",
    startingPlace: "Mumbai",
    destinationPlace: "Bali",
    startDate: "2026-06-12",
    endDate: "2026-06-20",
    status: "SAVED",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    stops: [{ city: "Ubud" }, { city: "Canggu" }]
  }
];

export const destinations = [
  { city: "Paris", country: "France", popularity: 98, costLevel: "HIGH", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
  { city: "Kyoto", country: "Japan", popularity: 94, costLevel: "MEDIUM", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" },
  { city: "Bali", country: "Indonesia", popularity: 91, costLevel: "LOW", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4" },
  { city: "Goa", country: "India", popularity: 87, costLevel: "LOW", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" }
];

export const activities = [
  { title: "Old Town walking tour", category: "CULTURE", duration: 180, cost: 3000 },
  { title: "Street food tasting", category: "FOOD", duration: 120, cost: 2200 },
  { title: "Sunset viewpoint", category: "SIGHTSEEING", duration: 90, cost: 0 },
  { title: "Kayak adventure", category: "ADVENTURE", duration: 150, cost: 5500 }
];
