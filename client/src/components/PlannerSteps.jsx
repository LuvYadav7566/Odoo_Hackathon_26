import { NavLink } from "react-router-dom";

const steps = [
  { to: "/trips/new", label: "1 Trip" },
  { to: "/itinerary/builder", label: "2 Stops" },
  { to: "/packing", label: "3 Packing" },
  { to: "/itinerary/view", label: "4 Itinerary" },
  { to: "/budget", label: "5 Summary" },
  { to: "/notes", label: "6 Notes" },
  { to: "/billing", label: "7 Invoice" }
];

export default function PlannerSteps() {
  return (
    <div className="planner-steps">
      {steps.map((step) => (
        <NavLink key={step.to} to={step.to} className={({ isActive }) => isActive ? "active" : ""}>
          {step.label}
        </NavLink>
      ))}
    </div>
  );
}

