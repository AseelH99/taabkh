import { Router } from "express";
import * as mealController from './meal.controller.js'
import fileUpload,{ fileValidation } from "../../../services/multer.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { endPoint } from "./meal.endpoint.js";
import { auth } from "../../middleware/auth.js";
const router= Router();
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),asyncHandler(mealController.createMeal));
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),asyncHandler(mealController.updateMeal));
router.get('/:id',auth(endPoint.spesific),asyncHandler(mealController.getSpicificMeal));
router.get('/mealswithcat/:categoryId',asyncHandler(mealController.getmealWithCategory));
router.get('/',asyncHandler(mealController.getAll));
export default router;