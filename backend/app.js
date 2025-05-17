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

// CORS設定
app.use(cors({
  origin: 'https://homemax-frontend.onrender.com', // フロントエンドのURL
  credentials: true // Cookieやセッションを許可
}));

app.use(express.json());

// セッション設定
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // 本番のみtrue
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 本番はnone
        maxAge: 1000 * 60 * 60  // 1時間
    }
}));

// ルーティング
app.use('/api/compliment', complimentRoutes);
app.use('/auth', authRoutes);
app.use('/analysis', analysisRoutes);
app.use('/letter', letterRoutes);
// app.use('/task', taskRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});