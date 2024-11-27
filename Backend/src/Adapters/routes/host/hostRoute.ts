import express from "express";
import { hostRepository } from "../../../repositories/hostRepository";
import { hostInteractor } from "../../../Interactors/hostInteractor";
import { hostController } from "../../controllers/host/hostController";
import upload from "../../../Utils/multer";

const hostRouter=express.Router()

const repository=new hostRepository()
const interactor=new  hostInteractor(repository)
const controller=new hostController(interactor)

hostRouter.post('/register',controller.registerHost.bind(controller))
hostRouter.post('/verifyOtp',controller.verifyOtp.bind(controller))
hostRouter.post('/login',controller.login.bind(controller))
hostRouter.post('/logout',controller.logout.bind(controller))
hostRouter.post('/addHotel',upload.any(),controller.addHotel.bind(controller))
hostRouter.get('/hotels',controller.fetchHotels.bind(controller))
hostRouter.post('/editHotelDetails',controller.editHotelDetails.bind(controller))









export default hostRouter