import express from "express";
import cookieParser from 'cookie-parser';
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv"
import path from 'path';
dotenv.config();

import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import listingRouter from './routes/listing.route.js'
mongoose.connect(process.env.MONGO_URI).then(()=>{
app.listen(process.env.PORT,()=>{
  console.log(`Server is listening on Port ${process.env.PORT}`)
})
  console.log("Database Connected")

}).catch((error)=>{
  console.log(error)
})

const __dirname = path.resolve();
app.use(express.json());

app.use(cookieParser());
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)
 
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err,req,res,next) =>{
const statusCode = err.statusCode || 500;
const message = err.message || 'Internal Server Error';
return res.status(statusCode).json({
  success:false,
  statusCode,
  message
})
})
