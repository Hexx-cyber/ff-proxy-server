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

// Advanced OSINT / Device Probing Route
app.get('/api/device-info', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = clientIp ? clientIp.split(',')[0].trim() : '127.0.0.1';
    
    let location = "Unknown Location";
    try {
        const geo = await axios.get(`http://ip-api.com/json/${cleanIp}`);
        if (geo.data && geo.data.status === 'success') {
            location = `${geo.data.city}, ${geo.data.country} (ISP: ${geo.data.isp})`;
        }
    } catch (e) {
        location = "Restricted";
    }

    const userAgent = req.headers['user-agent'] || "Unknown";

    // Console mein heavy log print karna
    console.log(`[ALERT] Target Engaged! IP: ${cleanIp} | Location: ${location}`);

    // Advanced Matrix Style HTML + Client-side JS Probing UI
    const htmlResponse = `
    <html>
    <head>
        <title>SEC-OPS TERMINAL v4.2</title>
        <style>
            body { background: #000; color: #00ff66; font-family: 'Courier New', monospace; padding: 20px; }
            .box { border: 1px solid #00ff66; padding: 15px; border-radius: 5px; background: #050505; box-shadow: 0 0 15px rgba(0,255,102,0.2); }
            h2 { color: #ff3333; text-shadow: 0 0 5px #ff3333; }
            .warning { color: #ffcc00; animation: blink 1s infinite; }
            @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        </style>
    </head>
    <body>
        <h2>⚠️ TARGET SESSION INTERCEPTED ⚠️</h2>
        <div class="box">
            <p><strong>[+] Public IP:</strong> ${cleanIp}</p>
            <p><strong>[+] Geolocation:</strong> ${location}</p>
            <p><strong>[+] User-Agent:</strong> ${userAgent}</p>
            <hr style="border-color: #00ff66;">
            <p><strong>[+] Screen Resolution:</strong> <span id="res">Scanning...</span></p>
            <p><strong>[+] Hardware Cores (CPU):</strong> <span id="cpu">Scanning...</span></p>
            <p><strong>[+] Estimated Battery:</strong> <span id="battery">Accessing API...</span></p>
            <p><strong>[+] Connection Type:</strong> <span id="conn">Detecting...</span></p>
            <p class="warning">[!] STATUS: Injecting secure handshake... CONNECTION SECURED.</p>
        </div>

        <script>
            // Client-side hardware & browser probing scripts
            document.getElementById('res').innerText = window.innerWidth + ' x ' + window.innerHeight;
            document.getElementById('cpu').innerText = navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' Cores' : 'Hidden';
            
            if (navigator.connection) {
                document.getElementById('conn').innerText = navigator.connection.effectiveType.toUpperCase() + ' (' + navigator.connection.downlink + ' Mbps)';
            } else {
                document.getElementById('conn').innerText = 'Standard Broadband';
            }

            if (navigator.getBattery) {
                navigator.getBattery().then(function(bat) {
                    document.getElementById('battery').innerText = Math.round(bat.level * 100) + '% (' + (bat.charging ? 'Charging' : 'Discharging') + ')';
                });
            } else {
                document.getElementById('battery').innerText = 'Not Shared';
            }
        </script>
    </body>
    </html>`;
    
    res.send(htmlResponse);
});

module.exports = app;
