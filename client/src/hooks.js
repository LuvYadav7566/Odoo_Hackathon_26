import { useEffect, useState } from "react";
import api from "./api/axios";
import { getActiveTripId, getCachedActiveTrip, getCachedTrips, setActiveTripId, setCachedActiveTrip, setCachedTrips } from "./utils";

export function useActiveTrip() {
  const [trip, setTrip] = useState(() => getCachedActiveTrip());
  const [loading, setLoading] = useState(() => !getCachedActiveTrip());
  const [error, setError] = useState("");

  const loadTrip = async () => {
    const id = getActiveTripId();
    if (!id) {
      const cachedTrips = getCachedTrips();
      if (cachedTrips[0]) {
        setActiveTripId(cachedTrips[0].id);
        setTrip(cachedTrips[0]);
        setCachedActiveTrip(cachedTrips[0]);
        setLoading(false);
      }
      try {
        if (!cachedTrips[0]) setLoading(true);
        const res = await api.get("/trips");
        const firstTrip = res.data.trips?.[0];
        setCachedTrips(res.data.trips || []);
        if (firstTrip?.id) {
          setActiveTripId(firstTrip.id);
          const detail = await api.get(`/trips/${firstTrip.id}`);
          setTrip(detail.data.trip);
          setCachedActiveTrip(detail.data.trip);
        } else {
          setTrip(null);
        }
        setError("");
      } catch (err) {
        setTrip(null);
        setError(err.response?.data?.message || "Could not load trips");
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      const cached = getCachedActiveTrip();
      if (cached?.id === id) {
        setTrip(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data.trip);
      setCachedActiveTrip(res.data.trip);
      setError("");
    } catch (err) {
      localStorage.removeItem("traveloop_active_trip");
      try {
        const res = await api.get("/trips");
        setCachedTrips(res.data.trips || []);
        const firstTrip = res.data.trips?.[0];
        if (firstTrip?.id) {
          setActiveTripId(firstTrip.id);
          const detail = await api.get(`/trips/${firstTrip.id}`);
          setTrip(detail.data.trip);
          setCachedActiveTrip(detail.data.trip);
          setError("");
        } else {
          setTrip(null);
          setError("Create a trip first");
        }
      } catch (fallbackError) {
        setTrip(null);
        setError(fallbackError.response?.data?.message || "Could not load active trip");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, []);

  return { trip, setTrip, loading, error, reload: loadTrip };
}
