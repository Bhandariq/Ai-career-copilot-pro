export default function Sidebar({history}) {
  return (
    <div className="sidebar">
      <h2>History</h2>
      {history.map((h,i)=>(
        <div key={i} className="history-item">
          {h.question}
        </div>
      ))}
    </div>
  );
}