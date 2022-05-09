import { Router } from "express";
import { signUpUser, signInUser } from "../controllers/usersController.js";

import { signUpValidation } from "../middlewares/signUpValidation.js";
import { signInValidation } from "../middlewares/signInValidation.js";

const usersRouter = Router();

usersRouter.post("/sign-up", signUpValidation, signUpUser);
usersRouter.post("/sign-in", signInValidation, signInUser);

export default usersRouter