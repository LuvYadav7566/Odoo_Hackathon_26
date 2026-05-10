import { useEffect, useState } from "react";
import api from "../api/axios";
import { destinations as fallback } from "../data";

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const [costLevel, setCostLevel] = useState("");
  const [destinations, setDestinations] = useState(fallback);

  useEffect(() => {
    api.get("/cities", { params: { q: query, costLevel } }).then((res) => setDestinations(res.data.destinations)).catch(() => {});
  }, [query, costLevel]);

  return (
    <section className="page-stack">
      <div className="page-header"><span className="eyebrow">City search</span><h1>Find destinations for your loop.</h1></div>
      <div className="toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by city or country" /><select value={costLevel} onChange={(e) => setCostLevel(e.target.value)}><option value="">All costs</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></div>
      <div className="destination-grid">
        {destinations.map((item) => (
          <article className="destination-result" key={item.city}>
            <img src={item.image} alt={item.city} />
            <div><h3>{item.city}</h3><p>{item.country}</p><span>Popularity {item.popularity} · {item.costLevel}</span></div>
            <button className="secondary-button">Add city</button>
          </article>
        ))}
      </div>
    </section>
  );
}

