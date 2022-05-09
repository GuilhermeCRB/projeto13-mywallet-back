import db from "../db.js";

import { stripHtml } from "string-strip-html";
import { ObjectId } from "mongodb";
import chalk from "chalk";
import joi from "joi";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("Must send a token.");

    try {
        const isThereSession = await db.collection("sessions").findOne({ token });
        if (!isThereSession) return res.status(401).send("Token is invalid.");

        const user = await db.collection("users").findOne({ _id: ObjectId(userId) });
        if (!user) return res.status(404).send("User not found");

        res.locals.userId = userId;

        next();
    } catch (error) {
        console.log(chalk.red.bold("Error when checking token or user: \n"), error);
        return res.status(500).send("Error when checking token or user.");
    }
}

export function validateInput(req, res, next) {
    const input = req.body;

    const inputSchema = joi.object({
        type: joi.string().required(),
        value: joi.string().pattern(new RegExp('^[0-9]{1,},[0-9]{2}$')).required(),
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

    res.locals.input = sanitizedInput;

    next();
}