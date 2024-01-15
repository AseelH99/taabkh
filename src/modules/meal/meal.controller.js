import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import mealModel from "../../../DB/model/meal.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { pagination } from "../../../services/pagination.js";
export const createMeal= async(req,res,next)=>{
 const{name,description,ingredients,process,categoryId}=req.body;
 const checkCategory= await categoryModel.findById(categoryId);
 if(!checkCategory){
    return next(new Error(`category is not found !`,{cause:404}));
 }
 req.body.slug=slugify(name);
 
 const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
    folder:`taabkh/meals`
});
req.body.createdBy=req.user._id;
req.body.updatedBy=req.user._id;
req.body.image={secure_url,public_id};
const meal = await mealModel.create(req.body);
if(!meal){
    return next(new Error(`error while creating meal `,{cause:500}));
}else
{
return res.status(201).json({message:"success",meal});
}

}
export const updateMeal=async(req,res,next)=>{
    const {id}= req.params;
    const meal =await mealModel.findById(id);
    if(!meal){
        return next( new Error(`meal not found`,{cause:404}));
    }
    if(req.body.name){
        if(await mealModel.findOne({name:req.body.name,_id:{$ne:meal._id}}).select('name'))
         {
            return next(new Error(`name is already exisit`,{cause:400})); 
        }
        meal.name=req.body.name;
        meal.slug=slugify(req.body.name);
      }
      if(req.body.description){
        meal.description=req.body.description;
        }
     if (req.body.ingredients){
            meal.ingredients=req.body.ingredients;
        }
     if (req.body.process){
            meal.process=req.body.process;
        }   
          
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.APPNAME}/meals`
        });
        await cloudinary.uploader.destroy(meal.image.public_id);
        meal.image={secure_url,public_id}
    }
    meal.createdBy=meal.createdBy;
    meal.updatedBy=req.user._id;
    await meal.save();
    return res .status(200).json({message:"sucess",meal});
}
export const getSpicificMeal=async(req,res,next)=>{
    const {id}=req.params;
    const meal=await mealModel.findById(id);
    if(!meal){
        return next( new Error(`meal not found`,{cause:404}));
    }
    return res.status(200).json({message:'success',meal});
}
export const getmealWithCategory =async (req,res,next)=>{
    const {skip,limit} = pagination(req.query.page,req.query.limit);
    const meals = await mealModel.find({categoryId:req.params.categoryId}).skip(skip).limit(limit);
    return res.status(200).json({message:"success",meals})
}
export const getAll = async(req,res,next)=>{
    const {skip,limit} = pagination(req.query.page,req.query.limit);
    const meals = await mealModel.find().skip(skip).limit(limit);
    return res.status(200).json({message:"success",meals})
}