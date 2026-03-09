import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();

export const Authentocation = async (req, res, next)=>{
    const header = req.headers.authorization
    if(!header){
        return res.status(404).json({
            message:"no token"
        })
    }
    const token = header.split(" ")[1]

    try{
        const isToken = jwt.verify(token,process.env.JWT_SECRET)
        req.users=isToken
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Token is wrong..!"
        })
    }
}

export const admin = async (req, res, next)=>{
    if(req.users.role !=='admin'){
        return res.status(403).json({
            message:"Admin Accessing..!"
        })
    }
    next()
}