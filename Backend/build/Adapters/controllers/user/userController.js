"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const errorHandling_1 = require("../../middlewares/errorHandling");
const cloudinary_1 = __importDefault(require("../../../Utils/cloudinary"));
class userController {
    interactor;
    constructor(interactor) {
        this.interactor = interactor;
    }
    async authenticateUser(req, res, next) {
        try {
            const { email, type } = req.body;
            console.log(req.body, "email");
            if (type === 'google') {
                console.log("google");
            }
            else if (type === 'email') {
                const user = await this.interactor.getUserByEmail(email);
                // console.log("userrrr",user)
                if (user.isBlocked) {
                    const error = new errorHandling_1.customError("user is blocked", 401);
                    console.log("error to throw", error);
                    throw error;
                }
                const otp = await this.interactor.sendOtp(email);
                if (otp) {
                    req.session.userEmailOtp = otp;
                    req.session.userOtpTime = Date.now();
                    req.session.userEmail = email;
                    console.log(req.session.userOtpTime, "otp time");
                    res.status(200).json({ message: "OTP sent successfully" });
                }
                else {
                    throw new errorHandling_1.customError('failed to sent Otp', 500);
                }
            }
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { otp } = req.body;
            const email = req.session.userEmail || '';
            const sessionOTP = req.session.userEmailOtp;
            if (otp) {
                this.interactor.verifyOTP(otp, email, sessionOTP, res).then(result => res.status(200).json({ accessToken: result.accessToken, refreshToken: result.refreshToken, message: "Login successfully", userId: result.userId }))
                    .catch(error => next(error));
            }
            else {
                throw new Error('Oops enter valid OTP');
            }
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            console.log("logout", req.cookies);
            res.clearCookie('userAccessToken');
            res.clearCookie('userRefreshToken');
            res.clearCookie('session');
            req.session.destroy((err) => {
                if (err) {
                    throw new Error;
                }
            });
            res.status(200).json({ message: "Logout successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async profile(req, res, next) {
        try {
            const { userId } = req.body;
            console.log("Inside userController userId-->" + userId);
            const userDetails = await this.interactor.getUserDetails(userId);
            // console.log(userDetails,"userDetailsss");
            if (userDetails) {
                res.status(200).json({ userDetails });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async editProfile(req, res, next) {
        console.log("inside editProfile");
        // const {userId,formData}=req.body
        // console.log("userDetails",req.body)
        // const profileImage = req.file ? req.file.filename : null;
        try {
            let profileImage = "";
            if (req.file) {
                // console.log("req.file",req.file?.filename)
                const base64EncodedImage = Buffer.from(req.file.buffer).toString("base64");
                const dataUri = `data:${req.file?.mimetype};base64,${base64EncodedImage}`;
                const result = await cloudinary_1.default.uploader.upload(dataUri, {
                    folder: "ProfileImage",
                });
                profileImage = result?.secure_url;
            }
            console.log("Type of image", typeof profileImage);
            if (req.body) {
                const response = await this.interactor.saveProfile(req.body, profileImage);
                console.log("response", response.message);
                res.json(response);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async getHotels(req, res, next) {
        try {
            const data = req.body;
            console.log("data", data);
            if (data?.searchInput) { //if there data has searchInput search hotels wil work 
                console.log("searchInput", data.lngLat);
                const response = await this.interactor.getHotels(data);
                if (response != null) {
                    res.json(response);
                }
                else {
                    res.json({ message: "no hotels found" });
                }
            }
            else {
                const { lat, lng } = data;
                console.log("lat and lng", lat, lng);
                const response = await this.interactor.getNearbyHotels(lat, lng);
                if (response != null) {
                    const latLng = { lat, lng };
                    res.json({ response, latLng });
                }
                else {
                    res.json({ message: "no nearby hotels" });
                }
            }
        }
        catch (error) {
            next(error);
        }
    }
    async filterHotels(req, res, next) {
        try {
            const data = req.body;
            console.log("data", data);
            const response = await this.interactor.getFilteredHotels(data);
            if (response.length > 0) {
                res.json({ response });
            }
            else {
                res.json({ message: "No hotels found" });
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.userController = userController;
