import express from "express"
import { EventController } from "../controlers/eventController.js";
import { AuthController } from "../controlers/authController.js";



const router = express.Router()


const authController = new AuthController()
const eventController = new EventController();

router.post("/register",
    authController.auth.bind(authController),
    authController.authAdmin.bind(authController),
    eventController.registerEvent.bind(eventController)
)

router.post("/:eventID/link",
    authController.auth.bind(authController),
    eventController.linkEvent.bind(eventController)
);


router.get("/:eventID/users",
    authController.auth.bind(authController),
    authController.authAdmin.bind(authController),
    eventController.listUserEvents.bind(eventController)
)

router.get("/",
    eventController.listAll.bind(eventController)
)

router.get("/where/:eventID",
    authController.auth.bind(authController),
    eventController.listEventByID.bind(eventController)

)



export default router