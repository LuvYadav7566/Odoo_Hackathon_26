import { useMemo } from "react";
import PlannerSteps from "../components/PlannerSteps.jsx";
import { useActiveTrip } from "../hooks";
import { computeActivityTotal, currency, groupActivitiesByDay, tripDays } from "../utils";

export default function BillingInvoice() {
  const { trip, loading } = useActiveTrip();

  const rows = useMemo(() => {
    const activityRows = (trip?.activities || []).map((activity) => ({
      label: `Day ${activity.dayNumber || 1} - ${activity.title}`,
      type: activity.category,
      amount: Number(activity.cost || 0)
    }));
    const budget = trip?.budget || {};
    return [
      { label: "Hotel estimate", type: "HOTELS", amount: Number(budget.hotels || 0) },
      { label: "Transport estimate", type: "TRANSPORT", amount: Number(budget.transport || 0) },
      { label: "Food estimate", type: "FOOD", amount: Number(budget.food || 0) },
      ...activityRows
    ].filter((row) => row.amount > 0);
  }, [trip]);

  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const dayTotals = groupActivitiesByDay(trip);

  if (loading) return <section className="page-stack"><div className="panel">Loading billing...</div></section>;

  return (
    <section className="page-stack">
      <PlannerSteps />
      <div className="page-header row">
        <div><span className="eyebrow">Step 7</span><h1>Billing and expense invoice.</h1><p>{trip?.title} · {trip?.startingPlace} to {trip?.destinationPlace}</p></div>
        <button className="secondary-button" onClick={() => window.print()}>Print Invoice</button>
      </div>
      <article className="panel invoice">
        <div className="invoice-head">
          <div><h2>Traveloop Invoice</h2><p>{new Date().toLocaleDateString()}</p></div>
          <div><strong>Total</strong><h2>{currency(total)}</h2></div>
        </div>
        <div className="invoice-meta">
          <span>Start: {trip?.startingPlace}</span>
          <span>Destination: {trip?.destinationPlace}</span>
          <span>Dates: {new Date(trip?.startDate).toLocaleDateString()} - {new Date(trip?.endDate).toLocaleDateString()}</span>
          <span>Days: {tripDays(trip)}</span>
        </div>
        <div className="invoice-table">
          <div className="invoice-row header"><span>Description</span><span>Type</span><span>Amount</span></div>
          {rows.map((row, index) => <div className="invoice-row" key={index}><span>{row.label}</span><span>{row.type}</span><strong>{currency(row.amount)}</strong></div>)}
        </div>
        <div className="invoice-summary">
          <strong>Activity subtotal: {currency(computeActivityTotal(trip))}</strong>
          <strong>Grand total: {currency(total)}</strong>
        </div>
      </article>
      <div className="panel">
        <h3>Day-wise activity expense</h3>
        {Object.entries(dayTotals).map(([day, items]) => <div className="table-row" key={day}><span>Day {day}</span><strong>{currency(items.reduce((sum, item) => sum + Number(item.cost || 0), 0))}</strong></div>)}
      </div>
    </section>
  );
}
