const express = require('express');
const app = express();

app.all('*', (req, res) => {
    // Agar game version check maang raha hai
    if (req.url.includes('/ver.php')) {
        console.log("Captured version check request!");
        // Yeh ek "Fake" success response hai
        return res.status(200).send("version=1.123.17&update=false");
    }

    // Baaki sab requests ke liye filhal 404
    res.status(404).send("Not Found");
});

module.exports = app;
