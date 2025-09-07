import cors from "cors";
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/api/fpl", async (req, res) => {
  const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
  const data = await response.json();
  res.json(data);
});

app.listen(5000, () => console.log("Server running on port 5000"));
