import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <section className="auth-page">
      <form className="auth-card">
        <div className="brand-mark large">T</div>
        <h1>Reset password</h1>
        <p>This version includes the UI only. Connect email delivery when you enable password reset tokens.</p>
        <label>Email<input type="email" placeholder="you@example.com" /></label>
        <button className="primary-button" type="button">Send reset link</button>
        <Link to="/login">Back to login</Link>
      </form>
    </section>
  );
}

