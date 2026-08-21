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

// Pro OSINT Real Data Route (No Fake Animations)
app.get('/api/device-info', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = clientIp ? clientIp.split(',')[0].trim() : '127.0.0.1';
    
    let geoData = { city: "Unknown", country: "Unknown", isp: "Unknown", org: "Unknown", timezone: "Unknown" };
    try {
        const geo = await axios.get(`http://ip-api.com/json/${cleanIp}`);
        if (geo.data && geo.data.status === 'success') {
            geoData = geo.data;
        }
    } catch (e) {
        // Fallback
    }

    const userAgent = req.headers['user-agent'] || "Unknown Device";

    console.log(`[REAL CAPTURE] IP: ${cleanIp} | City: ${geoData.city}`);

    const htmlResponse = `
    <html>
    <head>
        <title>NETWORK INTELLIGENCE REPORT</title>
    </head>
    <body style="font-family: monospace; background: #050505; color: #00ff66; padding: 25px;">
        <h2 style="border-bottom: 2px solid #ff3333; color: #ff3333; padding-bottom: 8px;">ACCESS LOG GRANTED</h2>
        <div style="background: #111; border: 1px solid #00ff66; padding: 20px; border-radius: 6px; box-shadow: 0 0 10px rgba(0,255,102,0.1);">
            <p><strong>[IP Address]:</strong> ${cleanIp}</p>
            <p><strong>[City / Country]:</strong> ${geoData.city}, ${geoData.country}</p>
            <p><strong>[ISP / Network]:</strong> ${geoData.isp}</p>
            <p><strong>[Organization]:</strong> ${geoData.org}</p>
            <p><strong>[Timezone]:</strong> ${geoData.timezone}</p>
            <p><strong>[Device / OS]:</strong> ${userAgent}</p>
            <hr style="border-color: #333; margin: 15px 0;">
            <p style="color: #ffcc00; font-size: 14px;">[Status: 100% Verified Live Connection]</p>
        </div>
    </body>
    </html>`;
    
    res.send(htmlResponse);
});

module.exports = app;
