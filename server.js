const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // Favicon aur faltu requests ko turant block karein taaki 502 na aaye
    if (req.url.includes('favicon') || req.url === '/') {
        return res.status(200).send("OK");
    }

    try {
        const response = await axios({
            method: req.method,
            url: `https://ff.garena.com${req.url}`,
            headers: { ...req.headers, 'Host': 'ff.garena.com' },
            data: req.method !== 'GET' ? req.body : undefined,
            timeout: 5000 // 5 seconds ka timeout
        });
        res.status(response.status).set(response.headers).send(response.data);
    } catch (err) {
        // Agar Garena block kar raha hai, toh hum "Mock" response denge
        if (req.url.includes('/ver.php')) {
            return res.status(200).send("version=1.123.17&update=false");
        }
        res.status(200).send("{}"); // 502 ki jagah 200 bhej rahe hain
    }
});

module.exports = app;
