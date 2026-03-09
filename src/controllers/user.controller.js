import * as userModel from '../models/user.models.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();

export const registerController = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const checkemail = await userModel.findUser(email)

        if (checkemail.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            })
        }

        const hashpass = await bcrypt.hash(password, 10)

        const user = await userModel.createUser(
            name,
            email,
            hashpass
        )

        res.status(201).json({
            message: "Register successful",
            data: user.rows[0]
        })

    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: "Failed to register"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const result = await userModel.findUser(email);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const user = result.rows[0]

        const isLogin = await bcrypt.compare(password, user.password)

        if (!isLogin) {
            return res.status(401).json({
                message: "Wrong password"
            })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXSPIRE_IN}
        )

        res.status(200).json({
            message: "Login successful",
            user,
            token
        })

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Login failed"
        })
    }
}