import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/User.js";
import { hashCompare, hashPassword } from "../utils/hash.js";
import { createToken } from "../utils/jwt.js";
import dotenv from "dotenv"

import { loginValidate, registerValidate } from "./validate.js";
import { getAllCommonUsers, getEventsByUser } from "../models/pipelines.js";

export class UserController {


    async register(req: Request, res: Response) {

        try {


            const { error } = registerValidate(req.body);
            if (error) return res.status(400).send(error.message);

            let findUser = await User.findOne({ "email": req.body.email })

            if (findUser) return res.status(400).send("email already exists")
            else {

                const hashPass = await hashPassword(req.body.password)
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    cpf: req.body.cpf,
                    contaSicoob: req.body.contaSicoob,
                    password: hashPass,

                })

                const userSaved = await user.save();
                const { password, ...userResponse } = userSaved.toObject();
                // Return the user object without the password
                res.status(201).send(userResponse)
            }
        } catch (error: any) {
            res.status(400).json({
                "error": "400",
                "message": error.message, // Aqui o erro vai aparecer no seu Postman/Insomnia
                "stack": error.name // Diz se o erro é 'ValidationError', 'MongoError', etc.
            });
        }
    }


    async login(req: Request, res: Response) {

        try {


            const { error } = loginValidate(req.body);
            if (error) return res.status(400).send(error.message);

            let findUser = await User.findOne({ "email": req.body.email })
            if (!findUser) return res.status(400).send("login falid: user not find")

            const passUser: boolean = await hashCompare(req.body.password, findUser.password)
            if (!passUser) return res.status(400).send("incorret email or password")

            if (!process.env.TOKEN_SECRET) return
            const token = createToken(
                { name: findUser.name, id: findUser.id, email: findUser.email, admin: findUser.admin },
                process.env.TOKEN_SECRET
            );
            res.header("Authorization", token).send({ message: "User logged", token });

        } catch (error: any) {
            res.status(400).json({
                "error": "400",
                "message": error.message, // Aqui o erro vai aparecer no seu Postman/Insomnia
                "stack": error.name // Diz se o erro é 'ValidationError', 'MongoError', etc.
            });
        }
    }
    

    async myEvents(req: Request, res: Response) {
        try {


            res.status(200).json(await getEventsByUser(req.user.id))
        } catch (erro) {
            res.status(400).send("User not Find")
        }
    }

    listAll = async (req: Request, res: Response) => {
        try {

            const email = req.user.email

            const users = await getAllCommonUsers(email)

            res.status(200).json(users);
        } catch (error) {
            res.status(500).send("Error fetching users");
        }
    }

}


