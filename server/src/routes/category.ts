import { Router } from "express";
import { createCategory, getAllCategory } from "../controllers/categoryController";
import { createCategoryValue } from "../controllers/categoryValueController";
import { authenticateToken } from "../middleware/auth";

const router = Router();


router.post('/', createCategory)
router.post('/value', authenticateToken, createCategoryValue)
router.get('/', getAllCategory)



export default router;