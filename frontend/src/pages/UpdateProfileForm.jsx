import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function UpdateProfileForm() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.put("/users/profile", {
        name,
        email,
        password: password || undefined, // Only send password if changed
      });

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSuccess("Profile updated!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleUpdate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password (optional)" type="password" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
