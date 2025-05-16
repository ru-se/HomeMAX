const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const session = require('express-session');
const complimentRoutes = require('./routes/complimentRoutes');

const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const letterRoutes = require('./routes/letterRoutes');
// const taskRoutes = require('./routes/taskRoutes');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', // 明示的にフロントのURLを指定
  credentials: true                // Cookie やセッションを許可
}));

app.use(express.json());

app.use(session({
    
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // HTTPSならtrue
        maxAge: 1000 * 60 * 60  // 1時間
    }
}));


app.use('/api/compliment', complimentRoutes);
app.use('/auth', authRoutes);
app.use('/analysis', analysisRoutes);
app.use('/letter', letterRoutes);
// app.use('/task', taskRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});