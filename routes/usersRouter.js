import { Router } from "express";
import { signUpUser } from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.post("/user", signUpUser);

export default usersRouter; 