import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PlannerSteps from "../components/PlannerSteps.jsx";
import { setActiveTripId } from "../utils";

const defaultCoverImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", startingPlace: "", destinationPlace: "", startDate: "", endDate: "", description: "", coverImage: "" });
  const [message, setMessage] = useState("");

  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/trips", { ...form, coverImage: form.coverImage.trim() || defaultCoverImage });
      setActiveTripId(res.data.trip.id);
      navigate("/itinerary/builder");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save trip");
    }
  };

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header"><span className="eyebrow">Step 1</span><h1>Create a planned trip with real route details.</h1><p>Save the trip first. Then Traveloop will use this trip for stops, packing, notes and invoice.</p></div>
      <form className="panel form-panel" onSubmit={submit}>
        {message && <div className="toast error">{message}</div>}
        <label>Trip title<input value={form.title} onChange={(e) => update("title", e.target.value)} required /></label>
        <div className="form-grid two">
          <label>Starting place<input value={form.startingPlace} onChange={(e) => update("startingPlace", e.target.value)} placeholder="Ahmedabad" required /></label>
          <label>Destination place<input value={form.destinationPlace} onChange={(e) => update("destinationPlace", e.target.value)} placeholder="Goa / Dubai / Japan" required /></label>
        </div>
        <div className="form-grid two">
          <label>Start date<input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} required /></label>
          <label>End date<input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} required /></label>
        </div>
        <label>Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows="5" /></label>
        <label>Cover image URL<input value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} placeholder="https://..." /></label>
        <button className="primary-button">Save & Next: Stops</button>
      </form>
    </section>
  );
}
