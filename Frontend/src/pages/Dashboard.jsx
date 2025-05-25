import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, textAlign: "center", padding: "2rem" }}>
        <h2>Welcome to Your Dashboard</h2>
        <p>This is your dashboard. Use the navigation bar to explore your bookings or events.</p>
      </div>
      <Footer />
    </div>
  );
}