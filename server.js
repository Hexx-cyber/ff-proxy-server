const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Asli server se baat karne ke liye

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. Logger Middleware
app.use((req, res, next) => {
    console.log(`\n--- [NEW REQUEST: ${new Date().toLocaleTimeString()}] ---`);
    console.log(`Method: ${req.method}`);
    console.log(`URL/Path: ${req.url}`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Payload/Body:`, JSON.stringify(req.body, null, 2));
    next();
});

// 2. Base Route
app.get('/', (req, res) => {
    res.status(200).send("online");
});

// 3. Dynamic Proxy Route (Asli Game Logic)
app.all('*', async (req, res) => {
    // ⚠️ Yahan Free Fire ka asli API base domain lagayein agar aapko maloom hai
    // Agar nahi maloom, toh pehle logs check karein ke game kis domain par hit kar rahi hai
    const TARGET_SERVER = "https://freefire-api-domain.com"; 

    try {
        console.log(`🔄 Forwarding request to: ${TARGET_SERVER}${req.url}`);
        
        const response = await axios({
            method: req.method,
            url: `${TARGET_SERVER}${req.url}`,
            data: req.body,
            headers: { 
                ...req.headers, 
                host: new URL(TARGET_SERVER).host // Host header badalna zaroori hai
            },
            validateStatus: () => true // Har status code accept karein (200, 404, 500 etc)
        });

        console.log(`✅ Response from Real Server [Status: ${response.status}]`);
        
        // Game ko asli response wapas bhejein
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error("❌ Proxy Error:", error.message);
        res.status(500).json({ error: "Proxy failed to fetch data", details: error.message });
    }
});

// Agar Vercel par ho toh export karein, local ho toh listen karein
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 System ready on port: ${PORT}`);
    });
}

module.exports = app; // Yeh Vercel ke liye zaroori hai
