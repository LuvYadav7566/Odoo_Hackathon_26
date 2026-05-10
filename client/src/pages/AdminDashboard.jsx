import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/axios";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    api.get("/admin/analytics")
      .then((res) => setAnalytics(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load admin analytics"));
  }, [user]);

  if (user?.role !== "ADMIN") {
    return (
      <section className="page-stack">
        <div className="panel empty-state">
          <h3>Admin access required</h3>
          <p>Login with an admin account to view the admin dashboard.</p>
        </div>
      </section>
    );
  }

  const totals = analytics?.totals || { users: 0, trips: 0, activities: 0, sharedTrips: 0 };
  const tripStatus = analytics?.tripStatus || [];
  const popularDestinations = analytics?.popularDestinations || [];

  return (
    <section className="page-stack">
      <div className="page-header">
        <span className="eyebrow">Admin Dashboard</span>
        <h1>Traveloop platform control center.</h1>
        <p>Real analytics for users, trips, activities, shared trips and popular destinations.</p>
      </div>
      {error && <div className="toast error">{error}</div>}
      <div className="stats-grid">
        <StatCard label="Users" value={totals.users} />
        <StatCard label="Trips" value={totals.trips} tone="green" />
        <StatCard label="Activities" value={totals.activities} tone="coral" />
        <StatCard label="Shared trips" value={totals.sharedTrips} tone="violet" />
      </div>
      <div className="chart-grid">
        <article className="panel chart-card">
          <h3>Trips by status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tripStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1f8a70" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <article className="panel chart-card">
          <h3>Popular destinations</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={popularDestinations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="popularity" fill="#3c6e71" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>
      <article className="panel">
        <h3>Admin account</h3>
        <div className="table-row"><span>Name</span><strong>{user.firstName} {user.lastName}</strong></div>
        <div className="table-row"><span>Email</span><strong>{user.email}</strong></div>
        <div className="table-row"><span>Role</span><strong>{user.role}</strong></div>
      </article>
    </section>
  );
}
