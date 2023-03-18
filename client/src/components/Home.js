import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidNumber = /^\d{10}$/.test(username);
    if (!isValidNumber) {
      setError("Use your Student ID please");
      return;
    }
    localStorage.setItem("_username", username);
    navigate("/app");
  };

  return (
    <div
      className="home"
      style={{
        backgroundImage:
          "url('https://cdn2.vectorstock.com/i/1000x1000/32/26/light-white-gray-texture-background-digital-vector-28503226.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <img src="https://1.bp.blogspot.com/-bex5btIUMbo/WWXXMzphVKI/AAAAAAABFgQ/XzAFKizj2QAITnlkSp3yBppXpU0moUNygCLcBGAs/s400/shimekiri_report_businessman.png" alt="Kjhou Seifuku" />
      <h2 className="home__title">240-311 Assignment Todo List</h2>
      <form onSubmit={handleSubmit} className="home__form">
        <label htmlFor="username">Enter Your Student Number</label>
        <input
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          maxLength={10}
          type="number"
        />
        <button>SIGN IN</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Home;
