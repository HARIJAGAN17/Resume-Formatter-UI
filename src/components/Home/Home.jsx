import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/resume");
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Animated UST Logo */}
        <div className="logo-box">
          <div className="logo-grid">
            <span className="letter">U</span>
            <span className="dot" />
            <span className="letter">S</span>
            <span className="letter">T</span>
          </div>
        </div>

        <h1 className="main-heading">AI Resume Converter</h1>
        <p className="typing-animation">
          Transform your resume into the UST Standard Template
        </p>
        <p className="home-description">
          This AI-powered tool reads your resume and formats it into the official UST resume style — ready for instant export.
        </p>
        <button className="home-btn" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}

export default Home;
