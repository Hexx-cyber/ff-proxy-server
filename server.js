const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // 1. Garena Domain - Ensure karein ki ye target sahi hai
    const TARGET_SERVER = "https://api.freefiremobile.com"; 
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        // Logging for Debugging
        console.log(`[PROXY] ${req.method} request to: ${fullUrl}`);

        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: { 
                ...req.headers,
                'host': 'api.freefiremobile.com' 
            },
            data: req.body,
            validateStatus: () => true // Har status code accept karein
        });

        // Copy headers and status back to client
        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        console.error("[PROXY ERROR]", error.message);
        res.status(502).send("Proxy Gateway Error");
    }
});

module.exports = app;
