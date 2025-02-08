import mongoose from 'mongoose';
import {DB_NAME} from'../constans.js'

const connectDB = async ()=>{

try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`/n mongo db connected successfully${connectionInstance.connection.host}`)
    
} catch (error) {console.log(error, " connection failed")
    process.exit(1);
    
}}

export default connectDB