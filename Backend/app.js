import express from 'express';
import dotenv from 'dotenv';
import router from './routes/route.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", router);
app.use("/api/user/", userRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`The Server Running On PORT : ${PORT}`);
  });
});
