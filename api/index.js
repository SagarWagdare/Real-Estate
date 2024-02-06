import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
app.use(express.json())
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
mongoose.connect(process.env.MONGO_URI).then(()=>{
app.listen(process.env.PORT,()=>{
  console.log(`Server is listening on Port ${process.env.PORT}`)
})
  console.log("Database Connected")

}).catch((error)=>{
  console.log(error)
})

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)

app.use((err,req,res,next) =>{
const statusCode = err.statusCode || 500;
const message = err.message || 'Internal Server Error';
return res.status(statusCode).json({
  success:false,
  statusCode,
  message
})
})
