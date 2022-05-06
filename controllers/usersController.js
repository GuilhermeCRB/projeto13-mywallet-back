import db from "../db.js";

export async function signUpUser(req, res) {
    const { name, email, password } = req.body;

    try {
        await db.collection("users").insertOne({ name, email, password });
        res.status(201).send("User was successfully signed up!");
    } catch (e) {
        res.status(500).send(e);
    }
}