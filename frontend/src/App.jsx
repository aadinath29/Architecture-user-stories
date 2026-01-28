import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const onResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);



  useEffect(() => {
    console.log("summary: ",summary);
    
  
  }, [summary])
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Image and prompt are required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      setError("");
      setSummary("");

      const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/a/image-summary`,
  formData,
  {
    headers: { "Content-Type": "multipart/form-data" },
  }
);


      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setError("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #0f0f1a, #1c1c2e)",
      padding: "32px",
      boxSizing: "border-box",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#ffffff",
    }}
  >
    {/* Page Container */}
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#141428",
          padding: "24px 28px",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "30px", color: "#a9b1ff" }}>
          Architecture Diagram → User Stories
        </h1>
        <p style={{ marginTop: "8px", color: "#b5b5d6", fontSize: "15px" }}>
          Upload an integration architecture diagram to generate enterprise-grade
          Salesforce integration user stories.
        </p>
      </div>

      {/* Main Layout */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "minmax(280px, 380px) minmax(0, 1fr)",
    gap: "24px",
    width: "100%",
    alignItems: "stretch",
  }}
>

        {/* Upload Panel */}
        <div
          style={{
            background: "#1a1a2e",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h3 style={{ margin: 0, color: "#9fa8ff" }}>
            Upload Diagram
          </h3>

          {/* Custom File Input */}
          <label
            style={{
              width: "90%",
              padding: "16px",
              background: "#232344",
              border: "2px dashed #3a3a6a",
              borderRadius: "12px",
              cursor: "pointer",
              textAlign: "center",
              color: image ? "#ffffff" : "#9a9abf",
              fontSize: "14px",
            }}
          >
            {image ? image.name : "Click to select an image file"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#555" : "#6c63ff",
              border: "none",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing…" : "Generate User Stories"}
          </button>

          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "14px" }}>
              {error}
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div
          style={{
            background: "#1a1a2e",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            minHeight: "420px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginBottom: "12px", color: "#9fa8ff" }}>
            Generated Output
          </h3>

          {!summary && (
            <div
              style={{
                color: "#8a8ab5",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Generated user stories will appear here after processing the diagram.
            </div>
          )}

          {summary && (
            <pre
              style={{
                marginTop: "8px",
                flex: 1,
                whiteSpace: "pre-wrap",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#e6e6ff",
                background: "#232344",
                padding: "18px",
                borderRadius: "12px",
                border: "1px solid #3a3a6a",
                overflowY: "auto",
                fontFamily: "Menlo, Consolas, monospace",
              }}
            >
              {summary}
            </pre>
          )}
        </div>
      </div>
    </div>
  </div>
);

}

export default App;
