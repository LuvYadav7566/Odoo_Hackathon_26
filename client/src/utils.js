export const currency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
};

export const getActiveTripId = () => localStorage.getItem("traveloop_active_trip");

export const setActiveTripId = (id) => {
  if (id) localStorage.setItem("traveloop_active_trip", id);
};

export const getCachedTrips = () => {
  try {
    return JSON.parse(localStorage.getItem("traveloop_trips_cache") || "[]");
  } catch {
    return [];
  }
};

export const setCachedTrips = (trips) => {
  localStorage.setItem("traveloop_trips_cache", JSON.stringify(trips || []));
};

export const getCachedActiveTrip = () => {
  try {
    return JSON.parse(localStorage.getItem("traveloop_active_trip_cache") || "null");
  } catch {
    return null;
  }
};

export const setCachedActiveTrip = (trip) => {
  if (trip) localStorage.setItem("traveloop_active_trip_cache", JSON.stringify(trip));
};

export const tripDays = (trip) => {
  if (!trip?.startDate || !trip?.endDate) return 1;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diff = Math.round((end - start) / 86400000) + 1;
  return Math.max(diff, 1);
};

export const computeActivityTotal = (trip) => {
  return (trip?.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0);
};

export const groupActivitiesByDay = (trip) => {
  const days = {};
  (trip?.activities || []).forEach((activity) => {
    const day = activity.dayNumber || 1;
    if (!days[day]) days[day] = [];
    days[day].push(activity);
  });
  return days;
};
