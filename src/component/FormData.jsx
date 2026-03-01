import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebase";
import { ref, get, update} from "firebase/database";

const FormData = () => {
  const [data, setData] = useState({});
  const [editKey, setEditKey] = useState(null);
const [editData, setEditData] = useState({});
const [showConfirm, setShowConfirm] = useState(false);
const [deleteKey, setDeleteKey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, "data"));
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

const confirmDelete = async () => {
  try {
    // 1️⃣ Get latest data from Firebase
    const snapshot = await get(ref(database, "data"));
    if (!snapshot.exists()) return;

    const allData = snapshot.val();

    // 2️⃣ Remove the deleted key locally
    delete allData[deleteKey];

    // 3️⃣ Convert object to array & sort by form number
    const sortedEntries = Object.entries(allData).sort((a, b) => {
      const numA = parseInt(a[0].replace("Form_No_", ""));
      const numB = parseInt(b[0].replace("Form_No_", ""));
      return numA - numB;
    });

    // 4️⃣ Create new object with proper numbering
    const reIndexedData = {};
    sortedEntries.forEach(([, value], index) => {
      const newKey = `Form_No_${index + 1}`;
      reIndexedData[newKey] = value;
    });

    // 5️⃣ Replace entire "data" node
    await update(ref(database), { data: reIndexedData });

    // 6️⃣ Update state
    setData(reIndexedData);

    setShowConfirm(false);
    setDeleteKey(null);

  } catch (error) {
    console.error("Error deleting & reindexing:", error);
  }
};
const handleEdit = (formNo) => {
  setEditKey(formNo);
  setEditData(data[formNo]);
};

const handleChange = (e) => {
  const { name, value } = e.target;

  setEditData((prev) => {
    const updatedData = {
      ...prev,
      [name]: value,
    };

    if (name === "weight" || name === "height") {
      const weight = parseFloat(updatedData.weight);
      const heightCm = parseFloat(updatedData.height);

      if (weight > 0 && heightCm > 0) {
        const heightMeter = heightCm / 100;
        const bmi = weight / (heightMeter * heightMeter);
        updatedData.bmi = bmi.toFixed(2);
      }
    }

    return updatedData;
  });
};

const handleSave = async (formNo) => {
  try {
    await update(ref(database, `data/${formNo}`), editData);

    setData((prev) => ({
      ...prev,
      [formNo]: editData,
    }));

    setEditKey(null);
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

  return (
    <div>
                  {showConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-box">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this record?</p>

      <div className="confirm-buttons">
        <button
          className="cancel-btn"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
        
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Saved Patient Records
      </h2>

      {Object.keys(data).length === 0 ? (
        <p style={{ textAlign: "center" }}>No Data Found</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2e7d32", color: "white" }}>
                <th style={thStyle}>Form No</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>ITS</th>
                <th style={thStyle}>Age</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Blood Pressure</th>
                <th style={thStyle}>Random Sugar</th>
                <th style={thStyle}>Weight</th>
                <th style={thStyle}>Height</th>
                <th style={thStyle}>BMI</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
  {Object.keys(data).map((formNo, index) => (
    <tr key={index} style={{ textAlign: "center" }}>
      <td style={tdStyle}>
        {formNo.replace("Form_No_", "")}
      </td>

      {editKey === formNo ? (
        <>
          <td style={tdStyle}>
            <input name="name" value={editData.name} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="its" value={editData.its} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="age" value={editData.age} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="contact" value={editData.contact} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="bloodPressure" value={editData.bloodPressure} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="randomBloodSugar" value={editData.randomBloodSugar || editData.bloodSugar || ""} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="weight" value={editData.weight} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input name="height" value={editData.height} onChange={handleChange} />
          </td>
          <td style={tdStyle}>
            <input
  name="bmi"
  value={editData.bmi || ""}
  readOnly
/>
          </td>
          <td style={tdStyle}>
            <button
              onClick={() => handleSave(formNo)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </td>
        </>
      ) : (
        <>
          <td style={tdStyle}>{data[formNo].name}</td>
          <td style={tdStyle}>{data[formNo].its}</td>
          <td style={tdStyle}>{data[formNo].age}</td>
          <td style={tdStyle}>{data[formNo].contact}</td>
          <td style={tdStyle}>{data[formNo].bloodPressure}</td>
          <td style={tdStyle}>
            {data[formNo].randomBloodSugar || data[formNo].bloodSugar || ""}
          </td>
          <td style={tdStyle}>{data[formNo].weight}</td>
          <td style={tdStyle}>{data[formNo].height}</td>
          <td style={tdStyle}>{data[formNo].bmi}</td>
          <td style={tdStyle}>
            <button
              onClick={() => handleEdit(formNo)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => {
  setDeleteKey(formNo);
  setShowConfirm(true);
}}
              style={{
                padding: "5px 10px",
                backgroundColor: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #ddd",
};

export default FormData;