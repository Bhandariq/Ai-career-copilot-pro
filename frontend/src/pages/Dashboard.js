import { useState } from "react";
import { chat } from "../api";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const token = localStorage.getItem("token");

  const sendMessage = async () => {
    const data = await chat(message, token);

    setChatHistory([
      ...chatHistory,
      { type: "user", text: message },
      { type: "ai", text: data.response },
    ]);
  };

  return (
    <div>
      <h2>Chat</h2>

      {chatHistory.map((msg, i) => (
        <p key={i}>{msg.text}</p>
      ))}

      <input onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Dashboard;