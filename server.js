const express = require('express');
const app = express();

app.all('*', (req, res) => {
    // Ye headers game ko batayenge ki ye ek valid Garena server hai
    res.setHeader('Server', 'Apache/2.4.41 (Ubuntu)');
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.setHeader('Connection', 'keep-alive');

    if (req.url.includes('/ver.php')) {
        console.log("Captured version check request!");
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com");
    }

    res.status(404).send("Not Found");
});

module.exports = app;
