import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import usersRouter from "./routes/usersRouter.js";
import recordsRouter from "./routes/recordsRouter.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(json());

app.use(usersRouter);
app.use(recordsRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(chalk.white.bold.bgGreenBright(`\n Application is online, using port ${port}... \n`)));