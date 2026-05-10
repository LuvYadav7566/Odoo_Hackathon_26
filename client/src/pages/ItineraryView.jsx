import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlannerSteps from "../components/PlannerSteps.jsx";
import { useActiveTrip } from "../hooks";
import { currency, groupActivitiesByDay, tripDays } from "../utils";

export default function ItineraryView() {
  const navigate = useNavigate();
  const { trip, loading } = useActiveTrip();
  const [mode, setMode] = useState("list");
  const days = groupActivitiesByDay(trip);

  if (loading) return <section className="page-stack"><div className="panel">Loading itinerary...</div></section>;

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header row">
        <div><span className="eyebrow">Step 4</span><h1>Day-wise itinerary with expenses.</h1><p>{trip?.startingPlace} to {trip?.destinationPlace}</p></div>
        <div className="segmented"><button className={mode === "list" ? "active" : ""} onClick={() => setMode("list")}>List</button><button className={mode === "calendar" ? "active" : ""} onClick={() => setMode("calendar")}>Calendar</button></div>
      </div>
      <div className={`itinerary-budget-view ${mode}`}>
        {Array.from({ length: tripDays(trip) }, (_, i) => i + 1).map((day) => {
          const items = days[day] || [];
          const total = items.reduce((sum, item) => sum + Number(item.cost || 0), 0);
          return (
            <article className="panel itinerary-budget-day" key={day}>
              <div className="day-pill">Day {day}</div>
              <div className="itinerary-budget-table">
                <div className="itinerary-budget-heading">
                  <span>Activity</span>
                  <span>Expense</span>
                </div>
                {items.length === 0 && (
                  <div className="itinerary-budget-row">
                    <span>No activity planned</span>
                    <strong>{currency(0)}</strong>
                  </div>
                )}
                {items.map((item) => (
                  <div className="itinerary-budget-row" key={item.id}>
                    <span>{item.title}</span>
                    <strong>{currency(item.cost)}</strong>
                  </div>
                ))}
                <div className="itinerary-budget-total">
                  <span>Total Day {day}</span>
                  <strong>{currency(total)}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <button className="primary-button inline" onClick={() => navigate("/budget")}>Save & Next: Summary</button>
    </section>
  );
}
