import { useState } from "react";
import axios from "axios";

function Filter() {
  // Initial values
  const initialItems = {
    rb: "0",
    drb: "0",
    galactic_latitude: "0",
    jd: "0",
    jdstarthist: "0",
  };

  const [input, inputZone] = useState(Object.keys(initialItems));
  const [output, outputZone] = useState([]);
  const [values, setValues] = useState(initialItems);
  const [filterValues, setFilterValues] = useState([]);

  function handleOnDrag(e, key) {
    e.dataTransfer.setData("key", key);
    e.dataTransfer.setData("origin", input.includes(key) ? "input" : "output");
  }

  function handleOnDrop(e, targetZone) {
    e.preventDefault();
    const key = e.dataTransfer.getData("key");
    const origin = e.dataTransfer.getData("origin");

    if (targetZone === "input" && input.length >= 5) return;

    if (origin === "input" && targetZone === "output") {
      inputZone((prev) => prev.filter((item) => item !== key));
      outputZone((prev) => [...prev, key]);
    } else if (origin === "output" && targetZone === "input") {
      outputZone((prev) => prev.filter((item) => item !== key));
      inputZone((prev) => [...prev, key]);
    }
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  async function runFilter() {
    const params = {};
    output.forEach((key) => {
      if (values[key] !== "" && !isNaN(parseFloat(values[key]))) {
        params[key] = parseFloat(values[key]);
      }
    });

    try {
      const response = await axios.get("http://localhost:8000/filter", {
        params,
      });
      setFilterValues(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  }

  function handleValueChange(e, key) {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div
        onDrop={(e) => handleOnDrop(e, "input")}
        onDragOver={allowDrop}
        style={{
          width: "500px",
          height: "600px",
          backgroundColor: "#000000",
          border: "2px solid black",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          color: "white",
        }}
      >
        <h3>Inputs</h3>
        {input.map((key) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleOnDrag(e, key)}
            style={{
              padding: "10px",
              backgroundColor: "#222222",
              border: "1px solid white",
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

      <div
        onDrop={(e) => handleOnDrop(e, "output")}
        onDragOver={allowDrop}
        style={{
          width: "500px",
          height: "600px",
          backgroundColor: "#000000",
          border: "2px solid black",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          color: "white",
        }}
      >
        <h3>Output Filter</h3>
        {output.map((key) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleOnDrag(e, key)}
            style={{
              padding: "10px",
              backgroundColor: "#008000",
              border: "1px solid white",
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

      <div>
        <button onClick={runFilter}>Run</button>
        <h3>Filtered Output:</h3>
        <ul>
          {filterValues.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Filter;
