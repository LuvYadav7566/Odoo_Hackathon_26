import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PlannerSteps from "../components/PlannerSteps.jsx";
import { useActiveTrip } from "../hooks";

export default function NotesJournal() {
  const navigate = useNavigate();
  const { trip, loading, reload } = useActiveTrip();
  const [form, setForm] = useState({ title: "", content: "", day: "" });

  const add = async () => {
    if (!trip || !form.title || !form.content) return;
    await api.post("/notes", { tripId: trip.id, ...form, day: form.day || undefined });
    setForm({ title: "", content: "", day: "" });
    reload();
  };

  const remove = async (id) => {
    await api.delete(`/notes/${id}`);
    reload();
  };

  if (loading) return <section className="page-stack"><div className="panel">Loading notes...</div></section>;

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header"><span className="eyebrow">Step 6</span><h1>Trip notes and reminders.</h1></div>
      <div className="panel form-panel">
        <div className="form-grid two">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Reminder date<input type="date" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} /></label>
        </div>
        <label>Note<textarea rows="4" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
        <button className="primary-button inline" onClick={add}>Save Note</button>
      </div>
      <div className="list-panel">
        {(trip?.notes || []).map((note) => (
          <article className="note-card" key={note.id}>
            <div><h3>{note.title}</h3><p>{note.content}</p><small>{new Date(note.createdAt).toLocaleString()}</small></div>
            <button className="danger-button" onClick={() => remove(note.id)}>Delete</button>
          </article>
        ))}
      </div>
      <button className="primary-button inline" onClick={() => navigate("/billing")}>Save & Next: Billing</button>
    </section>
  );
}

