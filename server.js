const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Main Proxy Route
app.all('*', async (req, res) => {
    // Ye domain change karke dekhein, zyadatar yahi use hoti hai
    const TARGET_SERVER = "https://api.freefiremobile.com"; 
    
    // Path ensure karein ki / se start ho
    const path = req.url || '/';
    const fullUrl = `${TARGET_SERVER}${path}`;

    try {
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: { 
                ...req.headers, 
                host: 'api.freefiremobile.com' 
            },
            data: req.method !== 'GET' ? req.body : undefined,
            validateStatus: () => true 
        });

        // Response wapas bhejein
        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(502).send("Proxy Error");
    }
});

module.exports = app;
