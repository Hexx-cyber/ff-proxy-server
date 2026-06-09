const express = require('express');
const app = express();

app.all('*', (req, res) => {
    // 1. Version Check Handling
    if (req.url.includes('/ver.php')) {
        console.log("Responding to version check...");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        // Kuch games version string ke aage dummy data expect karte hain
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com&patch=false&info=success");
    }

    // 2. Default response (Silent fail)
    res.status(200).send("{}");
});

module.exports = app;
