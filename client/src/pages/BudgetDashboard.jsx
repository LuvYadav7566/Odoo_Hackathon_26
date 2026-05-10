import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/axios";
import PlannerSteps from "../components/PlannerSteps.jsx";
import StatCard from "../components/StatCard.jsx";
import { useActiveTrip } from "../hooks";
import { computeActivityTotal, currency, groupActivitiesByDay, tripDays } from "../utils";

const colors = ["#1f8a70", "#3c6e71", "#f28f3b", "#7b61ff"];

export default function BudgetDashboard() {
  const navigate = useNavigate();
  const { trip, loading, reload } = useActiveTrip();

  const activityTotal = computeActivityTotal(trip);
  const total = activityTotal;

  const data = useMemo(() => {
    const grouped = {};
    (trip?.activities || []).forEach((activity) => {
      const key = `Day ${activity.dayNumber || 1}`;
      grouped[key] = (grouped[key] || 0) + Number(activity.cost || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [trip]);

  const daily = Object.entries(groupActivitiesByDay(trip)).map(([day, items]) => ({
    day: `Day ${day}`,
    expense: items.reduce((sum, item) => sum + Number(item.cost || 0), 0)
  }));

  const save = async () => {
    await api.put(`/budgets/${trip.id}`, { hotels: 0, transport: 0, food: 0, activities: activityTotal, total, currency: "INR" });
    await reload();
    navigate("/notes");
  };

  if (loading) return <section className="page-stack"><div className="panel">Loading budget...</div></section>;

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header"><span className="eyebrow">Step 5</span><h1>Summarize plan with charts and rupee budgets.</h1></div>
      <div className="stats-grid"><StatCard label="Total budget" value={currency(total)} /><StatCard label="Activities" value={currency(activityTotal)} tone="green" /><StatCard label="Days" value={tripDays(trip)} tone="coral" /><StatCard label="Daily average" value={currency(total / tripDays(trip))} tone="violet" /></div>
      <div className="chart-grid">
        <article className="panel chart-card"><h3>Expense breakdown</h3><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data} dataKey="value" innerRadius={55} outerRadius={95}>{data.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}</Pie><Tooltip formatter={(value) => currency(value)} /></PieChart></ResponsiveContainer></article>
        <article className="panel chart-card"><h3>Daily activity expenses</h3><ResponsiveContainer width="100%" height={260}><BarChart data={daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip formatter={(value) => currency(value)} /><Bar dataKey="expense" fill="#1f8a70" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></article>
      </div>
      <button className="primary-button inline" onClick={save}>Save & Next: Notes</button>
    </section>
  );
}
