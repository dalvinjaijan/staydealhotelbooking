"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../../controllers/admin/adminController");
const adminRepository_1 = require("../../../repositories/adminRepository");
const adminInteractor_1 = require("../../../Interactors/adminInteractor");
const verifyToken_1 = require("../../middlewares/verifyToken");
const adminRouter = express_1.default.Router();
const repository = new adminRepository_1.adminRepository();
const interactor = new adminInteractor_1.adminInteractor(repository);
const controller = new adminController_1.adminController(interactor);
adminRouter.post('/login', controller.login.bind(controller));
adminRouter.post('/logout', controller.logout.bind(controller));
adminRouter.get('/getHotelRequest', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchHotelRequests.bind(controller));
adminRouter.patch('/approveHotelRequest', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.approveHotelRequest.bind(controller));
adminRouter.get('/getApprovedHotels', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchApprovedHotel.bind(controller));
adminRouter.patch('/blockHotel', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.blockHotel.bind(controller));
adminRouter.get('/getRejectedHotels', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchRejectedHotel.bind(controller));
adminRouter.get('/fetchUsers', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchUsers.bind(controller));
adminRouter.patch('/blockUser', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.blockUser.bind(controller));
adminRouter.patch('/unBlockUser', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.unBlockUser.bind(controller));
adminRouter.get('/getEditedHotelsRequest', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.getEditedHotelsRequest.bind(controller));
adminRouter.patch('/rejectHotelEditRequest', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.rejectEditHotelsRequest.bind(controller));
adminRouter.patch('/approveEditHotelRequest', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.approveEditHotelsRequest.bind(controller));
adminRouter.get('/walletDetails', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.walletDetails.bind(controller));
//dashboard
adminRouter.get('/fetchReport', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchReport.bind(controller));
adminRouter.get('/fetchComplaints', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchComplaints.bind(controller));
//coupon
adminRouter.post('/addCoupons', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.addCoupon.bind(controller));
adminRouter.get('/fetchCoupons', (0, verifyToken_1.verifyAccessToken)('admin'), (0, verifyToken_1.verifyRole)(['admin']), controller.fetchCoupon.bind(controller));
exports.default = adminRouter;
