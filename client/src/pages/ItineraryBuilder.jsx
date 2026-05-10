import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PlannerSteps from "../components/PlannerSteps.jsx";
import { useActiveTrip } from "../hooks";
import { currency, groupActivitiesByDay, tripDays } from "../utils";

const blankStop = { city: "", arrivalDate: "", departDate: "" };
const blankActivity = { dayNumber: 1, title: "", category: "SIGHTSEEING", duration: 0, cost: 0 };

export default function ItineraryBuilder() {
  const navigate = useNavigate();
  const { trip, loading, error, reload } = useActiveTrip();
  const [stopForm, setStopForm] = useState(blankStop);
  const [activityForm, setActivityForm] = useState(blankActivity);
  const [message, setMessage] = useState("");
  const dayActivities = groupActivitiesByDay(trip);

  const addStop = async (event) => {
    event.preventDefault();
    if (!trip) return navigate("/trips/new");
    await api.post("/stops", {
      city: stopForm.city,
      country: "India",
      arrivalDate: stopForm.arrivalDate,
      departDate: stopForm.departDate,
      notes: "",
      tripId: trip.id,
      order: (trip.stops?.length || 0) + 1
    });
    setStopForm(blankStop);
    reload();
  };

  const addActivity = async (event) => {
    event.preventDefault();
    if (!trip) return navigate("/trips/new");
    await api.post("/activities", { ...activityForm, tripId: trip.id, cost: Number(activityForm.cost), duration: Number(activityForm.duration), dayNumber: Number(activityForm.dayNumber) });
    setActivityForm(blankActivity);
    setMessage("");
    reload();
  };

  const removeStop = async (id) => {
    await api.delete(`/stops/${id}`);
    reload();
  };

  if (loading) return <section className="page-stack"><div className="panel">Loading active trip...</div></section>;

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header">
        <span className="eyebrow">Step 2</span>
        <h1>Stops and day-wise activity budgets.</h1>
        <p>{trip ? `${trip.title}: ${trip.startingPlace} to ${trip.destinationPlace}` : "Create a trip first to unlock stops."}</p>
      </div>
      {(error || message) && <div className="toast error">{error || message}</div>}

      <form className="panel form-panel" onSubmit={addStop}>
        <h2>Add Stop / City</h2>
        <div className="form-grid three">
          <label>City<input value={stopForm.city} onChange={(e) => setStopForm({ ...stopForm, city: e.target.value })} required /></label>
          <label>Starting date<input type="date" value={stopForm.arrivalDate} min={trip?.startDate?.slice(0, 10)} max={trip?.endDate?.slice(0, 10)} onChange={(e) => setStopForm({ ...stopForm, arrivalDate: e.target.value })} required /></label>
          <label>Ending date<input type="date" value={stopForm.departDate} min={stopForm.arrivalDate || trip?.startDate?.slice(0, 10)} max={trip?.endDate?.slice(0, 10)} onChange={(e) => setStopForm({ ...stopForm, departDate: e.target.value })} required /></label>
        </div>
        <button className="primary-button inline"><Plus size={18} /> Save Stop</button>
      </form>

      <form className="panel form-panel" onSubmit={addActivity}>
        <h2>Add Activity with Budget</h2>
        <div className="form-grid three">
          <label>Trip day<select value={activityForm.dayNumber} onChange={(e) => setActivityForm({ ...activityForm, dayNumber: e.target.value })}>{Array.from({ length: tripDays(trip) }, (_, i) => <option key={i + 1} value={i + 1}>Day {i + 1}</option>)}</select></label>
          <label>Activity<input value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} placeholder="Dinner, hotel, cab, museum" required /></label>
          <label>Budget in rupees<input type="number" min="0" value={activityForm.cost} onChange={(e) => setActivityForm({ ...activityForm, cost: e.target.value })} /></label>
        </div>
        <button className="primary-button inline"><Plus size={18} /> Save Activity</button>
      </form>

      <div className="timeline-builder">
        {trip?.stops?.map((stop, index) => (
          <article className="timeline-stop" key={stop.id}>
            <div className="timeline-dot">{index + 1}</div>
            <div className="panel">
              <div className="stop-header"><h3>{stop.city}, {stop.country}</h3><button className="icon-button light" onClick={() => removeStop(stop.id)} title="Remove stop"><Trash2 size={16} /></button></div>
              <p>Saved as a trip stop. Day-wise activities are separate below.</p>
            </div>
          </article>
        ))}
      </div>

      <div className="panel form-panel">
        <h2>Day-wise Activities</h2>
        <div className="day-activity-list">
          {Array.from({ length: tripDays(trip) }, (_, i) => i + 1).map((day) => {
            const items = dayActivities[day] || [];
            const total = items.reduce((sum, item) => sum + Number(item.cost || 0), 0);
            return (
              <article className="day-activity-card" key={day}>
                <div className="day-activity-head">
                  <span className="day-pill">Day {day}</span>
                  <strong>{currency(total)}</strong>
                </div>
                {items.length === 0 && <p>No activity added for this day.</p>}
                {items.map((activity) => (
                  <div className="day-activity-row" key={activity.id}>
                    <span>{activity.title}</span>
                    <strong>{currency(activity.cost)}</strong>
                  </div>
                ))}
              </article>
            );
          })}
        </div>
      </div>

      <button className="primary-button inline" onClick={() => navigate("/packing")}>Save & Next: Packing</button>
    </section>
  );
}
