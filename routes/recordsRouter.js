import { Router } from "express";
import { getInputs, recordInput } from "../controllers/recordsController.js";

const recordsRouter = Router();

recordsRouter.post("/add-records/:userId", recordInput);
recordsRouter.get("/records/:userId", getInputs);

export default recordsRouter;