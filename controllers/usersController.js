import db from "../db.js";

import { stripHtml } from "string-strip-html";
import joi from "joi";
import bcrypt from 'bcrypt';
import {v4 as uuid} from "uuid";

export async function signUpUser(req, res) {
    const user = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().required(),
        repeat_password: joi.ref('password'),
    });
    
    const validation = userSchema.validate(user);
    if (validation.error) return res.status(422).send("Input is invalid!");
    
    const sanitizedUser = {
        ...user,
        name: stripHtml(user.name).result,
        email: stripHtml(user.email).result,
        password: stripHtml(user.password).result,
        repeat_password: stripHtml(user.repeat_password).result,
    }
    
    const { name, email, password } = sanitizedUser;
    // const { name, email, password } = user;
    try {
        const thereIsUser = await db.collection("users").findOne({ email });
        if (thereIsUser) return res.status(409).send("E-mail is already in use, please try a different one!");

        await db.collection("users").insertOne({ name, email, password: bcrypt.hashSync(password, 10) });
        res.status(201).send("Successfully signed up!");
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function signInUser(req, res) {
    const user = req.body;

    const userSchema = joi.object({
        email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().required()
    });

    const validation = userSchema.validate(user);
    if (validation.error) return res.status(422).send(validation.error.details);

    const sanitizedUser = {
        ...user,
        email: stripHtml(user.email).result,
        password: stripHtml(user.password).result
    }

    const { email, password } = sanitizedUser;
    try {
        const thereIsUser = await db.collection("users").findOne({ email });
        if (!thereIsUser) return res.status(404).send("User was not found!");

        const isPasswordValid = bcrypt.compareSync(password, thereIsUser.password);
        if (!isPasswordValid) return res.sendStatus(401);

        const token = uuid();
        const user = thereIsUser;
        await db.collection("sessions").insertOne({ userId: user._id, token });
        res.status(200).send({token, userId: user._id, userName: user.name});
    } catch (e) {
        res.status(500).send(e);
    }
}