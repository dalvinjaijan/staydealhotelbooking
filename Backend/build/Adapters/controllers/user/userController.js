"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const errorHandling_1 = require("../../middlewares/errorHandling");
const cloudinary_1 = __importDefault(require("../../../Utils/cloudinary"));
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const statusCodes_1 = __importDefault(require("../../interfaces/statusCodes"));
// import chatInteractor from "../../../Interactors/chatInteractor";
dotenv_1.default.config();
// Initialize Stripe with your secret key
const stripe = new stripe_1.default(process.env.STRIPE_SCERET_KEY);
class userController {
    interactor;
    chatInteractor;
    constructor(interactor, chatInteractor) {
        this.interactor = interactor;
        this.chatInteractor = chatInteractor;
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
                console.log("userrrr", user);
                if (user) {
                    if (user.isBlocked) {
                        const error = new errorHandling_1.customError("user is blocked", 401);
                        console.log("error to throw", error);
                        throw error;
                    }
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
            let data = req.query;
            console.log("data", data);
            if (data?.searchInput && typeof data?.lngLat === "string") { //if there data has searchInput search hotels wil work 
                console.log("searchInput", data.lngLat);
                let updatedData = { ...data, lngLat: JSON.parse(data.lngLat) };
                const response = await this.interactor.getHotels(updatedData);
                if (response != null) {
                    res.json(response);
                }
                else {
                    res.json({ message: "no hotels found" });
                }
            }
            else {
                if (data && typeof data.latLng === "string") {
                    const parsedLatLng = JSON.parse(data.latLng);
                    const { lat, lng } = parsedLatLng;
                    console.log("lat and lng", parsedLatLng);
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
    async searchHotel(req, res, next) {
        try {
            const { checkIn, checkOut, noOfDays } = req.body;
            console.log("number of Days", noOfDays);
            let bookingData = req.body;
            console.log("checkIn", checkIn, checkOut);
            let offSetMinute = 5 * 60 + 30;
            let checkOutDate = new Date(new Date(checkOut).getTime() + offSetMinute * 60 * 1000);
            console.log("checkIn", checkIn, checkOutDate);
            bookingData = { ...bookingData, checkOut: checkOutDate };
            console.log("object", bookingData);
            const response = await this.interactor.fetchHotel(bookingData);
            if (response.checkIn && response.checkOut) {
                bookingData = { ...bookingData, checkIn: response.checkIn, checkOut: response.checkOut };
                res.json({ message: "Hotels data found successfully", response: response.hotels, bookingData });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async changeBookingDetails(req, res, next) {
        try {
            let bookingData = req.body;
            console.log("object", bookingData);
            const response = await this.interactor.fetchHotelDetails(bookingData);
            bookingData = { ...bookingData, totalGuests: bookingData.guestNumber };
            res.json({ message: "Hotels data found successfully", response, bookingData });
        }
        catch (error) {
            next(error);
        }
    }
    async createPayment(req, res, next) {
        try {
            const { amount, currency, description } = req.body;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency,
                            product_data: {
                                name: description,
                            },
                            unit_amount: amount * 100, // Convert to cents
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `http://localhost:5173/payment-success?amount=${amount}&description=${encodeURIComponent(description)}`,
                cancel_url: "http://localhost:5173/payment-cancel",
            });
            res.send({ id: session.id });
        }
        catch (error) {
            console.error("Error creating checkout session:", error.message);
            res.status(500).send({ error: "Failed to create checkout session" });
        }
    }
    async bookRoom(req, res, next) {
        try {
            const bookingDetails = req.body;
            console.log("bookingDetails", bookingDetails);
            const response = await this.interactor.bookRoom(bookingDetails);
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async myBooking(req, res, next) {
        try {
            const { type, userId } = req.query;
            if (typeof type !== "string" || typeof userId !== "string") {
                return res.status(400).json({ error: "Invalid type or userId" });
            }
            // console.log("bookingDetails",bookingDetails)
            const response = await this.interactor.myOrders(type, userId);
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async viewWalletTransactions(req, res, next) {
        try {
            const { role, id } = req.query;
            console.log("role", role, "userId", id);
            if (typeof id === "string") {
                const response = await this.interactor.viewTransactions(id);
                res.json(response);
            }
            // res.json(response)
        }
        catch (error) {
            next(error);
        }
    }
    async cancelBooking(req, res, next) {
        try {
            const { bookingId, roomPolicies, checkInDate, checkOutDate } = req.body;
            console.log("bookingId", bookingId);
            if (typeof bookingId === "string") {
                const response = await this.interactor.cancelLogic(bookingId, roomPolicies, checkInDate, checkOutDate);
                if (response)
                    res.status(200).json(response);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async ratingAndReview(req, res, next) {
        try {
            const data = req.body;
            if (data) {
                const response = await this.interactor.rateTheHotel(data);
                if (response)
                    res.status(200).json({ message: "booking rated successfully", response });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async reportHotel(req, res, next) {
        try {
            const data = req.body;
            if (data) {
                const response = await this.interactor.reporthotel(data);
                if (response)
                    res.status(200).json({ message: "Hotel reported successfully", response });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async getChatOfOneToOne(req, res, next) {
        try {
            const { chatId, whoWantsData } = req.params;
            const response = await this.chatInteractor.getChatOfOneToOne(chatId, whoWantsData);
            console.log("getChatOfOneToOne", response);
            return res.status(statusCodes_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async fetchChat(req, res, next) {
        try {
            const { whom, id } = req.params;
            const response = await this.chatInteractor.fetchChats(whom, id);
            return res.status(statusCodes_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async addMessage(req, res, next) {
        try {
            const { sender, chatId, message } = req.body;
            console.log(chatId);
            const response = await this.chatInteractor.addNewMessage(sender, chatId, message);
            return res.status(statusCodes_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getChatId(req, res, next) {
        try {
            const { hostId, userId } = req.params;
            console.log("hostId, userId in controller", hostId, userId);
            const response = await this.chatInteractor.getChatid(hostId, userId);
            return res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.userController = userController;
