const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    try {
        // Garena ka real server URL
        const TARGET = "https://ff.garena.com"; 
        
        const response = await axios({
            method: req.method,
            url: `${TARGET}${req.url}`,
            headers: {
                ...req.headers,
                'Host': 'ff.garena.com' // Ye header bahut important hai
            },
            data: req.method !== 'GET' ? req.body : undefined,
            validateStatus: () => true 
        });

        res.status(response.status).set(response.headers).send(response.data);
    } catch (err) {
        res.status(502).send("Proxy error: " + err.message);
    }
});

module.exports = app;
