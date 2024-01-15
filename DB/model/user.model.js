import mongoose,{Schema,model} from "mongoose";

const userSchema = new Schema({
    userName:{
        type:String,
        required:[true,'user name is required'],
        min:4,
        max:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
    },
   
    role:{
        type:String,
        default:'User',
        enum:['User','Admin'],
    },
    changePasswordTime:{
        type:Date,
    },
    code:{
        type:String,
        default:null
    },
},{
    timestamps:true,
});
const userModel =mongoose.models.User|| model('User',userSchema);
export default userModel;
