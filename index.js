import express from 'express';
import dotenv from 'dotenv'
import DB_connect from './src/configs/db.js';
import cloudinary from './src/configs/cloudinary.js';
import cors from 'cors';
import router from './src/router/user.route.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

DB_connect.connect()
.then(()=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.log("Database connection failed",err);
})


async function checkCloudinary() {
    try{
        const connect = await cloudinary.api.ping();
        console.log("Cloudinary connection successfully",connect)

    }catch(err){
        console.log("Cloudinary connection failed",err);
    }
}checkCloudinary();

app.use(cors());
app.use(express.json());
app.use("/user",router)

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})
