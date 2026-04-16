const jsonServer = require("json-server");
const path = require("path");
const express = require("express");

const app = express();
const router = jsonServer.router(path.join(__dirname, "data/db.json"));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(middlewares);
app.use(express.static(path.join(__dirname, "/")));

// API routes
app.use("/api", router);

// fallback للـ frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
