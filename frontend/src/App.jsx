import { useState } from "react";

const API_URLS = [
  "https://api.noelav.space",
  "http://api.noelav.space",
];

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function callBackend() {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/api/message`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "API request failed");
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "80px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>AWS ECS Demo</h1>

      <p>
        React frontend running on ECS and communicating with a Flask backend.
      </p>

      <button onClick={callBackend} disabled={loading}>
        {loading ? "Calling API..." : "Call Backend API"}
      </button>

      {error && (
        <pre
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#ffe5e5",
          }}
        >
          {error}
        </pre>
      )}

      {response && (
        <pre
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#eeeeee",
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </main>
  );
}

export default App;