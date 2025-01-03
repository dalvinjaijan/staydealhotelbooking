"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hostRepository_1 = require("../../../repositories/hostRepository");
const hostInteractor_1 = require("../../../Interactors/hostInteractor");
const hostController_1 = require("../../controllers/host/hostController");
const multer_1 = __importDefault(require("../../../Utils/multer"));
const hostRouter = express_1.default.Router();
const repository = new hostRepository_1.hostRepository();
const interactor = new hostInteractor_1.hostInteractor(repository);
const controller = new hostController_1.hostController(interactor);
hostRouter.post('/register', controller.registerHost.bind(controller));
hostRouter.post('/verifyOtp', controller.verifyOtp.bind(controller));
hostRouter.post('/login', controller.login.bind(controller));
hostRouter.post('/logout', controller.logout.bind(controller));
hostRouter.post('/addHotel', multer_1.default.any(), controller.addHotel.bind(controller));
hostRouter.get('/hotels', controller.fetchHotels.bind(controller));
hostRouter.post('/editHotelDetails', controller.editHotelDetails.bind(controller));
exports.default = hostRouter;
