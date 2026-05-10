import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard.jsx";
import TripCard from "../components/TripCard.jsx";
import { currency, getCachedTrips, setCachedTrips } from "../utils";

export default function Dashboard() {
  const [trips, setTrips] = useState(() => getCachedTrips());
  const [loading, setLoading] = useState(() => getCachedTrips().length === 0);

  useEffect(() => {
    api.get("/trips")
      .then((res) => {
        setTrips(res.data.trips || []);
        setCachedTrips(res.data.trips || []);
      })
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.budget?.total || 0), 0);
  const publicShares = trips.reduce((sum, trip) => sum + (trip.sharedTrips?.length || 0), 0);

  return (
    <section className="page-stack">
      <div className="hero-panel">
        <div>
          <span className="eyebrow">Plan smarter loops</span>
          <h1>Your next multi-city trip, organized in one calm dashboard.</h1>
          <p>Build routes, budgets, packing lists and public itineraries without scattered notes.</p>
          <Link to="/trips/new" className="primary-button inline">Create New Trip</Link>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard label="Active trips" value={trips.filter((trip) => trip.status !== "COMPLETED").length} tone="green" />
        <StatCard label="Cities planned" value={trips.reduce((sum, trip) => sum + (trip.stops?.length || 0), 0)} tone="blue" />
        <StatCard label="Budget tracked" value={currency(totalBudget)} tone="coral" />
        <StatCard label="Public shares" value={publicShares} tone="violet" />
      </div>
      <div className="section-heading"><h2>Recent trips</h2><Link to="/trips">View all</Link></div>
      {loading && <div className="panel">Loading your trips...</div>}
      {!loading && trips.length === 0 && <div className="panel empty-state"><h3>No trips yet</h3><p>Create your first trip to see real dashboard data here.</p><Link to="/trips/new" className="primary-button inline">Create Trip</Link></div>}
      {!loading && trips.length > 0 && <div className="card-grid">{trips.slice(0, 2).map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>}
    </section>
  );
}
