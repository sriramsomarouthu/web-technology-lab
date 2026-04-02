import React, { useState, useEffect } from "react";

function DataFetcher() {
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch API using useEffect
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((result) => {
        setData(result.slice(0, 5)); // limit data
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // runs only once

  return (
    <div style={{ width: "500px", margin: "auto" }}>
      <h2>API Data</h2>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error State */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Data Display */}
      {!loading && !error && (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DataFetcher;