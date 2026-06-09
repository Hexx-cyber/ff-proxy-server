const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // Ye rahi Garena ki official API domain
    const TARGET_SERVER = "https://ff.garena.com"; 
    const url = `${TARGET_SERVER}${req.url}`;
    
    try {
        const response = await axios({
            method: req.method,
            url: url,
            params: req.query, // Search params pass karne ke liye
            data: req.body,
            headers: { ...req.headers, host: 'ff.garena.com' }
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Forwarding Error:", error.message);
        res.status(502).send("Forwarding Failed");
    }
});

module.exports = app;
