import bcrypt from "bcryptjs";
import userModel from '../../../DB/model/user.model.js'
import cloudinary from "../../../services/cloudinary.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../../services/email.js";
import { customAlphabet, nanoid } from "nanoid";

export const singup= async(req,res,next)=>{
    const {userName,email,password}=req.body;
    const user =await userModel.findOne({email});
    if(user){
        //return res.status(409).json({message:"email already exisit "});
      return next(new Error("email already exisit",{cause:409}))
    }
     
    const hashedPassword =await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APPNAME}/users`
    })
    const token =jwt.sign({email},process.env.CONFIRMEMAIL);
    //await sendEmail(email,"confirm email",`<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'></a>`)
    const createUser = await userModel.create({userName,email,password:hashedPassword,image:{secure_url,public_id}});
    return res.status(201).json({message:"success",createUser});
}
export const confirmEmail= async(req,res,next)=>{
   const token = req.params.token;
   const decoded= jwt.verify(token,process.env.CONFIRMEMAIL);
   if(!decoded){
     return res.status(404).json({message:"invalid token"});
   }
   const user =await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},{
    confirmEmail:true});
    if(!user){
        return res.status(400).json({message:"invalid verfiy your email or your email is verfied"});
    }
    return res.status(200).json({message:"your email is verfied"});
}

export const singIn= async(req,res,next)=>{
    const{email,password}=req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"invalid user"});
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(400).json({message:"invalid data"});
    }
    const token= jwt.sign({id:user._id,role:user.role},process.env.LOGINSECRET,{expiresIn:'3h'});
    const refreshToken= jwt.sign({id:user._id,role:user.role},process.env.LOGINSECRET,{expiresIn:60*60*24*30});
    return res.status(200).json({message:"success",token,refreshToken});
}
export const sendCode=async(req,res,next)=>{
    const {email}=req.body;
    let code =customAlphabet('1234567890abcsASDF',4)
    code=code();
    const user = await userModel.findOneAndUpdate({email},{code},{new:true});
    const html=`<h2> your code is ${code}</h2>`
   // await sendEmail(email,'reset password',html);
   return res.status(200).json({message:"success",user});

}
export const forgetPassword = async(req,res,next)=>{
    const{email,password,code}=req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({message:"not registerd user"});

    }
    if(user.code != code){
        return res.status(400).json({message:"invalid code"});
    }
    let match = await bcrypt.compare(password,user.password)
    if(match){
        return res.status(409).json({message:"same password"});
    }
    user.password=await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
    user.code=null;
    user.changePasswordTime=Date.now();
    await user.save();
    return res.status(200).json({message:"success"});
}