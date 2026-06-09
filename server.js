const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // Domain change: Kabhi kabhi Garena 'ff-api.garena.com' use karta hai
    const TARGET_SERVER = "https://ff-api.garena.com"; 
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        console.log(`Trying to connect to: ${fullUrl}`);
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: {
                ...req.headers,
                'host': 'ff-api.garena.com'
            },
            data: req.body,
            timeout: 8000 // 8 second timeout
        });
        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        // Detailed log
        if (error.code === 'ENOTFOUND') {
            console.error("DNS Error: Could not resolve domain. Check domain name.");
        }
        res.status(502).send("Proxy Error: " + error.message);
    }
});

module.exports = app;
