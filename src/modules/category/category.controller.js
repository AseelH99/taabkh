import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import mealModel from "../../../DB/model/meal.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { pagination } from "../../../services/pagination.js";

export const createCategory =async(req,res,next)=>{
    const {name} = req.body;
    const category=await categoryModel.findOne({name:name});
    if(category){
        return next(new Error(`category name is allready exist`,{cause:409}));
    }
    const slugname=slugify(name);
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APPNAME}/categories`
    })
    const newCategory= await categoryModel.create({name,slug:slugname,image:{secure_url,public_id},
        createdBy:req.user._id,updatedBy:req.user._id});
     return res.status(201).json({message:"success new category created",newCategory});
}
export const getSpicificCategory = async(req,res,next)=>{
    const {id}=req.params;
    const category= await categoryModel.findById(id);
    if(!category){
        return next(new Error(`category not found`,{cause:404}));
    }
    return res.status(200).json({message:'success',category});
}
export const getCategories = async(req,res,next)=>{
    const {skip,limit} = pagination(req.query.page,req.query.limit);
    const categories = await categoryModel.find().skip(skip).limit(limit);
    return res.status(200).json({message:"sucess",categories});
}
export const updateCategory = async(req,res,next)=>{
    const {id}= req.params;
    const category =await categoryModel.findById(id);
    if(!category){
        return next( new Error(`category not found`,{cause:404}));
    }
    if(req.body.name){
        if(await categoryModel.findOne({name:req.body.name,_id:{$ne:category._id}}).select('name'))
         {
            return next(new Error(`name is already exisit`,{cause:400})); 
        }
        category.name=req.body.name;
        category.slug=slugify(req.body.name);
      }
   
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.APPNAME}/categories`
        });
        await cloudinary.uploader.destroy(category.image.public_id);
        category.image={secure_url,public_id}
    }
    category.updatedBy=req.user._id;
    await category.save();
    return res .status(200).json({message:"sucess",category});

}

export const deleteCategory = async (req,res,next)=>{
    const {categoryId}=req.params;
    const category = await categoryModel.findByIdAndDelete(categoryId);
    if(!category){
        return next( new Error(`category not found`,{cause:404}));
    }
    await mealModel.deleteMany({categoryId});
    return res.status(200).json({message:"success"});
}