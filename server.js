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
        
        // Host header remove karna best practice hai proxy ke liye
        const headersToForward = { ...req.headers };
        delete headersToForward.host;

        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: headersToForward, 
            data: req.body
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        // Vercel Logs mein asli error dekhne ke liye:
        console.error("Target API Error:", error.message);
        if (error.response) {
            console.error("Garena Status:", error.response.status);
            console.error("Garena Data:", error.response.data);
        }

        // Screen par bhi detail dikha dein temporarily
        res.status(error.response?.status || 502).json({ 
            error: "Proxy Error: Unable to reach target",
            real_reason: error.message,
            garena_response: error.response?.data || "No data"
        });
    }
});

// Aakhir mein app ko export kar dein (Sirf ek baar)
module.exports = app;
