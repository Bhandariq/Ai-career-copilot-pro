import { useState } from "react";

export default function ChatBox({send}) {
  const [msg,setMsg]=useState("");

  return (
    <div className="input-box">
      <input value={msg} onChange={e=>setMsg(e.target.value)}/>
      <button onClick={()=>{send(msg); setMsg("")}}>Send</button>
    </div>
  );
}