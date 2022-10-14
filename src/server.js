import express from "express";
const app = express();
import { PORT } from "./config.js";
import pg from "pg";
const Client = pg.Client;
import cors from "cors";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} from "./config.js";

const client = new Client({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});
client.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  return res.send("Hello From Express!");
});

app.get("/tasks", async (req, res) => {
  const response = await client.query("SELECT * FROM Tasks ORDER BY id ASC");
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
  const response = await client.query("INSERT INTO Tasks (description, added_on) VALUES ($1, $2) RETURNING *", [description, date]);
  res.send(response.rows[0]);
});

app.put("/editTask/:id", async (req, res) => {
  const { id } = req.params;
  const { description, completed } = req.body;

  const response = await client.query("UPDATE Tasks SET description = $1, completed = $2 WHERE id = $3 RETURNING *", [description, completed, id]);
  res.status(201).send(response.rows[0]);
});

app.delete("/deleteTask/:id", async (req, res) => {
  const { id } = req.params;

  const response = await client.query("DELETE FROM Tasks WHERE id = $1", [id]);
  res.status(200).json({
    message: "Task Deleted Succesfully",
    id
  });
});

// Initialize server
app.listen(PORT, console.log(`Server on port running on port ${PORT}`));
