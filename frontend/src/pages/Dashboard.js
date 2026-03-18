import { useEffect, useState } from "react";
import { chat, getHistory } from "../api";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import ChartBox from "../components/ChartBox";

export default function Dashboard() {
  const [messages,setMessages]=useState([]);
  const [history,setHistory]=useState([]);
  const token=localStorage.getItem("token");

  useEffect(()=>{
    loadHistory();
  },[]);

  const loadHistory=async()=>{
    const res=await getHistory(token);
    setHistory(res.data);
  };

  const send=async(msg)=>{
    const res=await chat(msg,token);

    setMessages(prev=>[
      ...prev,
      {q:msg,a:res.data.response}
    ]);

    loadHistory();
  };

  return (
    <div className="app">

      <Sidebar history={history}/>

      <div className="main">

        <div className="chat-container">
          {messages.map((m,i)=>(
            <div key={i} className="msg">
              <div className="user">You: {m.q}</div>
              <div className="ai">AI: {m.a}</div>
            </div>
          ))}
        </div>

        <ChartBox data={history.map((h,i)=>({name:i,value:h.question.length}))}/>

        <ChatBox send={send}/>
      </div>
    </div>
  );
}