import db from "../db.js";

import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

export async function signUpUser(req, res) {
    const { name, email, password } = res.locals.user;
    try {
        await db.collection("users").insertOne({ name, email, password: bcrypt.hashSync(password, 10) });
        res.status(201).send("Successfully signed up!");
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function signInUser(req, res) {
    const { _id, name } = res.locals.user;
    try {
        const token = uuid();
        await db.collection("sessions").insertOne({ userId: _id, token });
        res.status(200).send({ token, userId: _id, userName: name });
    } catch (e) {
        res.status(500).send(e);
    }
}