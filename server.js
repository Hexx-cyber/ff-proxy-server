const express = require('express');
const app = express();

app.all('/ver.php', (req, res) => {
    console.log("Request Method:", req.method); // Yeh check karna zaroori hai
    
    // Header spoofing
    res.setHeader('Server', 'Apache');
    res.setHeader('Content-Type', 'text/plain');
    
    // Fake config response
    res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com");
});

// Root path handling
app.get('/', (req, res) => res.status(200).send("Proxy Active"));

module.exports = app;
