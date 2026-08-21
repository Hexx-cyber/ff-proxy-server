const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Firebase Admin SDK import karein
const admin = require('firebase-admin');

// Apna Firebase service account JSON key yahan connect karein
// (Aap Firebase Console se serviceAccountKey.json download karke project mein rakh sakte hain)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// 1. Test Endpoint (Check karne ke liye ke server chal raha hai ya nahi)
app.get('/', (req, res) => {
  res.json({ status: "Server is live and powerful!" });
});

// 2. Data Save karne ka Endpoint (POST Request)
app.post('/api/save-data', async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Firestore ke 'Users' collection mein data save karein
        const docRef = await db.collection('Users').add({
            name: name,
            email: email,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: "Data saved successfully!", id: docRef.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Data Get (Fetch) karne ka Endpoint (GET Request)
app.get('/api/get-users', async (req, res) => {
    try {
        const snapshot = await db.collection('Users').get();
        let users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Server export for Vercel
module.exports = app;
