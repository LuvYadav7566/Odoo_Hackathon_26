import { Link, NavLink } from "react-router-dom";
import { BarChart3, BookOpen, CalendarDays, CheckSquare, Compass, FileText, Home, LogOut, Map, MapPinned, PlusCircle, Search, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/trips/new", label: "Create Trip", icon: PlusCircle },
  { to: "/trips", label: "My Trips", icon: Map },
  { to: "/itinerary/builder", label: "Builder", icon: CalendarDays },
  { to: "/itinerary/view", label: "Itinerary", icon: MapPinned },
  { to: "/cities", label: "Cities", icon: Search },
  { to: "/activities", label: "Activities", icon: Compass },
  { to: "/budget", label: "Budget", icon: BarChart3 },
  { to: "/packing", label: "Packing", icon: CheckSquare },
  { to: "/notes", label: "Notes", icon: BookOpen },
  { to: "/billing", label: "Billing", icon: FileText },
  { to: "/profile", label: "Profile", icon: User }
];

const adminLinks = [
  { to: "/admin", label: "Admin Dashboard", icon: ShieldCheck }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-mark">T</span>
        <span>Traveloop</span>
      </Link>
      <nav>
        {[...links, ...(user?.role === "ADMIN" ? adminLinks : [])].map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="sidebar-profile">
          {user?.avatarUrl ? (
            <img className="sidebar-avatar" src={user.avatarUrl} alt={user.firstName || "Profile"} />
          ) : (
            <span className="sidebar-avatar letter">{user?.firstName?.[0]?.toUpperCase() || "T"}</span>
          )}
          <div>
            <strong>{user?.firstName || "Traveler"}</strong>
            <small>{user?.email}</small>
          </div>
        </div>
        <button className="icon-button" onClick={logout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
