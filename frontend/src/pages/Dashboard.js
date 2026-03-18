import { useState } from "react";
import { chat } from "../api";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const token = localStorage.getItem("token");

  const sendMessage = async (msg) => {
    const data = await chat(msg, token);

    setChatHistory([
      ...chatHistory,
      { type: "user", text: msg },
      { type: "ai", text: data.response },
    ]);
  };

  return (
    <div className="dashboard">
      <Sidebar history={chatHistory.filter(msg => msg.type === "user").map(msg => ({ question: msg.text }))} />
      <div className="chat-area">
        <h2>AI Career Copilot</h2>
        <div className="messages">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`message ${msg.type}`}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <ChatBox send={sendMessage} />
      </div>
    </div>
  );
}

export default Dashboard;