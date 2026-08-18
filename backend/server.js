// This shows exactly where the upload feature plugs into an existing
// Express app (TaskFlow-style). Merge these lines into your real server.js
// instead of replacing it wholesale.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const uploadRoutes = require("./routes/uploadRoutes");
// const taskRoutes = require("./routes/taskRoutes");
// const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use("/api", uploadRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/auth", authRoutes);

// Fallback error handler - never leak stack traces to the client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
