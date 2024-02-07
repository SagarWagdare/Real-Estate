import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
export const signup= async (req,res,next)=>{
  const {username,email,password} = req.body;
  const hashPassword = bcrypt.hashSync(password,10)
  const newUser = new User({username,email,password:hashPassword})
  try {
    await newUser.save();
  res.status(201).json("User create successfully")

  } catch (error) {
    next(error);
    
  }
  }

  export const signin = async (req,res,next)=>{
    const {email ,password} = req.body;

    try {
      const validuser = await User.findOne({email})
      if(!validuser){
        return next(errorHandler(404,"User not found!"))
      }
      const validPassword = bcrypt.compareSync(password,validuser.password)
      if(!validPassword){
        return next(errorHandler(401,"Wrong credentials!"))
      }
      const token = jwt.sign({
        id:validuser._id
      },process.env.JWT_SECRET)

      const {password:pass, ...rest} = validuser._doc
      res.cookie('access_token',token,{
        httpOnly:true,
      }).status(200).json(rest)
    } catch (error) {
      next(error)
    }
  }
