const express = require("express");
const Astro = require("../models/astroModels");

const router = express.Router();

// Fetch all documents from the "astro" collection
router.get("/astro", async (req, res) => {
  try {
    const data = await Astro.find(); // Get all documents from the "astro" collection
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data from MongoDB" });
  }
});

module.exports = router;
