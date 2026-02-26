import { Link } from "./Link.js"
import { Event } from "./Event.js"
import { Types } from "mongoose"
import { response } from "express"
import { User } from "./User.js"


export async function getUsersByEvent(eventID: string) {

    const pipeline = [{
        $match: {
            eventID: new Types.ObjectId(eventID)
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "userID",
            foreignField: "_id",
            as: "usuario_detalhes"
        }
    },
    { $unwind: "$usuario_detalhes" },
    {
        $project: {
            _id: 0, // Remove o ID do link (opcional)
            dataInscricao: "$subscribedAt", // Pega o valor do link
            nome: "$usuario_detalhes.name",
            email: "$usuario_detalhes.email",
            telefone: "$usuario_detalhes.phone",
            constSicoob: "$usuario_detalhes.contaSicoob"
        }
    }
    ]
    return await Link.aggregate(pipeline)
}

export async function getEventsByUser(userID: string) {

    const pipeline = [
        {
            $match: {
                userID: new Types.ObjectId(userID)
            }
        },
        {
            $lookup: {
                from: "events",
                localField: "eventID",
                foreignField: "_id",
                as: "event_detalhes"
            }
        },
        { $unwind: "$event_detalhes" },
        {
            $project: {
                _id: 0,
                dataDaInscricao: "$subscribedAt",
                evento: "$event_detalhes.title",
                dataDoEvento: "$event_detalhes.date"
            }
        }
    ]
    return await Link.aggregate(pipeline)
}

export async function getAllCommonUsers(emailLogado: string) {
    return await User.find({

        admin: { $ne: true },           // Onde admin não é true
        email: { $ne: emailLogado }     // Onde o email é diferente do meu
    })
        .select({
            _id:0,
            password: 0,
            cpf:0,
            admin: 0,
            __v: 0,
            creatAt: 0
        })
}

export async function listEvents() {
    return await Event.find({})
        .select({
            _id:0,
            organizerId:0,
            __v:0
        })
}