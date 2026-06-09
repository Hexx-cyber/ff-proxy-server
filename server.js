const express = require('express');
const app = express();

app.all('*', (req, res) => {
    // 1. Version Check
    if (req.url.includes('/ver.php')) {
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com");
    }

    // 2. Handle Root and other unknown requests to prevent 404
    // Game jab login check karta hai to kabhi kabhi root path '/' use karta hai
    console.log("Captured path:", req.url);
    
    // Yahan hum 200 OK bhej rahe hain taaki game crash na ho
    res.status(200).send("{}"); 
});

module.exports = app;
