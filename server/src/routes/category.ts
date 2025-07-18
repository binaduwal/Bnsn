import { Router } from "express";
import { createCategory, getAllCategory } from "../controllers/categoryController";

const router = Router();


router.post('/', createCategory)
router.get('/', getAllCategory)



export default router;