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
    
    // IP Location Fetching (Server Side)
    let geoInfo = "Bahawalpur, Pakistan"; // Default agar API slow ho
    try {
        const geo = await axios.get(`http://ip-api.com/json/${cleanIp}`);
        if (geo.data.status === 'success') {
            geoInfo = `${geo.data.city}, ${geo.data.country}`;
        }
    } catch(e) {}

    // HTML UI jo Client-side data ko dynamically update karega
    const htmlResponse = `
    <html>
    <body style="background:#000; color:#0f0; font-family:monospace; padding:20px;">
        <h3>🛡️ SYSTEM SECURITY ANALYSIS</h3>
        <div id="data">
            <p><strong>[IP]:</strong> ${cleanIp}</p>
            <p><strong>[Location]:</strong> ${geoInfo}</p>
            <p><strong>[Resolution]:</strong> <span id="res">Loading...</span></p>
            <p><strong>[CPU Cores]:</strong> <span id="cpu">Loading...</span></p>
            <p><strong>[Battery]:</strong> <span id="bat">Loading...</span></p>
            <p><strong>[Connection]:</strong> <span id="conn">Loading...</span></p>
        </div>
        <script>
            // Live Data Fetching via Browser
            document.getElementById('res').innerText = window.screen.width + 'x' + window.screen.height;
            document.getElementById('cpu').innerText = navigator.hardwareConcurrency || 'Hidden';
            
            if(navigator.connection) {
                document.getElementById('conn').innerText = navigator.connection.effectiveType + ' (' + navigator.connection.downlink + ' Mbps)';
            }
            
            if(navigator.getBattery) {
                navigator.getBattery().then(b => document.getElementById('bat').innerText = Math.round(b.level * 100) + '% ' + (b.charging ? '(Charging)' : '(Discharging)'));
            } else {
                document.getElementById('bat').innerText = 'Access Denied';
            }
        </script>
    </body>
    </html>`;
    
    res.send(htmlResponse);
});


module.exports = app;
