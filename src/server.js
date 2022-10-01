import express from "express";
const app = express();
import { PORT } from "./config.js";
import bodyParser from "body-parser";
import pg from "pg";
const Client = pg.Client;
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} from "./config.js";

// const client = new Client({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "userdb",
//   port: 5432,
// });
const client = new Client({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});
client.connect();

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

app.put("/editTask/:id", async (req, res) => {
  const { id } = req.params;
  const { description, completed } = req.body;

  const response = await client.query("UPDATE Tasks SET description = $1, completed = $2 WHERE id = $3", [description, completed, id]);
  res.status(201).send(`Task ${id} updated`);
});

app.delete("/deleteTask/:id", async (req, res) => {
  const { id } = req.params;

  const response = await client.query("DELETE FROM Tasks WHERE id = $1", [id]);
  res.status(200).json({
    message: "Task Deleted Succesfully",
  });
});

// Initialize server
app.listen(PORT, console.log(`Servern on port running on port ${PORT}`));
