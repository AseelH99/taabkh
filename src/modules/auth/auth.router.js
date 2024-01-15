import { Router } from "express";
import * as authcontroller from'./auth.controller.js'
import fileUpload,{ fileValidation } from "../../../services/multer.js";
import { asyncHandler } from "../../../services/errorHandling.js";
const router= Router();
router.post('/singup',fileUpload(fileValidation.image).single('image'),asyncHandler(authcontroller.singup));
router.post('/singin',asyncHandler(authcontroller.singIn));
router.get('/confirmEmail/:token',asyncHandler(authcontroller.confirmEmail))
router.patch('/sendCode',asyncHandler(authcontroller.sendCode))
router.post('/forgetpassword',asyncHandler(authcontroller.forgetPassword))
export default router;