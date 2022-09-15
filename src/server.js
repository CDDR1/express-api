import express from "express";
const app = express();
const PORT = 3000;
import { getTasks } from "./tasks.js";

// Routes
app.get("/tasks", (req, res) => {
  return res.status(200).send({
    succes: "true",
    message: "tasks",
    tasks: getTasks()
  });
});

// Initialize server
app.listen(PORT, () => console.log(`Server initialized on port ${PORT}`));