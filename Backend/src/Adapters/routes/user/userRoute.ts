import express from 'express'
import {userController } from '../../controllers/user/userController';
import { userInteractor } from '../../../Interactors/userInteractor';
import { userRepository } from '../../../repositories/userRepository';
import { otpValidator } from '../../middlewares/otp-expire-handler';
import { verifyAccessToken } from '../../middlewares/verifyToken';
import upload from '../../../Utils/multer';
const userRouter =express.Router()

const repository=new userRepository()
const interactor=new userInteractor(repository)
const controller=new userController(interactor)

userRouter.post('/login/:type',controller.authenticateUser.bind(controller) );
userRouter.post('/verifyOtp',otpValidator.validateUserOtp,controller.verifyOtp.bind(controller))
userRouter.post('/logout',controller.logout.bind(controller))
userRouter.post('/profile',verifyAccessToken,controller.profile.bind(controller))
userRouter.put('/editProfile',verifyAccessToken,upload.single('profileImage'),controller.editProfile.bind(controller))
userRouter.post('/fetchHotels',controller.getHotels.bind(controller))
userRouter.post('/filterHotels',controller.filterHotels.bind(controller))




  
export default userRouter