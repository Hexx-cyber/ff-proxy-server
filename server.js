const express = require('express');
const app = express();

app.all('*', (req, res) => {
    // 1. Version Check: Yahan hum pura data hardcode kar rahe hain
    if (req.url.includes('/ver.php')) {
        console.log("Mocking version check...");
        res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com&patch=false&info=success");
    }

    // 2. Favicon aur faltu requests
    if (req.url.includes('favicon')) {
        return res.status(200).send("");
    }

    // 3. Game ki baki requests ko 'Empty JSON' se fill karo
    res.status(200).json({ "status": "success" });
});

module.exports = app;
