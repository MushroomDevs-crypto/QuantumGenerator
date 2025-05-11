const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.get('/quantum-proxy', async (req, res) => {
  try {
    const length = req.query.length || 1024;
    const apiUrl = `https://qrng.anu.edu.au/API/jsonI.php?length=${length}&type=uint8`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.success) throw new Error('QRNG API failed');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
