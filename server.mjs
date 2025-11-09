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

// Proxy for bootstrap data
app.get("/api/bootstrap", async (req, res) => {
  try {
    const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const data = await response.json();
    res.json(data);
  } catch (_error) {
    res.status(500).json({ error: "Failed to fetch bootstrap data" });
  }
});

// Proxy for fixtures
app.get("/api/fixtures", async (req, res) => {
  try {
    const response = await fetch("https://fantasy.premierleague.com/api/fixtures/");
    const data = await response.json();
    res.json(data);
  } catch (_error) {
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

app.get("/api/entry/:team_id", async (req, res) => {
  try {
    const { team_id } = req.params;  // <-- dynamic param from URL

    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${team_id}/`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Proxy for transfers by team
app.get("/api/entry/:team_id/transfers/", async (req, res) => {
  try {
    const { team_id } = req.params;
    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${team_id}/transfers/`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transfer data" });
  }
});

// Same route without trailing slash to avoid 404s from client variants
app.get("/api/entry/:team_id/transfers", async (req, res) => {
  try {
    const { team_id } = req.params;
    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${team_id}/transfers/`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transfer data" });
  }
});


app.get("/api/leagues-classic/:league_id/standings/", async (req, res) => {
  try {
    const { league_id } = req.params;  // <-- dynamic param from URL

    const response = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${league_id}/standings/`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch League data" });
  }
});

app.get("/api/entry/:team_id/event/:gw_id/picks", async (req, res) => {
  try {
    const { team_id,gw_id } = req.params;  // <-- dynamic param from URL

    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${team_id}/event/${gw_id}/picks/`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch League data" });
  }
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
