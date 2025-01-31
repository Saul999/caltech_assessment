const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const astroRoutes = require("./routes/astroRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "caltech", // Ensure the correct database name
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", astroRoutes); // All requests starting with /api are handled by astroRoutes

app.get("/", (req, res) => res.send(`Application is running on port ${PORT}`));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
