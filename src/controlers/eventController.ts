import { type Request, type Response, type NextFunction } from "express";
import { Event } from "../models/Event.js";
import { Link } from "../models/Link.js";
import dotenv from "dotenv"
//dotenv.config()

import { loginValidate, registerValidate, registerValidateEvent, registerValidateLinkEvent } from "./validate.js";
import { getUsersByEvent, listEvents } from "../models/pipelines.js";






export class EventController {


    async registerEvent(req: Request, res: Response) {

        try {

            const userID = req.user.id

            const { error } = registerValidateEvent(req.body);
            if (error) return res.status(400).send(error.message);
            const event = new Event({
                title: req.body.title,
                description: req.body.description,
                local: req.body.local,
                date: req.body.date,
                capacity: req.body.capacity,
                organizerId: userID
            })


            const eventSaved = await event.save();
            res.status(201).send("Evento salvo")

        } catch (error:any) {
            res.status(400).json({
                "error": "400",
                "mensage": error.mensage
            })

        }

    }

    async linkEvent(req: Request, res: Response) {

        try {

            const { error } = registerValidateLinkEvent(req.body);
            if (error) return res.status(400).send(error.message);

            const userID = req.user.id;
            const eventID = req.params.eventID as string;


            const jaInscrito = await Link.findOne({ eventID, userID } as any);
            if (jaInscrito) return res.status(400).send("Você já está inscrito!");

            const link = new Link({
                eventID: eventID,
                userID: userID,
            });
            const linkSaved = await link.save();

            if (linkSaved) {
                await Event.updateOne(
                    { _id: eventID },
                    { $inc: { participantsCount: 1 } }
                );
            }

            res.status(201).send(linkSaved);

        } catch (error) {
            console.error(error); // Importante para você ver o erro real no console
            res.status(400).json({
                "error": "400",
                "message": "bad request"
            });
        }
    }

    listAll = async (req: Request, res: Response) => {
        try {
            const events = await listEvents()
            res.status(200).json(events)
        } catch (error) {
            res.status(500).send("Error fetching events");
        }
    }

    listUserEvents = async (req: Request, res: Response) => {
        try {
            const eventID:string = req.params.eventID as string
            const users = await getUsersByEvent(eventID)
            res.status(200).json(users)
        } catch (error) {
            res.status(500).send("Error fetching events");
        }
    }


}


