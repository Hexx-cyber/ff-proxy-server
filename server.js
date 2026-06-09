const express = require('express');
const app = express();

app.all('/ver.php', (req, res) => {
    // Game ko lagna chahiye ki ye official API response hai
    res.setHeader('Content-Type', 'application/json');
    
    const mockResponse = {
        "version": "1.123.17",
        "update": false,
        "url": "https://ff.garena.com",
        "maintenance": false
    };

    console.log("Sending JSON response for ver.php");
    return res.status(200).json(mockResponse);
});

module.exports = app;
