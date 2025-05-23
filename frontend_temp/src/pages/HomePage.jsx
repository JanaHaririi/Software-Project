import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1 className="title">🎟️ Welcome to EventHub</h1>
      <div className="button-group">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}
