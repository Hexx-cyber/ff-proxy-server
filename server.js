const express = require('express');
const axios = require('axios');
const app = express();

app.all('*', async (req, res) => {
    // Agar humein domain nahi pata, toh hum request ke host header se domain nikal sakte hain
    // Lekin Garena ke liye humein hardcoded domain chahiye hogi
    const TARGET_SERVER = "https://ff.garena.com"; 
    
    // Sirf path ka use karein
    const fullUrl = `${TARGET_SERVER}${req.url}`;

    try {
        const response = await axios({
            method: req.method,
            url: fullUrl,
            headers: {
                ...req.headers,
                'host': 'ff.garena.com'
            },
            data: req.body,
            validateStatus: () => true
        });
        res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
        // Agar DNS error aata hai, toh log mein yahan dikhega
        console.error("DNS/Connection Error:", error.code);
        res.status(502).send("Error: " + error.message);
    }
});

module.exports = app;
