"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './src/Utils/uploads/'); // Directory where the files will be stored
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`); // File name format
//     }
//   });
//   const storage1 = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './src/Utils/uploads/'); // Directory where the files will be stored
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.fieldname}`); // File name format
//     }
//   });
//   // Initialize multer with the storage configuration
//  export const upload = multer({ storage });
//  export const upload1 = multer({ storage:storage1 });
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
