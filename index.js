import express, { json } from "express";
import { MongoClient } from "mongodb";
import Joi from "joi";
import cors from "cors";
import { stripHtml } from "string-strip-html";
import dotenv from "dotenv";
import chalk from "chalk";

import db from "./db.js";

import usersRouter from "./routes/usersRouter.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(json());

app.use(usersRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(chalk.white.bold.bgGreenBright(`\n Application is online, using port ${port}... \n`)));