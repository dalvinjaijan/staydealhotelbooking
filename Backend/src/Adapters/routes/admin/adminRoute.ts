import express from "express";
import { adminController } from "../../controllers/admin/adminController";
import { adminRepository } from "../../../repositories/adminRepository";
import { adminInteractor } from "../../../Interactors/adminInteractor";

const adminRouter=express.Router()

const repository=new adminRepository() 
const interactor=new adminInteractor(repository)
const controller=new adminController(interactor)

adminRouter.post('/login',controller.login.bind(controller))
adminRouter.post('/logout',controller.logout.bind(controller))
adminRouter.get('/getHotelRequest',controller.fetchHotelRequests.bind(controller))
adminRouter.patch('/approveHotelRequest',controller.approveHotelRequest.bind(controller))
adminRouter.get('/getApprovedHotels',controller.fetchApprovedHotel.bind(controller))
adminRouter.patch('/blockHotel',controller.blockHotel.bind(controller))
adminRouter.get('/getRejectedHotels',controller.fetchRejectedHotel.bind(controller))
adminRouter.get('/fetchUsers',controller.fetchUsers.bind(controller))
adminRouter.patch('/blockUser',controller.blockUser.bind(controller))
adminRouter.patch('/unBlockUser',controller.unBlockUser.bind(controller))
adminRouter.get('/getEditedHotelsRequest',controller.getEditedHotelsRequest.bind(controller))
adminRouter.patch('/rejectHotelEditRequest',controller.rejectEditHotelsRequest.bind(controller))
adminRouter.patch('/approveEditHotelRequest',controller.approveEditHotelsRequest.bind(controller))




export default adminRouter