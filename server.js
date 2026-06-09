const express = require('express');
const app = express();

app.all('*', (req, res) => {
    console.log("Captured Path:", req.url);

    // 1. Version Check (Iska proper format hona zaroori hai)
    if (req.url.includes('/ver.php')) {
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com");
    }

    // 2. Favicon handling (Game ka icon)
    if (req.url.includes('favicon')) {
        return res.status(200).send(""); // Khali response bhej do
    }

    // 3. Sabse important: Game ke baaki requests ko 200 OK ka jhoota dhoka dena
    // Agar hum 404 denge, to game ruk jayega. 200 denge to wo aage koshish karega.
    return res.status(200).json({ "status": "ok", "message": "connected" });
});

module.exports = app;
