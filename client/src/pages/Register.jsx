import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", country: "", password: "" });
  const [error, setError] = useState("");

  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <div className="brand-mark large">T</div>
        <h1>Create your Traveloop</h1>
        {error && <div className="toast error">{error}</div>}
        <div className="form-grid two">
          <label>First name<input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required /></label>
          <label>Last name<input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required /></label>
          <label>Phone<input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label>
          <label>City<input value={form.city} onChange={(e) => update("city", e.target.value)} /></label>
          <label>Country<input value={form.country} onChange={(e) => update("country", e.target.value)} /></label>
        </div>
        <label>Password<input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength="8" /></label>
        <button className="primary-button" disabled={loading}>{loading ? "Creating..." : "Register User"}</button>
        <Link to="/login">Already have an account?</Link>
      </form>
    </section>
  );
}

