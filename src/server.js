import express from "express";
const app = express();
const PORT = 3000;
import bodyParser from "body-parser";
import { getTasks } from "./tasks.js";
import pg from "pg";
const Client = pg.Client;

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "",
  database: "TasksDB",
  port: 5432,
});
client.connect();

const tasksList = getTasks();

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  return res.send("Hello From Express!");
});

app.get("/tasks", async (req, res) => {
  const response = await client.query("SELECT * FROM Tasks");
  res.status(200).json(response.rows);
});

app.post("/addTask", (req, res) => {
  if (!req.body.description) {
    return res.status(400).send({
      success: false,
      message: "A task description is required to add a task.",
    });
  }

  const newTask = {
    id: req.body.id,
    description: req.body.description,
    completed: req.body.completed,
  };

  tasksList.push(newTask);
  return res.status(201).send({
    success: true,
    message: `Task added successfully: ${newTask.description}`,
  });
});

app.put("/editTask/:id", (req, res) => {
  const id = req.params.id;

  const editedTask = {
    id: id,
    description: req.body.description,
    completed: req.body.completed,
  };

  for (let i = 0; i < tasksList.length; i++) {
    if (tasksList[i].id === id) {
      tasksList[i] = editedTask;
      return res.status(201).send({
        success: true,
        message: `Updated task`,
      });
    }
  }

  return res.status(404).send({
    success: "true",
    message: "error in update",
  });
});

app.delete("/deleteTask/:id", (req, res) => {
  const id = req.params.id;

  for (let i = 0; i < tasksList.length; i++) {
    if (tasksList[i].id === id) {
      tasksList.splice(i, 1);
      return res.status(201).send({
        success: "true",
        message: "Task deleted succesfully",
      });
    }
  }

  return res.status(404).send({
    success: "true",
    message: "Error in deleting task",
  });
});

// Initialize server
app.listen(PORT, () => console.log(`Server initialized on port ${PORT}`));
