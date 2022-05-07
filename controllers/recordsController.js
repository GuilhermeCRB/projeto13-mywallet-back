import db from "./../db.js";

import joi from "joi";
import chalk from "chalk";

export async function recordInput(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("Must send a token.");

    try {
        const isThereSession = await db.collection("sessions").findOne({ token });
        if (!isThereSession) return res.status(401).send("Token is invalid.");

        const session = isThereSession;
        const user = await db.collection("users").findOne({ _id: session.userId });
        if (!user) return res.status(404).send("User not found");

    } catch (error) {
        console.log(chalk.red.bold("Error when checking token: \n"), error);
        res.status(500).send("Error when checking token.");
    }

    // const inputSchema = joi.object({
    //     value: joi.number().required(), //TODO: set format ...000.00
    //     description: joi.string().required()
    // });

    try {
        console.log(1);
    } catch (e) {
        console.log(e);
    }
}