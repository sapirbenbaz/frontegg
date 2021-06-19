const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import Routes
const authRoute = require("./routes/auth");
const mainRoute = require("./routes/main");

dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("Connected to DB")
);

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, HEAD, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, auth-token, Authorization"
  );
  next();
});

app.use(express.json());

// Route Middleware
app.use("/api/user", authRoute);
app.use("/api/main", mainRoute);

app.listen(3000, () => console.log("Server up and running"));
