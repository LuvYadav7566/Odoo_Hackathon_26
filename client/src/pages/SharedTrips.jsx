import { Link, useParams } from "react-router-dom";

export default function SharedTrips() {
  const { publicId } = useParams();
  return (
    <section className="public-page">
      <div className="public-hero">
        <Link to="/" className="brand public"><span className="brand-mark">T</span><span>Traveloop</span></Link>
        <span className="eyebrow">Shared itinerary</span>
        <h1>Japan Spring Loop</h1>
        <p>Public read-only route preview for `{publicId}` with copy support when logged in.</p>
      </div>
      <div className="public-content">
        {["Tokyo", "Kyoto", "Osaka"].map((city, index) => <article className="panel itinerary-day" key={city}><span className="badge">Day {index + 1}</span><h3>{city}</h3><p>Curated activities, cost estimates and city notes appear here.</p></article>)}
      </div>
    </section>
  );
}

