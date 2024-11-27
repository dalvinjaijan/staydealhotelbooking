"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const userRoute_1 = __importDefault(require("./Adapters/routes/user/userRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorHandling_1 = require("./Adapters/middlewares/errorHandling");
const dbConfig_1 = require("./db/dbConfig");
const path_1 = __importDefault(require("path"));
const hostRoute_1 = __importDefault(require("./Adapters/routes/host/hostRoute"));
const adminRoute_1 = __importDefault(require("./Adapters/routes/admin/adminRoute"));
// declare module 'express' {
//     interface Request {
//         session?: {
//             userEmailOtp?: string;
//             userOtpTime?: number;
//         };
//     }
// }
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
(0, dbConfig_1.connectDB)();
const PORT = process.env.PORT;
const corsOptionsDelegate = (req, callback) => {
    const origin = "http://localhost:5173";
    const methods = ["GET", "POST", "PUT", "PATCH"];
    const accessControlRequestHeaders = req.headers["access-control-request-headers"];
    const allowedHeaders = accessControlRequestHeaders
        ? accessControlRequestHeaders.split(",")
        : ["Content-Type", "Authorization"];
    const corsOptions = {
        origin,
        methods,
        allowedHeaders,
        credentials: true,
    };
    callback(null, corsOptions);
};
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use((0, cors_1.default)(corsOptionsDelegate));
app.use(body_parser_1.default.json());
console.log('hellko');
console.log("this is path ", __dirname, path_1.default.join(__dirname, '../src/Utils/uploads'));
console.log('gg');
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../src/Utils/uploads')));
app.use('/', userRoute_1.default);
app.use('/host/', hostRoute_1.default);
app.use('/admin/', adminRoute_1.default);
app.use(errorHandling_1.errorHandler.handleError);
const startServer = () => {
    console.log(PORT);
    server.listen(PORT, () => console.log(`server is running ${PORT}`));
};
startServer();
