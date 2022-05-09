import db from "../db.js";

import joi from "joi";
import { stripHtml } from "string-strip-html";

export async function signUpValidation(req, res, next){
    const user = req.body;
    
    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().required(),
        repeat_password: joi.ref('password'),
    });
    
    const validation = userSchema.validate(user);
    
    const sanitizedUser = {
        ...user,
        name: stripHtml(user.name).result,
        email: stripHtml(user.email).result,
        password: stripHtml(user.password).result,
        repeat_password: stripHtml(user.repeat_password).result,
    }
    
    const { email } = sanitizedUser;
    
    if (validation.error) return res.status(422).send("Input is invalid!");
    
    try{
        const thereIsUser = await db.collection("users").findOne({ email });
        if (thereIsUser) return res.status(409).send("E-mail is already in use, please try a different one!");
        
        res.locals.user = sanitizedUser;
        
        next();
    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
}