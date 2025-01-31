import { useState } from "react";

function Box() {
  const [data, setData] = useState({
    rb: 0.5,
    drb: 0.99,
    galactic_latitude: -5,
    jd: 2460318.5,
    jdstarthist: 2460314.5,
  });

  const [draggedKey, setDraggedKey] = useState(null);

  // Handle drag start
  function handleOnDragStart(e, key) {
    e.dataTransfer.setData("text/plain", key);
    setDraggedKey(key); // Keep track of the key being dragged
  }

  // Handle drop
  function handleOnDrop(e) {
    e.preventDefault();
    const key = e.dataTransfer.getData("text/plain");
    alert(`Dropped: ${key} with value ${data[key]}`);
  }

  // Allow drop
  function allowDrop(e) {
    e.preventDefault();
  }

  // Update value when edited
  function handleEdit(key, newValue) {
    setData((prevData) => ({
      ...prevData,
      [key]: parseFloat(newValue) || newValue, // Convert to number if possible
    }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      {/* Draggable boxes */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleOnDragStart(e, key)}
            style={{
              padding: "10px",
              border: "1px solid black",
              backgroundColor: "#f0f0f0",
              cursor: "grab",
              borderRadius: "5px",
            }}
          >
            <strong>{key}:</strong>{" "}
            <input
              type="text"
              value={value}
              onChange={(e) => handleEdit(key, e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                width: "60px",
                textAlign: "center",
              }}
            />
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleOnDrop}
        onDragOver={allowDrop}
        style={{
          width: "200px",
          height: "200px",
          border: "2px dashed black",
          backgroundColor: "#d0f0c0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Drop here
      </div>
    </div>
  );
}

export default Box;
