"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostController = void 0;
const errorHandling_1 = require("../../middlewares/errorHandling");
const cloudinary_1 = __importDefault(require("../../../Utils/cloudinary"));
const statusCodes_1 = __importDefault(require("../../interfaces/statusCodes"));
class hostController {
    interactor;
    chatInteractor;
    constructor(interactor, chatInteractor) {
        this.interactor = interactor;
        this.chatInteractor = chatInteractor;
    }
    async registerHost(req, res, next) {
        try {
            const { firstName, lastName, email, phone, password } = req.body;
            console.log(email, "email");
            const otp = await this.interactor.sendOtp(email);
            if (otp) {
                req.session.hostEmailOtp = otp;
                console.log("sessionOtp of host", req.session.hostEmailOtp);
                req.session.hostOtpTime = Date.now();
                req.session.hostDetails = { email, firstName, lastName, phone, password };
                console.log(req.session.hostDetails, "otp time");
                res.status(200).json({ message: "OTP sent successfully" });
            }
            else {
                throw new errorHandling_1.customError('failed to sent Otp', 500);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const otp = req.body?.otp;
            console.log("otp inside verify otp", otp);
            const hostDetails = req.session.hostDetails || '';
            const sessionOTP = req.session.hostEmailOtp;
            console.log("sessionotp in verifyotp controller", req.session.hostEmailOtp, sessionOTP);
            if (otp) {
                console.log("otp", otp);
                this.interactor.verifyOTP(otp, hostDetails, sessionOTP, res).then(result => res.status(200).json({ message: result.message }))
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
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { message, hostDetails, accessToken, refreshToken, status } = await this.interactor.verifyHost(email, password, res);
            res.status(status).json({ message, hostDetails, accessToken, refreshToken, status });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            console.log("logout", req.cookies);
            res.clearCookie('hostAccessToken');
            res.clearCookie('hostRefreshToken');
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
    //   async addHotel(req:CustomRequest,res:Response,next:NextFunction){
    //     try {
    //       // console.log(formData?.hotelName);
    //       console.log("form data",req.body)
    //       // console.log("files",req.files)
    //       const handleFileUpload = async (files: Express.Multer.File[]) => {
    //         console.log("files", files);
    //         let hotelPhotos: string[] = [];
    //         let roomPhotos: string[] = [];
    //         for (const file of files) {
    //           const base64EncodedImage = Buffer.from(file.buffer).toString("base64");
    //           const dataUri = `data:${file.mimetype};base64,${base64EncodedImage}`;
    //           if (file.fieldname.includes('hotelPhoto')) {
    //             const result = await cloudinaryV2.uploader.upload(dataUri, {
    //               folder: "HotelPhotos",
    //             });
    //             const hotelImage = result?.secure_url;
    //             hotelPhotos.push(hotelImage);
    //           } 
    //           if (file.fieldname.includes('roomPhoto')) {
    //             const result = await cloudinaryV2.uploader.upload(dataUri, {
    //               folder: "RoomPhotos", // Changed folder name for clarity
    //             });
    //             const roomPhoto = result?.secure_url;
    //             roomPhotos.push(roomPhoto);
    //           }
    //         }
    //         return {
    //           hotelPhotos,
    //           roomPhotos
    //         };
    //       };
    //       const files = req.files as Express.Multer.File[];
    //       const {hotelPhotos,roomPhotos}=await handleFileUpload(files)
    //       const {message,newlyAddedHotel}=await this.interactor.addHotelDetails(req.body,hotelPhotos,roomPhotos)
    //   res.status(200).json({message,hotelPhotos,roomPhotos,newlyAddedHotel})
    //     } catch (error) {
    //       next(error)
    //     }
    // }
    async addHotel(req, res, next) {
        try {
            // console.log("form data", req.body);
            console.log("hi");
            const handleFileUpload = async (files) => {
                console.log("files", files);
                let hotelPhotos = [];
                let roomPhotos = {}; // RoomType -> Array of Photo URLs
                for (const file of files) {
                    const base64EncodedImage = Buffer.from(file.buffer).toString("base64");
                    const dataUri = `data:${file.mimetype};base64,${base64EncodedImage}`;
                    if (file.fieldname.includes("hotelPhoto")) {
                        const result = await cloudinary_1.default.uploader.upload(dataUri, {
                            folder: "HotelPhotos",
                        });
                        console.log("result", result);
                        hotelPhotos.push(result.secure_url);
                    }
                    else if (file.fieldname.includes("_photo")) {
                        // Extract the roomType from the fieldname (e.g., "deluxe_photo0.jpg")
                        const roomType = file.fieldname.split("_")[0];
                        const result = await cloudinary_1.default.uploader.upload(dataUri, {
                            folder: "RoomPhotos",
                        });
                        // Initialize the roomType key if it doesn't exist
                        if (!roomPhotos[roomType]) {
                            roomPhotos[roomType] = [];
                        }
                        roomPhotos[roomType].push(result.secure_url);
                    }
                }
                console.log("roomPhotos", roomPhotos);
                console.log("hotelPhotos", hotelPhotos);
                return { hotelPhotos, roomPhotos };
            };
            const files = req.files;
            const { hotelPhotos, roomPhotos } = await handleFileUpload(files);
            // Ensure room categories are parsed properly
            // const roomCategories = JSON.parse(req.body.roomCategories);
            const { message, newlyAddedHotel } = await this.interactor.addHotelDetails(req.body, hotelPhotos, roomPhotos);
            res.status(200).json({ message, hotelPhotos, roomPhotos, newlyAddedHotel });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchHotels(req, res, next) {
        try {
            const { hostId } = req.query;
            console.log("hostId", hostId);
            const response = await this.interactor.getHotels(hostId);
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async editHotelDetails(req, res, next) {
        try {
            const { editedData, hostId } = req.body;
            console.log("hostId", hostId, editedData);
            const response = await this.interactor.editHotelRequest(editedData, hostId);
            if (response)
                res.status(200).json({ response, message: "Requested for editing hotel" });
        }
        catch (error) {
            next(error);
        }
    }
    async hostProfile(req, res, next) {
        try {
            const { hostId } = req.query;
            console.log("hostId", hostId);
            if (typeof hostId === "string") {
                const response = await this.interactor.viewProfile(hostId);
                if (response)
                    res.status(200).json(response);
            }
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
    async fetchReport(req, res, next) {
        try {
            const { period, hostId } = req.query;
            if (typeof period === 'string' && typeof hostId === 'string') {
                const response = await this.interactor.fetchReportLogic(period, hostId);
                console.log("period", period);
                res.json(response);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async fetchPieReport(req, res, next) {
        try {
            const { hostId } = req.query;
            if (typeof hostId === 'string') {
                const response = await this.interactor.fetchPieData(hostId);
                res.json(response);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async fetchReservations(req, res, next) {
        try {
            const { type, hostId } = req.query;
            if (typeof type !== "string" || typeof hostId !== "string") {
                return res.status(400).json({ error: "Invalid type or hostId" });
            }
            // console.log("bookingDetails",bookingDetails)
            const response = await this.interactor.reservations(type, hostId);
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getChatId(req, res, next) {
        console.log("chat");
        try {
            const { hostId, userid } = req.params;
            console.log(hostId, userid);
            const response = await this.chatInteractor.getChatid(hostId, userid);
            console.log("ress", response);
            return res.status(statusCodes_1.default.OK).json(response);
        }
        catch (error) {
            console.log("56789", error.message);
            next(error);
        }
    }
    async getOneToneChat(req, res, next) {
        try {
            const { chatid, whoWantsData } = req.params;
            const response = await this.chatInteractor.getChatOfOneToOne(chatid, whoWantsData);
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
    async notificationCountUpdater(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.interactor.notificationCountUpdater(id);
            return res.status(statusCodes_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async notificationGetter(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.interactor.notificationsGetter(id);
            return res.status(statusCodes_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.hostController = hostController;
