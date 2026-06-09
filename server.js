const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // 1. Favicon handle karein taaki Garena ka official logo wapas aa jaye
    if (req.url === '/favicon.ico') {
        return res.redirect('https://ff.garena.com/favicon.ico');
    }

    const TARGET_SERVER = "https://ff.garena.com";
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        // 2. Real Game Client ke Headers spoof karein
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: {
                'Host': 'ff.garena.com',
                'User-Agent': 'UnityPlayer/2022.3.47f1 (UnityWebRequest/1.0, libcurl/7.84.0-DEV)',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'X-Unity-Version': '2022.3.47f1'
            },
            data: req.method !== 'GET' ? req.body : undefined,
            validateStatus: () => true, // 404/500 ko block na kare
            timeout: 10000 
        });

        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        console.error("PROXY CRASH:", error.message);
        res.status(502).send("Proxy Gateway Error");
    }
});

module.exports = app;
