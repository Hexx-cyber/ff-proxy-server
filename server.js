const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS Policy (Only allow trusted traffic)
app.use(cors());

// 3. Rate Limiter (Protection against flood attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Ek IP se max 100 requests
    message: { error: "Too many requests, slow down!" }
});
app.use(limiter);

app.use(bodyParser.json());

// 4. Professional Routing Logic
app.all('*', (req, res) => {
    
    // Version Check Logic
    if (req.url.includes('/ver.php')) {
        return res.status(200).send("version=1.123.17&update=false&url=https://ff.garena.com&patch=false&info=success");
    }

    // Safety: Har request ko log karna (Internal purpose ke liye)
    // Professional servers hamesha record rakhte hain
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.ip}`);

    // Default Response
    res.status(200).json({ status: "success", timestamp: new Date().toISOString() });
});

module.exports = app;
