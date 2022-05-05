import express, { json } from "express";
import { MongoClient } from "mongodb";
import Joi from "joi";
import cors from "cors";
import { stripHtml } from "string-strip-html";
import dotenv from "dotenv";
import chalk from "chalk";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

const dbName = process.env.DATABASE_NAME;
const mongoClient = new MongoClient(process.env.MONGO_URL);
mongoClient.connect();
const db = mongoClient.db(dbName);
console.log(chalk.green.bold(`\nConnection with database ${chalk.blue.bold(`${db.s.namespace}`)} stablished! \n`));



const port = process.env.PORT;
app.listen(port, () => console.log(chalk.white.bold.bgGreenBright(`\n Application is online, using port ${port}... \n`)));