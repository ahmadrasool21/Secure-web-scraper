import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/home", {
          withCredentials: true,
        });
        setUserEmail(res.data.user.email);
        setLoading(false);
      } catch (err) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true
      });
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/scrape",
        { url },
        { withCredentials: true }
      );

      alert(`Download: ${res.data.file}\nPassword: ${res.data.password}`);
      window.location.href = `http://localhost:5000/files/${res.data.file}`;
    } catch (err) {
      alert(err.response?.data?.msg || "Scraping failed");
    }
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
      
        <h2 style={styles.banner}>Welcome</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to scrape"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Scrape</button>

          {/* Moved Logout Button to bottom of form */}
          <button
            type="button"
            onClick={handleLogout}
            style={{ ...styles.button, ...styles.logoutButton }}
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "70vh",
    backgroundColor: "#79a7b5",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  content: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
    textAlign: "center",
  },
  form: {
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  },
  logoutButton: {
    backgroundColor: "#dc3545", // red logout button
  },
  loading: {
    fontSize: "18px",
    textAlign: "center",
    paddingTop: "100px",
    color: "#555",
  },

  banner: {
    width: "100%",
    padding: "20px",
    background: "linear-gradient(90deg, #006494, #00a6fb)",
    color: "#fff",
    fontSize: "26px",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    marginBottom: "30px",
    borderRadius: "8px",
    letterSpacing: "1px",
  },
};
