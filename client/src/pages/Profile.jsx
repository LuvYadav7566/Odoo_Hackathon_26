import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", city: user?.city || "", country: user?.country || "", bio: user?.bio || "", avatarUrl: user?.avatarUrl || "" });
  const update = (key, value) => setForm({ ...form, [key]: value });

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("avatarUrl", reader.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    const res = await api.put("/auth/profile", form);
    setUser(res.data.user);
    localStorage.setItem("traveloop_user", JSON.stringify(res.data.user));
  };

  return (
    <section className="page-stack">
      <div className="page-header"><span className="eyebrow">User profile</span><h1>Keep your traveler identity ready.</h1></div>
      <div className="profile-grid">
        <div className="panel profile-card">
          {form.avatarUrl ? <img className="avatar image" src={form.avatarUrl} alt={form.firstName || "Profile"} /> : <div className="avatar">{form.firstName?.[0]?.toUpperCase() || "T"}</div>}
          <h2>{form.firstName} {form.lastName}</h2>
          <p>{form.email}</p>
        </div>
        <div className="panel form-panel">
          <label>Profile picture<input type="file" accept="image/*" onChange={uploadAvatar} /></label>
          <div className="form-grid two">
            <label>First name<input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} /></label>
            <label>Last name<input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} /></label>
            <label>Email<input value={form.email} disabled /></label>
            <label>City<input value={form.city} onChange={(e) => update("city", e.target.value)} /></label>
          </div>
          <label>Country<input value={form.country} onChange={(e) => update("country", e.target.value)} /></label>
          <label>Bio<textarea rows="4" value={form.bio} onChange={(e) => update("bio", e.target.value)} /></label>
          <button className="primary-button" onClick={save}>Update profile</button>
        </div>
      </div>
    </section>
  );
}
