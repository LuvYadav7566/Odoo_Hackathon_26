import { Calendar, IndianRupee, ListChecks, MapPin, Route } from "lucide-react";
import { currency } from "../utils";

export default function TripCard({ trip, onDelete, onOpen, onEdit, onComplete, onActivate }) {
  const stops = trip.stops?.length || 0;
  const activities = trip.activities?.length || 0;
  const totalBudget = Number(trip.budget?.total || 0);

  return (
    <article className="trip-card">
      <div className="trip-cover" style={{ backgroundImage: `url(${trip.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"})` }} />
      <div className="trip-card-body">
        <span className="badge">{trip.status || "PLANNING"}</span>
        <h3>{trip.title}</h3>
        <p>{trip.description || "A personalized travel loop with city stops, activities and budget planning."}</p>
        <div className="meta-row">
          <span><MapPin size={15} /> {trip.startingPlace || "Start"} to {trip.destinationPlace || "Destination"}</span>
          <span><Calendar size={15} /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          <span><Route size={15} /> {stops} stops</span>
          <span><ListChecks size={15} /> {activities} activities</span>
          <span><IndianRupee size={15} /> {currency(totalBudget)}</span>
        </div>
        <div className="actions">
          {onOpen && <button className="secondary-button" onClick={onOpen}>View</button>}
          {onEdit && <button className="secondary-button" onClick={onEdit}>Plan</button>}
          {onComplete && <button className="secondary-button" onClick={onComplete}>Mark Completed</button>}
          {onActivate && <button className="secondary-button" onClick={onActivate}>Make Active</button>}
          {onDelete && <button className="danger-button" onClick={() => onDelete(trip.id)}>Delete</button>}
        </div>
      </div>
    </article>
  );
}
