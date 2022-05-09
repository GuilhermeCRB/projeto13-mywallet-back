import { Router } from "express";
import { getInputs, recordInput } from "../controllers/recordsController.js";

import { validateInput, validateToken } from "../middlewares/recordsMiddlewares.js";

const recordsRouter = Router();

recordsRouter.post("/add-records/:userId", validateToken, validateInput, recordInput);
recordsRouter.get("/records/:userId", validateToken, getInputs);

export default recordsRouter;