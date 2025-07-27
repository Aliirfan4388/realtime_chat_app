import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
import{io} from "../lib/socket.js";

export const signup = async (req,res)=>{
    console.log(req.body)
    const {fullname,email,password} = req.body
    
    try {

        if(!fullname || !email || !password){
            return res.status(400).json({ message : "all fields are required" });
        }

        if(password.length < 6){
            return res.status(400).json({ message : "invalid length of password"});
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({ message : "user already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password,salt);

        const newuser = new User({email,
            fullname,
            password : hashedpass
        })
        if (newuser) {
            generateToken(newuser.id,res)

            await newuser.save();

            res.status(201).json({
                _id : newuser.id,
                fullname : newuser.fullname,
                email : newuser.email,
                profilepic : newuser.profilepic

            })

            
        } else {
            return res.status(400).json({ message : "invalid user data"});
        }
    } catch (error) {
        console.log("error in singnup controll",error.message)
        res.status(500).json({
            message : "internal server error"
        })
    }
    
   


};
export const login = async (req,res)=>{
    const {email,password} = req.body
    try {


        if(password.length < 6){
            return res.status(400).json({ message : "invalid length of password"});
        }
        const user = await User.findOne({email})
        console.log("user is",user)
        if(!user){
            return res.status(400).json({ message : "invalis credential"});
        }
        
      
        const ispass = await bcrypt.compare(password,user.password);
        
        if(!ispass){
             return res.status(400).json({ message : "invalid credential"});
        }else{

            generateToken(user._id,res);
          

            res.status(201).json({
                _id : user.id,
                fullname : user.fullname,
                email : user.email,
                profilepic : user.profilepic

            })
        }
    } catch (error) {
        res.status(500).json({
            message : "internal server error"});
        
        
        }

};
export const logout = (req,res)=>{
    try {
         res.cookie("jwt","",{
        maxAge : 0})
         res.status(201).json({
                message : "loggedout succesfully"
            })
        
    } catch (error) {
         res.status(500).json({
                message : "internal server error"
            })
    } 
};
export const update = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;

    if (!profilepic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilepic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
