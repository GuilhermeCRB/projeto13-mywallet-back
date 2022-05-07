import db from "./../db.js";

import joi from "joi";
import chalk from "chalk";

export async function recordInput(req, res) {
    const { authorization } = req.headers;
    const input = req.body;

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

    const inputSchema = joi.object({
        type: joi.string().required(),
        value: joi.number().required(), //TODO: set format ...000.00
        description: joi.string().required()
    });

    const validation = inputSchema.validate(input);
    if (validation.error) return res.status(422).send(validation.error.details);

    const sanitizedInput = {
        ...input,
        type: stripHtml(input.type).result,
        value: stripHtml(input.value).result,
        description: stripHtml(input.description).result,
    }

    const { type, value, description } = sanitizedInput;
    try {
        console.log(1);
    } catch (e) {
        res.status(500).send(e);
    }
}