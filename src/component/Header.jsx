import React, { useState } from "react";
import Form from "./form";
import FormData from "./FormData";

const Header = () => {
  const [activePage, setActivePage] = useState("form");
  const [menuOpen, setMenuOpen] = useState(false);

  const buttonStyle = (type) => ({
    padding: "8px 18px",
    marginLeft: "10px",
    backgroundColor: activePage === type ? "#ffffff" : "transparent",
    color: activePage === type ? "#2e7d32" : "white",
    border: "2px solid white",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2e7d32",
          color: "white",
          padding: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "22px",
          fontWeight: "600",
          borderBottom: "4px solid #1b5e20",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <div>SAIFE AMBULANCE PATIENT FORM</div>

        {/* Desktop Buttons */}
        <div className="desktop-menu">
          <button
            style={buttonStyle("form")}
            onClick={() => setActivePage("form")}
          >
            Fill Form
          </button>
          <button
            style={buttonStyle("data")}
            onClick={() => setActivePage("data")}
          >
            View Data
          </button>
        </div>

        {/* Hamburger Icon */}
        <div
          className="mobile-menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ cursor: "pointer", display: "none" }}
        >
          ☰
        </div>
      </div>

      {/* Mobile Slider */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: menuOpen ? 0 : "-220px",
          width: "200px",
          height: "100%",
          backgroundColor: "#1b5e20",
          paddingTop: "80px",
          transition: "0.3s",
          zIndex: 1000,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <button
            style={{
  ...buttonStyle("form"),
  border: "2px solid white",
  marginBottom: "20px",
}}
            onClick={() => {
              setActivePage("form");
              setMenuOpen(false);
            }}
          >
            Fill Form
          </button>

          <br />

          <button
            style={{
  ...buttonStyle("data"),
  border: "2px solid white",
}}
            onClick={() => {
              setActivePage("data");
              setMenuOpen(false);
            }}
          >
            View Data
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div
        style={{
          padding: "30px",
          backgroundColor: "#f4fff4",
          minHeight: "100vh",
        }}
      >
        {activePage === "form" ? <Form /> : <FormData />}
      </div>

      {/* Media Query */}
      <style>
        {`
        
          @media (max-width: 768px) {
            .desktop-menu {
              display: none;
            }
            .mobile-menu-icon {
              display: block !important;
              font-size: 26px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Header;