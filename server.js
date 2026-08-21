const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const path = require('path');
const axios = require('axios');

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

// Device Info aur IP Tracker Route (Pro Dashboard Look)
app.get('/api/device-info', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = clientIp ? clientIp.split(',')[0].trim() : '127.0.0.1';
    
    // IP se City aur Country nikalne ke liye
    let location = "Unknown Location";
    try {
        const geo = await axios.get(`http://ip-api.com/json/${cleanIp}`);
        if (geo.data && geo.data.status === 'success') {
            location = `${geo.data.city}, ${geo.data.country}`;
        }
    } catch (e) {
        location = "Location tracking restricted";
    }

    const userAgent = req.headers['user-agent'] || "Unknown Device";

    // Console (Logs) mein print karna
    console.log(`New Visitor! IP: ${cleanIp}, Location: ${location}, Device: ${userAgent}`);

    // Visitor ki screen par ek stylish HTML page dikhana
    const htmlResponse = `
    <html>
    <head>
        <title>System Monitor</title>
    </head>
    <body style="font-family: monospace; background: #0a0a0a; color: #00ff66; padding: 30px;">
        <h2 style="border-bottom: 2px solid #00ff66; padding-bottom: 10px;">🛡️ SECURITY SYSTEM LOG</h2>
        <div style="background: #111; border: 1px solid #00ff66; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="font-size: 16px;"><strong>Target IP:</strong> ${cleanIp}</p>
            <p style="font-size: 16px;"><strong>Location:</strong> ${location}</p>
            <p style="font-size: 16px;"><strong>Device Details:</strong> ${userAgent}</p>
            <p style="color: #ffcc00; margin-top: 20px;">[Status: Connection Logged & Saved Successfully]</p>
        </div>
    </body>
    </html>`;
    
    res.send(htmlResponse);
});

module.exports = app;
