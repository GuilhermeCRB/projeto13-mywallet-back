import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

let db = null;
try {
  const mongoClient = new MongoClient(process.env.MONGO_URL);
  await mongoClient.connect();
  db = mongoClient.db(process.env.DATABASE_NAME);
  console.log(chalk.green.bold(`\nConnection with database ${chalk.blue.bold(`${db.s.namespace}`)} stablished! \n`));
} catch(e) {
    console.log(chalk.red.bold(`\nWARNING: connection with database ${chalk.blue.bold(`${db.s.namespace}`)} failed! \nError: \n`), e);
}

export default db;