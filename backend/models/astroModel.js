const mongoose = require("mongoose");

const AstroSchema = new mongoose.Schema({}, { strict: false });

const Astro = mongoose.model("astro", AstroSchema, "astro"); // Collection name should match

module.exports = Astro;
