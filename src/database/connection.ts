import mongoose from "mongoose";
import dotenv from "dotenv"

export async function connection() {

    const user = process.env.user_db;
    const pwd = process.env.pwd_db;
    const url = process.env.connection_string;

    if (!user || !pwd || !url) {
        throw new Error("Variáveis de ambiente de conexão não configuradas!");
        
    }

    try {
        await mongoose.connect(url, {
            user: user,
            pass: pwd,
            dbName: "API",
            authSource:"admin",
            serverSelectionTimeoutMS: 5000, // tempo limite para selecionar servidor
            socketTimeoutMS: 45000,         // tempo limite de socket
            maxPoolSize: 10,                // número máximo de conexões no pool
            minPoolSize: 1,                 // número mínimo de conexões
            connectTimeoutMS: 30000      // tempo limite para conexão inicial
        })
        console.log("conectado to bd")
    } catch (erro) { console.log(erro) }

}





