
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    project: "SecureFlow",
    message: "DevSecOps API is running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
  });
});

app.get("/api", (req, res) => {
  res.json({
    service: "secureflow-api",
    environment: process.env.NODE_ENV || "development",
    message: "Hello from SecureFlow DevSecOps!",
  });
});

// Export the app so automated tests can exercise it without
// starting a separate production server.
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SecureFlow API running on port ${PORT}`);
  });
}