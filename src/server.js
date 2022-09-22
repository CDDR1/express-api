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
  return res.status(200).json(response.rows);
});

app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const response = await client.query("SELECT * FROM Tasks WHERE id = $1;", [id]);
  return res.status(200).json(response.rows);
});

app.post("/addTask", async (req, res) => {
  if (!req.body.description) {
    return res.status(400).send({
      success: false,
      message: "A task description is required to add a task.",
    });
  }

  const { description, date } = req.body;
  const response = await client.query("INSERT INTO Tasks (description, added_on) VALUES ($1, $2)", [description, date]);
  res.json({
    message: "Task Added Succesfully",
    body: {
      task: {
        description,
      },
    },
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

app.delete("/deleteTask/:id", async (req, res) => {
  const { id } = req.params;

  const response = await client.query("DELETE FROM Tasks WHERE id = $1", [id]);
  res.status(200).json({
    message: "Task Deleted Succesfully",
  });
});

// Initialize server
app.listen(PORT, () => console.log(`Server initialized on port ${PORT}`));
