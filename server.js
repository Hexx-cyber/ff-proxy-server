const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Security Layers
app.use(helmet()); 
app.use(cors());
app.use(express.json());

// Forwarding Logic: Asli server par request bhejna
app.all('*', async (req, res) => {
    try {
        const targetUrl = 'https://api.garena.com' + req.url; // Asli endpoint
        
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: req.headers, // Client ke headers pass karna zaroori hai
            data: req.body
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        // Professional Error Handling: Asli error mat dikhao, generic message do
        res.status(502).json({ error: "Proxy Error: Unable to reach target" });
    }
});

module.exports = app;
