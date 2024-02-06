import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

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

