"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/user/userController");
const userInteractor_1 = require("../../../Interactors/userInteractor");
const userRepository_1 = require("../../../repositories/userRepository");
const otp_expire_handler_1 = require("../../middlewares/otp-expire-handler");
const verifyToken_1 = require("../../middlewares/verifyToken");
const multer_1 = __importDefault(require("../../../Utils/multer"));
const chatRepository_1 = __importDefault(require("../../../repositories/chatRepository"));
const chatInteractor_1 = __importDefault(require("../../../Interactors/chatInteractor"));
const userRouter = express_1.default.Router();
const chatrepo = new chatRepository_1.default();
const chatinteractor = new chatInteractor_1.default(chatrepo);
const repository = new userRepository_1.userRepository();
const interactor = new userInteractor_1.userInteractor(repository);
const controller = new userController_1.userController(interactor, chatinteractor);
userRouter.post('/login/:type', controller.authenticateUser.bind(controller));
userRouter.post('/verifyOtp', otp_expire_handler_1.otpValidator.validateUserOtp, controller.verifyOtp.bind(controller));
userRouter.post('/logout', controller.logout.bind(controller));
userRouter.post('/profile', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.profile.bind(controller));
userRouter.put('/editProfile', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), multer_1.default.single('profileImage'), controller.editProfile.bind(controller));
userRouter.get('/fetchHotels', controller.getHotels.bind(controller));
userRouter.post('/filterHotels', controller.filterHotels.bind(controller));
userRouter.post('/searchHotel', controller.searchHotel.bind(controller));
userRouter.post('/changeBookingDetails', controller.changeBookingDetails.bind(controller));
userRouter.post('/create-checkout-session', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.createPayment.bind(controller));
userRouter.post('/bookRoom', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.bookRoom.bind(controller));
userRouter.get('/myBooking', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.myBooking.bind(controller));
userRouter.patch('/cancelBooking', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.cancelBooking.bind(controller));
userRouter.get('/wallet-transactions', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.viewWalletTransactions.bind(controller));
userRouter.post('/rating', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.ratingAndReview.bind(controller));
userRouter.post('/reportHotel', (0, verifyToken_1.verifyAccessToken)('user'), (0, verifyToken_1.verifyRole)(['user']), controller.reportHotel.bind(controller));
userRouter.get('/coupons', controller.fetchCoupon.bind(controller));
userRouter.post('/applyCoupon', controller.applyCoupon.bind(controller));
userRouter.get('/topRatedProperties', controller.fetchTopRatedHotels.bind(controller));
userRouter.get("/getChatId/:hostId/:userId", controller.getChatId.bind(controller));
userRouter.get("/getchatofOneToOne/:chatId/:whoWantsData", controller.getChatOfOneToOne.bind(controller));
userRouter.get("/getchat/:whom/:id", controller.fetchChat.bind(controller));
userRouter.post("/newmessage", controller.addMessage.bind(controller));
// userRouter.get(
//   "/notificationUpdater/:id",
//   controller.notificationCountUpdater.bind(controller)
// );
// userRouter.get(
//   "/notificationGetter/:id",
//   controller.notificationGetter.bind(controller)
// );
exports.default = userRouter;
