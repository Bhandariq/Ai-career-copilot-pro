import { useState } from "react";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const token = localStorage.getItem("token");

  const sendMessage = async () => {
    if (!message) return;

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat([
      ...chat,
      { type: "user", text: message },
      { type: "ai", text: data.response },
    ]);

    setMessage("");
  };

  return (
    <div style={{ color: "white", padding: "20px" }}>
      
      {/* 🔥 Logout */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      <h1 style={{ textAlign: "center" }}>🤖 AI Career Chat</h1>

      {/* Chat Box */}
      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          background: "#111",
          padding: "20px",
          borderRadius: "10px",
          height: "400px",
          overflowY: "auto",
        }}
      >
        {chat.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <strong>{msg.type === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ textAlign: "center" }}>
        <input
          style={{ width: "60%", padding: "10px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Dashboard;