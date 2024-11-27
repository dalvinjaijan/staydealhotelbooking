import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB=async()=>{
    try {
        const connectMongoDB=await mongoose.connect(
            process.env.MONGOURL?process.env.MONGOURL:''
        )
        console.log(`mongoDB connected successfully ${connectMongoDB.connection.host}`);     
    } catch (error: any) {
        console.error(`Error connecting to Mongo DB: ${error.message}`);
        process.exit(1);
    }
   
    
}
export{
    connectDB
}
