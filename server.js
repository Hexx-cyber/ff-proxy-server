const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // 1. Apne target domain ko yahan rakhein
    const TARGET_SERVER = "https://ff.garena.com"; 
    
    // 2. URL check karein (agar req.url undefined ho, toh / se replace karein)
    const path = req.url || '/';
    const fullUrl = `${TARGET_SERVER}${path}`;

    try {
        console.log(`Forwarding to: ${fullUrl}`);

        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: {
                ...req.headers,
                host: 'ff.garena.com' // Host header ko sahi karna zaroori hai
            },
            data: req.body,
            validateStatus: () => true 
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});

module.exports = app;
