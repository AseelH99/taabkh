import 'dotenv/config'
import express from'express';
import initApp from './src/modules/index.router.js';
import connectDB from './DB/connection.js';

const app = express();
const PORT= process.env.PORT||3000;
initApp(app,express);
connectDB();
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
