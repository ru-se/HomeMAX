const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 追加

const complimentRoutes = require('./routes/complimentRoutes');
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const letterRoutes = require('./routes/letterRoutes');
const taskRoutes = require('./routes/taskRoutes');
const shareRoutes = require('./routes/shareRoutes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://homemax-frontend.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // Cookieパーサーを使用

// セッション(express-session)は削除し、JWT認証に移行しました

app.use('/api/compliment', complimentRoutes);
app.use('/auth', authRoutes);
app.use('/analysis', analysisRoutes);
app.use('/letter', letterRoutes);
app.use('/task', taskRoutes);
app.use('/share', shareRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
