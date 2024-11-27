import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
import userRouter from './Adapters/routes/user/userRoute'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors,{CorsOptionsDelegate} from  'cors'
import { errorHandler } from './Adapters/middlewares/errorHandling'
import { connectDB } from './db/dbConfig'
import path from 'path'
import hostRouter from './Adapters/routes/host/hostRoute'
import adminRouter from './Adapters/routes/admin/adminRoute'

// declare module 'express' {
//     interface Request {
//         session?: {
//             userEmailOtp?: string;
//             userOtpTime?: number;
//         };
//     }
// }

dotenv.config()
const app=express() 

const server=createServer(app)
connectDB()

const PORT=process.env.PORT

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
    const origin = "http://localhost:5173";
    const methods = ["GET", "POST", "PUT", "PATCH"];
    const accessControlRequestHeaders = req.headers[
      "access-control-request-headers"
    ] as string | undefined;
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
  
  

app.use(cookieParser());
app.use( session({
  name: 'session',
  secret: process.env.SESSION_SECRET as string,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(cors(corsOptionsDelegate));


app.use(bodyParser.json());
console.log('hellko');

console.log("this is path ",__dirname,path.join(__dirname,'../src/Utils/uploads'));
console.log('gg');

app.use('/uploads', express.static(path.join(__dirname,'../src/Utils/uploads')));


    
app.use('/',userRouter)
app.use('/host/',hostRouter)
app.use('/admin/',adminRouter)
app.use(errorHandler.handleError)
const startServer=()=>{
    console.log(PORT);
    
    server.listen(PORT,()=>console.log(`server is running ${PORT}`))
}
startServer()
