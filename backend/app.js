const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // 追加
const complimentRoutes = require('./routes/complimentRoutes');

dotenv.config();

const app = express();

app.use(cors()); // 追加
app.use(express.json());

app.use('/api/compliment', complimentRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});