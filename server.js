const express = require('express');
const helmet = require('helmet'); // Security headers ke liye
const rateLimit = require('express-rate-limit'); // Abuse rokne ke liye
const app = express();

// Security Middleware
app.use(helmet()); 

// Rate Limiter: 15 minute mein sirf 100 requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use(limiter);

app.use(express.json());

// Main Proxy Logic (Professional Structure)
app.all('*', async (req, res) => {
    // 1. Authentication Check (Professional touch)
    const authHeader = req.headers['authorization'];
    if (authHeader !== 'MySecretToken') {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    // 2. Version Check Logic
    if (req.url.includes('/ver.php')) {
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com&patch=false&info=success");
    }

    res.status(200).json({ status: "success", received: req.method });
});

module.exports = app;
