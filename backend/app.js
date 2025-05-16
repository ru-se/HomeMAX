const express = require('express');
const dotenv = require('dotenv');

require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const complimentRoutes = require('./routes/complimentRoutes');

const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const letterRoutes = require('./routes/letterRoutes');
// const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/compliment', complimentRoutes);
app.use('/auth', authRoutes);
app.use('/analysis', analysisRoutes);
app.use('/letter', letterRoutes);
// app.use('/task', taskRoutes);

app.use(session({
    
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // HTTPSならtrue
        maxAge: 1000 * 60 * 60  // 1時間
    }
}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});