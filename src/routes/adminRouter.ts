import  express from "express"
import { AuthController } from "../controlers/authController.js";
import { UserController } from "../controlers/userController.js";

const router = express.Router()
const authController = new AuthController()

const userController = new UserController()

// No seu arquivo de rotas
router.get("/getUsers", 
    authController.auth.bind(authController), 
    authController.authAdmin.bind(authController),
    userController.listAll.bind(userController) 
);

export default router