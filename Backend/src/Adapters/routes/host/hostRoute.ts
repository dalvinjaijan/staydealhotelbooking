import express from "express";
import { hostRepository } from "../../../repositories/hostRepository";
import { hostInteractor } from "../../../Interactors/hostInteractor";
import { hostController } from "../../controllers/host/hostController";
import upload from "../../../Utils/multer";
import ChatRepo from "../../../repositories/chatRepository";
import ChatInteractor from "../../../Interactors/chatInteractor";
import { verifyAccessToken, verifyRole } from "../../middlewares/verifyToken";

const hostRouter=express.Router()

const chatrepo = new ChatRepo();
const chatinteractor = new ChatInteractor(chatrepo);
const repository=new hostRepository()
const interactor=new  hostInteractor(repository)
const controller=new hostController(interactor,chatinteractor)


hostRouter.post('/register',controller.registerHost.bind(controller))
hostRouter.post('/verifyOtp',controller.verifyOtp.bind(controller))
hostRouter.post('/login',controller.login.bind(controller))
hostRouter.post('/logout',controller.logout.bind(controller))
hostRouter.post('/addHotel',verifyAccessToken('host'),verifyRole(['host']),upload.any(),controller.addHotel.bind(controller))
hostRouter.get('/hotels',verifyAccessToken('host'),verifyRole(['host']),controller.fetchHotels.bind(controller))
hostRouter.post('/editHotelDetails',verifyAccessToken('host'),verifyRole(['host']),controller.editHotelDetails.bind(controller))
hostRouter.get('/hostProfile',verifyAccessToken('host'),verifyRole(['host']),controller.hostProfile.bind(controller))
hostRouter.get('/wallet-transactions',verifyAccessToken('host'),verifyRole(['host']),controller.viewWalletTransactions.bind(controller))
hostRouter.get('/fetchReport',verifyAccessToken('host'),verifyRole(['host']),controller.fetchReport.bind(controller))
hostRouter.get('/piechartReport',verifyAccessToken('host'),verifyRole(['host']),controller.fetchPieReport.bind(controller))
hostRouter.get('/reservations',verifyAccessToken('host'),verifyRole(['host']),controller.fetchReservations.bind(controller))



hostRouter.get(
    "/getchatid/:hostId/:userid",
    controller.getChatId.bind(controller)
);
hostRouter.get(
    "/getonetonechat/:chatid",
    controller.getOneToneChat.bind(controller)
);
hostRouter.get(
    "/notificationCounterUpdater/:id",
    controller.notificationCountUpdater.bind(
        controller
    )  
);
hostRouter.get(   
    "/notificationGetter/:id",
    controller.notificationGetter.bind(controller)
);




export default hostRouter