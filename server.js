const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.all('*', async (req, res) => {
    // Favicon fix: Agar browser favicon mangta hai, toh use empty response dein
    if (req.url === '/favicon.ico') {
        return res.status(204).end();
    }

    const TARGET_SERVER = "https://ff.garena.com";
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: { 
                ...req.headers, 
                host: 'ff.garena.com' 
            },
            data: req.body,
            validateStatus: () => true 
        });

        // Data Modification (Modify logic yahan dalein)
        let modifiedData = response.data;
        
        // Agar response JSON hai toh edit karein
        if (typeof modifiedData === 'object') {
            modifiedData.proxy_modified = true;
        }

        res.status(response.status).set(response.headers).send(modifiedData);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(502).send("Proxy Gateway Error");
    }
});

module.exports = app;
