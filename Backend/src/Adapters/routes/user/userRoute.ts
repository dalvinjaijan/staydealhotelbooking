import express from 'express'
import {userController } from '../../controllers/user/userController';
import { userInteractor } from '../../../Interactors/userInteractor';
import { userRepository } from '../../../repositories/userRepository';
import { otpValidator } from '../../middlewares/otp-expire-handler';
import { verifyAccessToken, verifyRole } from '../../middlewares/verifyToken';
import upload from '../../../Utils/multer';
import ChatRepo from '../../../repositories/chatRepository';
import ChatInteractor from '../../../Interactors/chatInteractor';
const userRouter =express.Router()


const chatrepo = new ChatRepo();
const chatinteractor = new ChatInteractor(chatrepo)
const repository=new userRepository()
const interactor=new userInteractor(repository)
const controller=new userController(interactor,chatinteractor)

userRouter.post('/login/:type',controller.authenticateUser.bind(controller) );
userRouter.post('/verifyOtp',otpValidator.validateUserOtp,controller.verifyOtp.bind(controller))
userRouter.post('/logout',controller.logout.bind(controller))
userRouter.post('/profile',verifyAccessToken('user'),verifyRole(['user']),controller.profile.bind(controller))
userRouter.put('/editProfile',verifyAccessToken('user'),verifyRole(['user']),upload.single('profileImage'),controller.editProfile.bind(controller))
userRouter.get('/fetchHotels',controller.getHotels.bind(controller))
userRouter.post('/filterHotels',controller.filterHotels.bind(controller))
userRouter.post('/searchHotel',controller.searchHotel.bind(controller))
userRouter.post('/changeBookingDetails',controller.changeBookingDetails.bind(controller))
userRouter.post('/create-checkout-session',verifyAccessToken('user'),verifyRole(['user']),controller.createPayment.bind(controller))
userRouter.post('/bookRoom',verifyAccessToken('user'),verifyRole(['user']),controller.bookRoom.bind(controller))


userRouter.get('/myBooking',verifyAccessToken('user'),verifyRole(['user']),controller.myBooking.bind(controller))
userRouter.patch('/cancelBooking',verifyAccessToken('user'),verifyRole(['user']),controller.cancelBooking.bind(controller))

userRouter.get('/wallet-transactions',verifyAccessToken('user'),verifyRole(['user']),controller.viewWalletTransactions.bind(controller))
userRouter.post('/rating',verifyAccessToken('user'),verifyRole(['user']),controller.ratingAndReview.bind(controller))
userRouter.post('/reportHotel',verifyAccessToken('user'),verifyRole(['user']),controller.reportHotel.bind(controller))

userRouter.get(
    "/getChatId/:hostId/:userId",
    controller.getChatId.bind(controller)
  );
  userRouter.get(
    "/getchatofOneToOne/:chatId/:whoWantsData", 
    controller.getChatOfOneToOne.bind(controller)
  );
  userRouter.get(
    "/getchat/:whom/:id",
    controller.fetchChat.bind(controller)
  );
  userRouter.post(
    "/newmessage",
    controller.addMessage.bind(controller)
  );
  // userRouter.get(
  //   "/notificationUpdater/:id",
  //   controller.notificationCountUpdater.bind(controller)
  // );
  // userRouter.get(
  //   "/notificationGetter/:id",
  //   controller.notificationGetter.bind(controller)
  // );
  












  
export default userRouter