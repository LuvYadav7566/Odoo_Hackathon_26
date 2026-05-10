import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TripCard from "../components/TripCard.jsx";
import { getCachedTrips, setActiveTripId, setCachedActiveTrip, setCachedTrips } from "../utils";

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(() => getCachedTrips());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(() => getCachedTrips().length === 0);
  const [error, setError] = useState("");

  const load = () => {
    if (trips.length === 0) setLoading(true);
    api.get("/trips")
      .then((res) => {
        const nextTrips = res.data.trips || [];
        setTrips(nextTrips);
        setCachedTrips(nextTrips);
        setError("");
      })
      .catch((err) => {
        setTrips([]);
        setError(err.response?.data?.message || "Could not load trips");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredTrips = useMemo(() => {
    const term = query.trim().toLowerCase();
    return trips.filter((trip) => {
      const matchesText = !term || [trip.title, trip.startingPlace, trip.destinationPlace].filter(Boolean).join(" ").toLowerCase().includes(term);
      const matchesStatus = status === "ALL" || trip.status === status;
      return matchesText && matchesStatus;
    });
  }, [trips, query, status]);

  const activeTrips = filteredTrips.filter((trip) => trip.status !== "COMPLETED");
  const completedTrips = filteredTrips.filter((trip) => trip.status === "COMPLETED");

  const remove = async (id) => {
    const nextTrips = trips.filter((trip) => trip.id !== id);
    setTrips(nextTrips);
    setCachedTrips(nextTrips);
    await api.delete(`/trips/${id}`);
  };

  const updateStatus = async (trip, nextStatus) => {
    const nextTrips = trips.map((item) => item.id === trip.id ? { ...item, status: nextStatus } : item);
    setTrips(nextTrips);
    setCachedTrips(nextTrips);
    await api.put(`/trips/${trip.id}`, { status: nextStatus });
  };

  const openTrip = (trip, path = "/itinerary/builder") => {
    setActiveTripId(trip.id);
    setCachedActiveTrip(trip);
    navigate(path);
  };

  const renderSection = (title, items, emptyText) => (
    <section className="trip-section">
      <div className="section-heading"><h2>{title}</h2><span>{items.length} trips</span></div>
      {items.length === 0 && <div className="panel empty-state"><p>{emptyText}</p></div>}
      <div className="card-grid">
        {items.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onDelete={remove}
            onOpen={() => openTrip(trip, "/itinerary/view")}
            onEdit={() => openTrip(trip, "/itinerary/builder")}
            onComplete={trip.status === "COMPLETED" ? undefined : () => updateStatus(trip, "COMPLETED")}
            onActivate={trip.status === "COMPLETED" ? () => updateStatus(trip, "PLANNING") : undefined}
          />
        ))}
      </div>
    </section>
  );

  return (
    <section className="page-stack">
      <div className="page-header"><span className="eyebrow">Real trip library</span><h1>My Trips</h1><p>Only trips saved in your Neon database are shown here.</p></div>
      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, start place, destination" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">All status</option>
          <option value="PLANNING">Planning</option>
          <option value="ONGOING">Ongoing</option>
          <option value="SAVED">Saved</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      {error && <div className="toast error">{error}</div>}
      {loading && <div className="panel">Loading trips...</div>}
      {!loading && trips.length === 0 && <div className="panel empty-state"><h3>No original trips found</h3><p>Create a trip first. Dummy trips are no longer shown.</p><button className="primary-button" onClick={() => navigate("/trips/new")}>Create Trip</button></div>}
      {!loading && trips.length > 0 && renderSection("Active Trips", activeTrips, "No active trips match this filter.")}
      {!loading && trips.length > 0 && renderSection("Completed Trips", completedTrips, "No completed trips yet.")}
    </section>
  );
}
