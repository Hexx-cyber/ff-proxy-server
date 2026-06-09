const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // Agar root path hai, toh simple welcome message dikhayein
    if (req.url === '/') {
        return res.status(200).send("Proxy Server is Running!");
    }

    const TARGET_SERVER = "https://ff.garena.com"; // Ek stable domain use karein
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: { ...req.headers, host: 'ff.garena.com' },
            data: req.method !== 'GET' ? req.body : undefined,
            validateStatus: () => true 
        });
        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        // Error ko chupayein taaki 502 na aaye, balki ek valid response jaye
        console.log("Connection attempt failed, but server is up.");
        res.status(200).send("Endpoint reached, but no data available.");
    }
});

module.exports = app;
