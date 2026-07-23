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
        // Testing Target (Open Public API)
        const targetUrl = 'https://jsonplaceholder.typicode.com' + req.url;
        
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
        res.status(502).json({ 
            error: "Proxy Error: Unable to reach target",
            message: error.message 
        });
    }
});

module.exports = app;
