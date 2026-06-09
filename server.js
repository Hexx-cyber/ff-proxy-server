const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    const TARGET_SERVER = "https://api.freefiremobile.com";
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: {
                ...req.headers,
                'host': 'api.freefiremobile.com',
                'User-Agent': 'UnityPlayer/2022.3.47f1 (UnityWebRequest/1.0, libcurl/7.84.0-DEV)',
                'Accept-Encoding': 'identity'
            },
            data: req.body,
            timeout: 10000,
            validateStatus: () => true
        });

        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        console.error("DEBUG ERROR:", error.message);
        res.status(502).send("Proxy Gateway Error: " + error.message);
    }
});

module.exports = app;
