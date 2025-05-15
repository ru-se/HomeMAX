const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const complimentRoutes = require('./routes/complimentRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/compliment', complimentRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});