import { sendEmail } from "../../services/email.js";
import  authRouter from './auth/auth.router.js';
import mealRouter from './meal/meal.router.js';
import categoryRouter from './category/category.router.js';
const initApp =(app,express)=>{
app.use(express.json());
 // sendEmail("aseelh355@gmail.com","test","<h2>hello</h2>");
app.use('/auth',authRouter);
app.use('/meal',mealRouter);
app.use('/category',categoryRouter);
app.get('/',(req,res)=>{
    return res.status(200).json("Welcome...... ")
 });
 app.get("*",(req,res)=>{
    return res.status(500).json({"message":"page not found"});
});
}
export default initApp;