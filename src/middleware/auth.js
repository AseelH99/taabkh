import jwt from "jsonwebtoken";
import userModel from '../../DB/model/user.model.js';

export const roles ={
    Admin:'Admin',
    User:'User'
}
export const auth =(accessRole=[])=>{
    return async (req,res,next)=>{
        const{authorization}=req.headers;
        if(!authorization?.startsWith(process.env.BEARERKEY)){
            return res.status(400).json({message:"Invalid authorization "})
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decoded= jwt.verify(token,process.env.LOGINSECRET);
        if(!decoded){
            return res.status(400).json({message:"invalid authoriaztion"});
        }
        const user = await userModel.findById(decoded.id).select("userName role changePasswordTime ");
        if(!user){
            return res.status(400).json({message:"not registerd user"});
        }
        if(parseInt(user.changePasswordTime?.getTime()/1000)>decoded.iat){
            return next(new Error(`exiperd token ,plz log in`,{cause:400}));
        }
        if(!accessRole.includes(user.role)){
            return res.status(403).json({message:"not auth user"});
        }
        req.user=user;
        next();
    }
}