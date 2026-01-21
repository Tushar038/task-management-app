function Toast({ message, type }) {
    if (!message) return null;
  
    return (
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: type === "error" ? "#ef4444" : "#22c55e",
          color: "white",
          padding: "12px 18px",
          borderRadius: "6px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        {message}
      </div>
    );
  }
  
  export default Toast;
  