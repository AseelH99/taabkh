import mongoose from "mongoose";

const connectDB= async()=>{
    return await mongoose.connect(process.env.DB).then(
        ()=>{
            console.log("connect DB");
        }
    ).catch((err)=>{
        console.log(`failed to connect ${err}`);
    })
}
export default connectDB;