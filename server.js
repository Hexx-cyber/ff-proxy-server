const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.all('*', async (req, res) => {
    // Garena Domain (Check kar lein agar ye sahi hai)
    const TARGET_SERVER = "https://ff.garena.com"; 
    
    // URL fix: undefined ko handle karna
    const path = req.originalUrl || req.url || '/';
    const fullUrl = `${TARGET_SERVER}${path}`;

    try {
        console.log(`Forwarding request to: ${fullUrl}`);

        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: {
                ...req.headers,
                host: 'ff.garena.com', // Original host ko override karna zaroori hai
                'x-forwarded-for': req.ip 
            },
            data: req.method !== 'GET' ? req.body : undefined,
            validateStatus: () => true, // Garena ke error codes (403, 404) ko handle karne ke liye
            timeout: 5000 // Timeout 5 second
        });

        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        console.error("Proxy Error Details:", error.message);
        res.status(502).json({ error: "Failed to connect to target server", details: error.message });
    }
});

module.exports = app;
