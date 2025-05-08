import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      alert("Login successful: " + res.data.user.email);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleLogin} style={styles.form}>
      <div style={styles.banner}>Secure Web Scraping</div>
        <h2 style={styles.heading}>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh", // Full viewport height
    backgroundColor: "#79a7b5",
    margin: "auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "40px",
    borderRadius: "10px",
    backgroundColor: "#79a7b5", // decent light blue-gray
    width: "100%",
    maxWidth: "350px",
    boxSizing: "border-box",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
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
