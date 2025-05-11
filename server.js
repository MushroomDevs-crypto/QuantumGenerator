// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/quantum-proxy', async (req, res) => {
  try {
    const length = req.query.length || 1024;
    const apiUrl = `https://qrng.anu.edu.au/API/jsonI.php?length=${length}&type=uint8`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.success) throw new Error('Failed to fetch from ANU QRNG API');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching quantum data:', error);
    res.status(500).json({ success: false, message: 'Quantum API fetch failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Quantum proxy server running on http://localhost:${PORT}`);
});