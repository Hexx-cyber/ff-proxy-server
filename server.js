const express = require('express');
const app = express();

app.all('*', (req, res) => {
    // 1. Version Check Interception
    if (req.url.includes('/ver.php')) {
        console.log("Captured version check request!");
        // Ye response game ke structure ke zyada kareeb hai
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com");
    }

    // 2. Mocking other required endpoints (jo game login ke waqt maangta hai)
    if (req.url.includes('/api/article/list')) {
        return res.status(200).json({ "article_list": [] });
    }

    res.status(404).send("Not Found");
});

module.exports = app;
