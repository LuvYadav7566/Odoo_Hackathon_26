import { useMemo, useState } from "react";
import { activities } from "../data";
import { currency } from "../utils";

export default function ActivitySearch() {
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState(80);
  const results = useMemo(() => activities.filter((item) => (!category || item.category === category) && item.cost <= budget), [category, budget]);
  return (
    <section className="page-stack">
      <div className="page-header"><span className="eyebrow">Activity search</span><h1>Browse activities by category, budget and duration.</h1></div>
      <div className="toolbar"><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option><option>CULTURE</option><option>FOOD</option><option>ADVENTURE</option><option>SIGHTSEEING</option></select><label className="range-label">Budget {currency(budget)}<input type="range" min="0" max="10000" step="500" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label></div>
      <div className="list-panel">
        {results.map((item) => (
          <article className="list-row" key={item.title}>
            <div><h3>{item.title}</h3><p>{item.category} · {item.duration} min · {currency(item.cost)}</p></div>
            <button className="secondary-button">Add activity</button>
          </article>
        ))}
      </div>
    </section>
  );
}
