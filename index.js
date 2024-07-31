require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const upload_router = require("./router/upload_router");
const fetch_router = require("./router/fetch_router");

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error("DB Error:" + err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/upload", upload_router);
app.use("/fetch", fetch_router);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views/index.html")));
app.get("/gallery", (req, res) => res.sendFile(path.join(__dirname, "views/gallery.html")));
app.get("/gallery-pagination", (req, res) => res.sendFile(path.join(__dirname, "views/gallery-pagination.html")));
app.get("/fetch-random", (req, res) => res.sendFile(path.join(__dirname, "views/fetch-random.html")));
app.get("/fetch-multiple-random", (req, res) => res.sendFile(path.join(__dirname, "views/fetch-multiple-random.html")));

// Handle 404
app.use((req, res) => res.status(404).send("Route does not exist on our server"));

// Start server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
