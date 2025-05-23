import { useState } from "react";
import api from "../utils/api";
import "./AuthForm.css"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/users/forgot-password", { email });
      setMessage("✅ Password reset email sent (or simulated).");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset request.");
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
