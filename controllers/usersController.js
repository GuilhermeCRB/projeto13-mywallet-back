import db from "../db.js";

import { stripHtml } from "string-strip-html";
import joi from "joi";

export async function signUpUser(req, res) {
    const user = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().required(),
        repeat_password: joi.ref('password'),
    });
    
    const validation = userSchema.validate(sanitizedUser);
    if (validation.error) {
        res.status(422).send(validation.error.details);
        return;
    }
    
    const sanitizedUser = {
        ...user,
        name: stripHtml(user.name).result,
        email: stripHtml(user.email).result,
        password: stripHtml(user.password).result,
        repeat_password: stripHtml(user.repeat_password).result,
    }
    
    const { name, email, password } = sanitizedUser;
    try {
        const thereIsUser = await db.collection("users").findOne({ email });
        if (thereIsUser) {
            res.status(409).send("E-mail is already in use, please try a different one!");
            return;
        }

        await db.collection("users").insertOne({ name, email, password });
        res.status(201).send("Successfully signed up!");
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function signInUser(req, res) {
    const user = req.body;
    const { email, password } = user;

    try {
        const thereIsUser = await db.collection("users").findOne({ email });
        if (!thereIsUser) {
            res.status(404).send("User was not found!");
            return;
        }

        if (thereIsUser.password !== password) {
            res.sendStatus(401);
            return;
        }

        await db.collection("signed-in").insertOne({ email, password });
        res.status(200).send(thereIsUser.name);
    } catch (e) {
        res.status(500).send(e);
    }
}