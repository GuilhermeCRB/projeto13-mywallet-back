import { Router } from "express";
import { signUpUser, signInUser } from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.post("/sign-up", signUpUser);
usersRouter.post("/sign-in", signInUser);

export default usersRouter;