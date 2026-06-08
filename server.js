const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- DEBUGGING MIDDLEWARE ---
// Ye console mein dikhayega ke request kahan se aa rahi hai
app.use((req, res, next) => {
    console.log(`DEBUG: Requested URL: ${req.url}`);
    console.log(`DEBUG: Host Header: ${req.headers.host}`);
    next();
});

// Base Route
app.get('/', (req, res) => {
    res.status(200).send("Proxy is running...");
});

// Dynamic Proxy Route
app.all('*', async (req, res) => {
    // Abhi ke liye yahan koi bhi dummy URL rakhein, 
    // jab aapko logs mein sahi domain mil jaye, tab usay yahan replace kar dena.
    const TARGET_SERVER = "https://example.com"; 
    const url = `${TARGET_SERVER}${req.url}`;

    try {
        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: { ...req.headers, host: new URL(TARGET_SERVER).host },
            validateStatus: () => true 
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(502).send("Bad Gateway");
    }
});

module.exports = app;
