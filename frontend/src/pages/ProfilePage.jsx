import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./ProfilePage.css"; // Add your CSS here

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.put("/users/profile", {
        name,
        email,
        ...(password && { password }),
      });

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("✅ Profile updated successfully.");
      setEditing(false);
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Update failed.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src="https://i.pinimg.com/564x/4d/60/47/4d60476a60ae0aaeb9240d499fcdac2c.jpg"
          alt="Profile"
          className="profile-avatar"
        />

        {!editing ? (
          <>
            <h2>{name}</h2>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Role:</strong> {currentUser?.role || "User"}</p>

            <button className="edit-btn" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="form-buttons">
              <button type="submit">💾 Save</button>
              <button type="button" onClick={() => setEditing(false)}>❌ Cancel</button>
            </div>
          </form>
        )}

        {message && (
          <p className="profile-message" style={{ color: message.startsWith("✅") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
