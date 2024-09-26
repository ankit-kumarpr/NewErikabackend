require("dotenv").config(); // Load environment variables from .env file
require("./Database/server.js");
const cors = require("cors");
const path = require("path");
const allroutes = require("./routes/all_routes.js");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from 'public' folder
app.use("/logos", express.static(path.join(__dirname, "public")));

// Serve static files from 'uploads' and 'uploadspdf' folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploadspdf", express.static(path.join(__dirname, "uploadspdf")));
app.use(
  "/uploadbillpdf",
  express.static(path.join(__dirname, "uploadbillpdf"))
);

// Load all routes from routes folder
app.use("/erika", allroutes);

// Use port from .env or default to 5000
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server running successfully on port", port);
});
