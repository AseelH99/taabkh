import joi from "joi"
export const generalFields ={
    email:joi.string().email().required().min(5).messages({
        'string.empty':"email is requierd",
        'string.email':"plz enter a valid email"
    }),
    password:joi.string().required().min(3).messages({
        'string.empty':"password is required",
    }),
    file:joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),
        dest:joi.string(),
        })

}
export const vaildation = (schema)=>{
  return(req,res,next)=>{
   const inputdata={...req.body,...req.params,...req.query};
   if (req.file||req.files){
    inputdata.file=req.file||req.files;
   }
   const vaildationResult =schema.validate(inputdata,{abortEarly:false});
   if(vaildationResult.error?.details){
    return res.status(400).json({message:"vaildation error",
    validationError:vaildationResult.error?.details});

   }
   next();
  }
}