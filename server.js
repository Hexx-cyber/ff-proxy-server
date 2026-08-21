const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const path = require('path');

// Vercel Environment Variable se key ko read karna
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: "Powerful Firebase Server is Live!" });
});
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'favicon.ico'));
});
// Device Info aur IP Tracker Route
app.get('/api/device-info', (req, res) => {
    // User ka IP address nikalna (Vercel headers se)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // User ka device/browser konsa hai (User-Agent)
    const userAgent = req.headers['user-agent'];

    // Console (Logs) mein print karna taake aapko pata chal sake
    console.log(`New Visitor! IP: ${clientIp}, Device: ${userAgent}`);

    // Visitor ki screen par JSON data dikhana
    res.status(200).json({
        success: true,
        message: "Device info captured successfully!",
        visitorIp: clientIp,
        deviceDetails: userAgent,
        time: new Date().toLocaleString()
    });
});
module.exports = app;
