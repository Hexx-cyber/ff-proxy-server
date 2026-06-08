const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. Logger Middleware (Game ki har chalaki pakadne ke liye)
app.use((req, res, next) => {
    console.log(`\n--- [NEW REQUEST: ${new Date().toLocaleTimeString()}] ---`);
    console.log(`Method: ${req.method}`);
    console.log(`URL/Path: ${req.url}`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Payload/Body:`, JSON.stringify(req.body, null, 2));
    next();
});

// 2. Base Route (Check karne ke liye ke server zinda hai ya nahi)
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ status: "online", message: "Aapka system chal raha hai!" });
});

// 3. Catch-All Route (Taqay Google Bind ya koi bhi random URL aaye toh error na ho)
app.all('*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Abhi ke liye hum game ko har request par temporary success return karenge 
    // Taake humein real error pata chal sakay logs mein
    res.status(200).json({
        code: 200,
        status: "success",
        message: "Request received by custom proxy",
        data: {}
    });
});

app.listen(PORT, () => {
    console.log(`🚀 System ready on port: ${PORT}`);
    console.log(`Live dashboard dekhne ke liye terminal open rakhein.`);
});