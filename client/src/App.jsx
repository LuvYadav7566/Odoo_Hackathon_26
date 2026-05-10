import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import ItineraryBuilder from "./pages/ItineraryBuilder.jsx";
import ItineraryView from "./pages/ItineraryView.jsx";
import CitySearch from "./pages/CitySearch.jsx";
import ActivitySearch from "./pages/ActivitySearch.jsx";
import BudgetDashboard from "./pages/BudgetDashboard.jsx";
import PackingChecklist from "./pages/PackingChecklist.jsx";
import NotesJournal from "./pages/NotesJournal.jsx";
import SharedTrips from "./pages/SharedTrips.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BillingInvoice from "./pages/BillingInvoice.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/shared/:publicId" element={<SharedTrips />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/itinerary/builder" element={<ItineraryBuilder />} />
          <Route path="/itinerary/view" element={<ItineraryView />} />
          <Route path="/cities" element={<CitySearch />} />
          <Route path="/activities" element={<ActivitySearch />} />
          <Route path="/budget" element={<BudgetDashboard />} />
          <Route path="/packing" element={<PackingChecklist />} />
          <Route path="/notes" element={<NotesJournal />} />
          <Route path="/billing" element={<BillingInvoice />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
