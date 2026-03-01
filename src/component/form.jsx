import React, { useState } from "react";
import "./style.css";

import { database } from "../firebase/firebase"
import { ref, get, set } from "firebase/database";

/* ================= Component ================= */

const MedicalForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    its: "",
    age: "",
    contact: "",
    bloodPressure: "",
    randomBloodSugar: "",
    weight: "",
    height: "",
    bmi: ""
  });

  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  /* ================= Handle Change ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto calculate BMI
    if (name === "weight" || name === "height") {
      const weight = name === "weight" ? value : formData.weight;
      const height = name === "height" ? value : formData.height;

      if (weight && height) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        updatedData.bmi = bmi;
      }
    }

    setFormData(updatedData);
  };

  /* ================= Handle Submit ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ITS validation
    if (!/^\d{8}$/.test(formData.its)) {
      setAlertMsg("ITS number must be exactly 8 digits!");
setAlertType("error");
return;
    }

    try {
      const dataRef = ref(database, "data");
      const snapshot = await get(dataRef);

      let nextFormNumber = 1;

      if (snapshot.exists()) {
        const existingData = snapshot.val();
        nextFormNumber = Object.keys(existingData).length + 1;
      }

      const newFormRef = ref(database, `data/Form_No_${nextFormNumber}`);

      await set(newFormRef, formData);

      setAlertMsg(`Form No.${nextFormNumber} Submitted Successfully ✅`);
setAlertType("success");

      // Reset form after submit
      setFormData({
        name: "",
        its: "",
        age: "",
        contact: "",
        bloodPressure: "",
        randomBloodSugar: "",
        weight: "",
        height: "",
        bmi: ""
      });

    } catch (error) {
      console.error("Error saving data:", error);
      setAlertMsg("Error saving data ❌");
setAlertType("error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="form-container">
      <div className="form-card">
  <h2 className="form-title">MUMINEEN HEALTH SCREENING</h2>

  {alertMsg && (
    <div className={`custom-alert ${alertType}`}>
      {alertMsg}
      <span onClick={() => setAlertMsg("")} className="close-btn">×</span>
    </div>
  )}

  <form onSubmit={handleSubmit} className="medical-form">
            

          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="its"
              placeholder="ITS (8 digits)"
              value={formData.its}
              onChange={handleChange}
              pattern="\d{8}"
              maxLength="8"
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />

            <input
  type="text"
  name="contact"
  placeholder="+91XXXXXXXXXX"
  value={formData.contact || "+91"}
  onChange={(e) => {
    let value = e.target.value;

    // Ensure +91 always stays
    if (!value.startsWith("+91")) {
      value = "+91";
    }

    // Allow only 10 digits after +91
    const digits = value.slice(3).replace(/\D/g, "").slice(0, 10);
    setFormData({
      ...formData,
      contact: "+91" + digits,
    });
  }}
  required
/>
          </div>

          <div className="form-row">
            <input
              type="text"
              name="bloodPressure"
              placeholder="Blood Pressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="randomBloodSugar"
              placeholder="Random Blood Sugar"
              value={formData.randomBloodSugar}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="bmi"
              placeholder="BMI"
              value={formData.bmi}
              readOnly
              className="bmi-field"
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>

        </form>
      </div>
    </div>
  );
};

export default MedicalForm;