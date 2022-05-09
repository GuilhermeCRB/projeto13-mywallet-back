import { Router } from "express";
import { signUpUser, signInUser } from "../controllers/usersController.js";

import { signUpValidation, signInValidation } from "../middlewares/usersMiddlewares.js";

const usersRouter = Router();

usersRouter.post("/sign-up", signUpValidation, signUpUser);
usersRouter.post("/sign-in", signInValidation, signInUser);

export default usersRouter