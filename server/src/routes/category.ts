import { Router } from "express";
import { createCategory, getAllCategory } from "../controllers/categoryController";
import { updateAiContentValue,  updateCategoryValue } from "../controllers/categoryValueController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post('/', createCategory)
router.post('/value/:id', authenticateToken, updateAiContentValue)
router.put('/value/:id', authenticateToken, updateCategoryValue)
router.get('/', getAllCategory)


export default router;