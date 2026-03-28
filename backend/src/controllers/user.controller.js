import { User } from "../modles/user.model.js";
import { registerSchema, loginSchema } from "../Validators/user.validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_SCERET;

export const userRegister = async (req, res) => {
    try {
    const {error, value} = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({message : error.details[0].message});
    }
    const {fullName, email, password} = value;

    const isExist = await User.findOne({email: email});

    if (isExist) {
        return res.status(422).json({message: "User already exist"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword
    })
    const token = jwt.sign({userName: user.fullName, userId: user._id}, SECRET, {expiresIn: "7d"});
    
    res.status(201).json({success: true, token: token, userId: user._id});

    } catch (error) {
        res.status(500).json({message: `error: ${error}`});
    }
}

export const userLogin = async (req, res) => {
    try {
        const {error, value} = loginSchema.validate(req.body);
        if (error) {
        return res.status(400).json({message : error.details[0].message});
        }

        const {email, password} = value;
        const isExist = await User.findOne({email: email});

        if (!isExist) {
            return res.status(401).json({message: "User does not exist"})
        }
        
        const isValid = await bcrypt.compare(password, isExist.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({userName: isExist.fullName, userId: isExist._id}, SECRET, {expiresIn: "7d"});
        res.status(200).json({success: true, token: token, userId: isExist._id});

    } catch (error) {
        res.status(500).json({message: `error: ${error}`});
    }
}