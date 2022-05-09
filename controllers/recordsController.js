import db from "./../db.js";

import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";
import joi from "joi";
import dayjs from "dayjs";
import chalk from "chalk";

export async function recordInput(req, res) {
    const { authorization } = req.headers;
    const { userId } = req.params;
    const input = req.body;

    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("Must send a token.");

    try {
        const isThereSession = await db.collection("sessions").findOne({ token });
        if (!isThereSession) return res.status(401).send("Token is invalid.");

        const user = await db.collection("users").findOne({ _id: ObjectId(userId) });
        if (!user) return res.status(404).send("User not found");

    } catch (error) {
        console.log(chalk.red.bold("Error when checking token or user: \n"), error);
        return res.status(500).send("Error when checking token or user.");
    }

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

    const { type, value, description, date } = sanitizedInput;
    try {
        await db.collection(`inputs_from_${userId}`).insertOne(
            {
                type,
                value,
                description,
                date: new dayjs().format("DD/MM")
            }
        );
        res.status(201).send(`${type} created!`);
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function getInputs(req, res) {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("Must send a token.");

    try {
        const isThereSession = await db.collection("sessions").findOne({ token });
        if (!isThereSession) return res.status(401).send("Token is invalid.");

        const user = await db.collection("users").findOne({ _id: ObjectId(userId) });
        if (!user) return res.status(404).send("User not found");

    } catch (error) {
        console.log(chalk.red.bold("Error when checking token or user: \n"), error);
        return res.status(500).send("Error when checking token or user.");
    }

    try {
        const inputsList = await db.collection(`inputs_from_${userId}`).find().toArray();
        res.status(200).send(inputsList);
    }catch(e){
        res.status(500).send(e);
    }

}