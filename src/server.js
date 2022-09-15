import express from "express";
const app = express();
const PORT = 3000;

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Initialize server
app.listen(PORT, () => console.log(`Server initialized on port ${PORT}`));