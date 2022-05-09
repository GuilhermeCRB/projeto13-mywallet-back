import db from "./../db.js";

import dayjs from "dayjs";

export async function recordInput(req, res) {
    const { userId } = req.params;
    const { type, value, description, date } = res.locals.input;
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
    const { userId } = req.params;
    try {
        const inputsList = await db.collection(`inputs_from_${userId}`).find().toArray();
        res.status(200).send(inputsList);
    }catch(e){
        res.status(500).send(e);
    }

}