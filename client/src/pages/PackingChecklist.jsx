import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PlannerSteps from "../components/PlannerSteps.jsx";
import { useActiveTrip } from "../hooks";

export default function PackingChecklist() {
  const navigate = useNavigate();
  const { trip, loading, reload } = useActiveTrip();
  const [form, setForm] = useState({ name: "", category: "ESSENTIALS" });

  const add = async () => {
    if (!trip || !form.name.trim()) return;
    await api.post("/packing", { tripId: trip.id, name: form.name, category: form.category });
    setForm({ name: "", category: "ESSENTIALS" });
    reload();
  };

  const toggle = async (item) => {
    await api.put(`/packing/${item.id}`, { packed: !item.packed });
    reload();
  };

  const remove = async (id) => {
    await api.delete(`/packing/${id}`);
    reload();
  };

  if (loading) return <section className="page-stack"><div className="panel">Loading packing list...</div></section>;

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header"><span className="eyebrow">Step 3</span><h1>Packing for {trip?.destinationPlace || "your destination"}.</h1></div>
      <div className="toolbar">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Add item" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>CLOTHING</option><option>ELECTRONICS</option><option>DOCUMENTS</option><option>ESSENTIALS</option></select>
        <button className="primary-button" onClick={add}>Save Item</button>
      </div>
      <div className="list-panel">
        {(trip?.packingItems || []).map((item) => (
          <label className="check-row" key={item.id}>
            <input type="checkbox" checked={item.packed} onChange={() => toggle(item)} />
            <span className={item.packed ? "done" : ""}>{item.name}</span>
            <small>{item.category}</small>
            <button type="button" className="danger-button" onClick={() => remove(item.id)}>Delete</button>
          </label>
        ))}
      </div>
      <button className="primary-button inline" onClick={() => navigate("/itinerary/view")}>Save & Next: Itinerary</button>
    </section>
  );
}

