import express from 'express';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://store.steampowered.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://cdn.akamai.steamstatic.com",
          "https://shared.akamai.steamstatic.com"
        ],
        connectSrc: ["'self'", "http://localhost:3001", "https://store.steampowered.com"]
      }
    }
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/featuredcategories', async (req, res) => {
  try {
    const response = await axios.get('https://store.steampowered.com/api/featuredcategories/');
    res.json(response.data);
  } catch (error) {
    console.error('Steam API error:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.get('/game/:appid', async (req, res) => {
  const appid = req.params.appid;
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    res.json(response.data);
  } catch (error) {
    console.error('Game data error:', error);
    res.status(500).json({ error: 'An error occurred while fetching game data.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running: http://localhost:${PORT}`);
});
