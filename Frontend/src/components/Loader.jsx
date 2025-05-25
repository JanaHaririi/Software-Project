const Loader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
    <div style={{
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #0077ff",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite"
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default Loader;