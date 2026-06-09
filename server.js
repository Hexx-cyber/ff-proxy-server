const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    const TARGET = "https://ff.garena.com"; 
    
    try {
        const response = await axios({
            method: req.method,
            url: `${TARGET}${req.url}`,
            headers: {
                ...req.headers,
                'Host': 'ff.garena.com',
                // Sabse zaroori: Android phone ka disguise
                'User-Agent': 'FreeFire/1.123.17 Android/11',
                'Referer': 'https://ff.garena.com/'
            },
            data: req.method !== 'GET' ? req.body : undefined,
            validateStatus: () => true 
        });

        // Kuch headers ko modify karna padta hai taaki client crash na ho
        res.status(response.status).set(response.headers).removeHeader('content-encoding').send(response.data);
    } catch (err) {
        res.status(502).send("Proxy error: " + err.message);
    }
});

module.exports = app;
