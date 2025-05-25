import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const user = await login(email, password); // 👈 make sure login() returns user object

    // Redirect based on user role
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "organizer") navigate("/my-events");
    else navigate("/profile"); 

  } catch (err) {
    setError(err.response?.data?.message || "Login failed.");
  }
};

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        Forgot your password?{" "}
        <Link to="/forgot-password" style={{ color: "#0077ff" }}>
          Reset here
        </Link>
      </p>
    </div>
  );
}
