const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const complimentRoutes = require("./routes/complimentRoutes");

const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const letterRoutes = require("./routes/letterRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // 明示的にフロントのURLを指定
      "https://homemax-frontend.onrender.com",
    ],
    credentials: true, // 認証ヘッダーなどのクレデンシャルを許可
  })
);

app.use(express.json());

const isProd = process.env.NODE_ENV === "production";
if (isProd) {
  app.set("trust proxy", 1); // Render/プロキシ配下でsecure cookieを有効化
}

app.use("/api/compliment", complimentRoutes);
app.use("/auth", authRoutes);
app.use("/analysis", analysisRoutes);
app.use("/letter", letterRoutes);
app.use("/task", taskRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
