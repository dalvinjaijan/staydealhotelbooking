import express from "express";
import { adminController } from "../../controllers/admin/adminController";
import { adminRepository } from "../../../repositories/adminRepository";
import { adminInteractor } from "../../../Interactors/adminInteractor";
import { verifyAccessToken, verifyRole } from "../../middlewares/verifyToken";

const adminRouter=express.Router()

const repository=new adminRepository() 
const interactor=new adminInteractor(repository)
const controller=new adminController(interactor)

adminRouter.post('/login',controller.login.bind(controller))
adminRouter.post('/logout',controller.logout.bind(controller))
adminRouter.get('/getHotelRequest',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchHotelRequests.bind(controller))
adminRouter.patch('/approveHotelRequest',verifyAccessToken('admin'),verifyRole(['admin']),controller.approveHotelRequest.bind(controller))
adminRouter.get('/getApprovedHotels',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchApprovedHotel.bind(controller))
adminRouter.patch('/blockHotel',verifyAccessToken('admin'),verifyRole(['admin']),controller.blockHotel.bind(controller))
adminRouter.get('/getRejectedHotels',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchRejectedHotel.bind(controller))
adminRouter.get('/fetchUsers',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchUsers.bind(controller))
adminRouter.patch('/blockUser',verifyAccessToken('admin'),verifyRole(['admin']),controller.blockUser.bind(controller))
adminRouter.patch('/unBlockUser',verifyAccessToken('admin'),verifyRole(['admin']),controller.unBlockUser.bind(controller))
adminRouter.get('/getEditedHotelsRequest',verifyAccessToken('admin'),verifyRole(['admin']),controller.getEditedHotelsRequest.bind(controller))
adminRouter.patch('/rejectHotelEditRequest',verifyAccessToken('admin'),verifyRole(['admin']),controller.rejectEditHotelsRequest.bind(controller))
adminRouter.patch('/approveEditHotelRequest',verifyAccessToken('admin'),verifyRole(['admin']),controller.approveEditHotelsRequest.bind(controller))
adminRouter.get('/walletDetails',verifyAccessToken('admin'),verifyRole(['admin']),controller.walletDetails.bind(controller))

//dashboard
adminRouter.get('/fetchReport',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchReport.bind(controller))

adminRouter.get('/fetchComplaints',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchComplaints.bind(controller))

//coupon
adminRouter.post('/addCoupons',verifyAccessToken('admin'),verifyRole(['admin']),controller.addCoupon.bind(controller))
adminRouter.get('/fetchCoupons',verifyAccessToken('admin'),verifyRole(['admin']),controller.fetchCoupon.bind(controller))







export default adminRouter