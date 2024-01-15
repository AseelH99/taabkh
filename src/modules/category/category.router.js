import { Router } from "express";
import * as categoryController from './category.controller.js';
import { asyncHandler } from "../../../services/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./category.endpoint.js";
import fileUpload,{ fileValidation } from "../../../services/multer.js";

const router=Router();
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),
asyncHandler(categoryController.createCategory));
router.get('/:id',auth(endPoint.spesific),asyncHandler(categoryController.getSpicificCategory));
router.get('/',auth(endPoint.getAll),asyncHandler(categoryController.getCategories));
router.get('/active',asyncHandler(categoryController.getActive));
router.delete('/:categoryId',auth(endPoint.delete),asyncHandler(categoryController.deleteCategory));
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),asyncHandler(categoryController.updateCategory))
export default router;
