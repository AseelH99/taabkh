import mongoose,{Schema,model,Types} from "mongoose";

const mealSchema =new Schema({
    name:{
        type:String,
        required:true,
        unique:true,   
    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    CookingTime:{
        type:Number,
    },
    numOfPeople:{
        type:Number,
    },
    ingredients:{
        type:String,
        required:true,
    },
    process:{
        type:String,
        required:true, 
    },
    categoryId:{
        type:Types.ObjectId,ref:'Category',
        required:true,

    },
    createdBy:{
        type:Types.ObjectId,ref:'User',required:true
    },
    updatedBy:{
        type:Types.ObjectId,ref:'User',required:true
    },
},{timestamps:true});
const mealModel = mongoose.models.Meal ||mongoose.model('Meal',mealSchema);
export default mealModel;