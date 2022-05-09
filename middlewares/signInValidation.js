import db from "../db.js";

import { stripHtml } from "string-strip-html";
import joi from "joi";
import bcrypt from 'bcrypt';

export async function signInValidation(req, res, next){
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
    
    try{
        const thereIsUser = await db.collection("users").findOne({ email });
        if (!thereIsUser) return res.status(404).send("User was not found!");
        
        const isPasswordValid = bcrypt.compareSync(password, thereIsUser.password);
        if (!isPasswordValid) return res.sendStatus(401);
        
        res.locals.user = thereIsUser;
        
        next();
    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
}