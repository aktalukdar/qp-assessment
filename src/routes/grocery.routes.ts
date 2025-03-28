import { Router } from "express";
import { addGrocery, getGroceries, updateGrocery, deleteGrocery, manageInventory } from "../controllers/grocery.controller";
import { checkAdmin } from '../middleware/role.middleware';

const router = Router();

router.post("/", checkAdmin, addGrocery); // Admin Only
router.get("/", getGroceries); // Both Admin & User
router.put("/:id", checkAdmin, updateGrocery); // Admin Only
router.delete("/:id", checkAdmin, deleteGrocery); // Admin Only
router.put("/:id/manage", checkAdmin, manageInventory); // Admin Only

export default router;
