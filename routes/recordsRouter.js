import { Router } from "express";
import { recordInput } from "../controllers/recordsController.js";

const recordsRouter = Router();

recordsRouter.post("/add-records/:userId", recordInput);

export default recordsRouter;