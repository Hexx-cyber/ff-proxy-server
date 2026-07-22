const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet()); 
app.use(cors());
app.use(express.json());

app.all('*', async (req, res) => {
    try {
        // Instagram Graph API Endpoint
        const targetUrl = 'https://graph.instagram.com' + req.url;
        
        const headersToForward = { ...req.headers };
        delete headersToForward.host;

        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: headersToForward,
            data: req.body
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response?.status || 502).json({ 
            error: "Proxy Error: Unable to reach Instagram API",
            details: error.response?.data || error.message
        });
    }
});

module.exports = app;
