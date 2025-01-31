import { useState } from "react";

function Filter() {
  // Initial values
  const initialItems = {
    rb: "rb",
    drb: "drb",
    galactic_latitude: "gl",
    jd: "jd",
    jdstarthist: "jdstarthist",
  };

  const [zone1, setZone1] = useState(Object.keys(initialItems)); // Zone 1 starts with 5 boxes
  const [zone2, setZone2] = useState([]); // Zone 2 starts empty
  const [values, setValues] = useState(initialItems); // Shared values between both zones

  // Handle drag start
  function handleOnDrag(e, key) {
    e.dataTransfer.setData("key", key); // Store the dragged item's key
    e.dataTransfer.setData("origin", zone1.includes(key) ? "zone1" : "zone2"); // Track the origin zone
  }

  // Handle drop
  function handleOnDrop(e, targetZone) {
    e.preventDefault();
    const key = e.dataTransfer.getData("key");
    const origin = e.dataTransfer.getData("origin");

    if (targetZone === "zone1" && zone1.length >= 5) return; // Limit Zone 1 to 5 items

    // Move item between zones
    if (origin === "zone1" && targetZone === "zone2") {
      setZone1((prev) => prev.filter((item) => item !== key));
      setZone2((prev) => [...prev, key]);
    } else if (origin === "zone2" && targetZone === "zone1") {
      setZone2((prev) => prev.filter((item) => item !== key));
      setZone1((prev) => [...prev, key]);
    }
  }

  // Allow drop
  function allowDrop(e) {
    e.preventDefault();
  }

  // Handle value change
  function handleValueChange(e, key) {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Zone 1 */}
      <div
        onDrop={(e) => handleOnDrop(e, "zone1")}
        onDragOver={allowDrop}
        style={{
          width: "500px",
          height: "600px",
          backgroundColor: "000000",
          border: "2px solid black",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3>Zone 1</h3>
        {zone1.map((key) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleOnDrag(e, key)}
            style={{
              padding: "10px",
              backgroundColor: "#000000",
              border: "1px solid black",
              cursor: "grab",
            }}
          >
            <strong>{key}:</strong>
            <input
              type="text"
              value={values[key]}
              onChange={(e) => handleValueChange(e, key)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                width: "calc(100% - 20px)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Zone 2 */}
      <div
        onDrop={(e) => handleOnDrop(e, "zone2")}
        onDragOver={allowDrop}
        style={{
          width: "500px",
          height: "600px",
          backgroundColor: "000000",
          border: "2px solid black",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3>Zone 2</h3>
        {zone2.map((key) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleOnDrag(e, key)}
            style={{
              padding: "10px",
              backgroundColor: "#c0e4d0",
              border: "1px solid black",
              cursor: "grab",
            }}
          >
            <strong>{key}:</strong>
            <input
              type="text"
              value={values[key]}
              onChange={(e) => handleValueChange(e, key)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                width: "calc(100% - 10px)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;
