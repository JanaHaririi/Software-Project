import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import React from 'react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1 className="title">🎟️ Welcome to EventHub</h1>
      <div className="button-group">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={()=> navigate("/admin")}>temporary admin dashboard button</button>
      </div>
    </div>
  );
}
