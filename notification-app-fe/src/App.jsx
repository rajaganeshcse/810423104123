import { useState, useEffect } from "react";
import "./App.css";

const BACKEND_URL = "http://localhost:5000";
const FILTERS = ["All", "Placement", "Result", "Event"];

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page });
    if (filter !== "All") params.set("type", filter);
    fetch(`${BACKEND_URL}/notifications?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setNotifications(data.notifications);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter, page]);

  function handleFilterClick(type) {
    setFilter(type);
    setPage(1); 
  }
  return (
    <div>
      <h1>Campus Notifications</h1>

      <div className="filters">
        {FILTERS.map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => handleFilterClick(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <p className="message">Loading...</p>}

      {!loading && error && (
        <p className="message">Failed to load notifications: {error}</p>
      )}

      {!loading && !error && notifications.length === 0 && (
        <p className="message">No notifications found.</p>
      )}

      {!loading &&
        !error &&
        notifications.map((n) => (
          <div className="card" key={n.id}>
            <h3>{n.title}</h3>
            <div className="type">{n.type}</div>
            <p>{n.message}</p>
            <div className="date">{n.created_at}</div>
          </div>
        ))}

      {!loading && !error && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span> Page {page} of {totalPages} </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}



