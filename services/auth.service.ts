import UserService from "./user.service";
import { JwtPayload } from "../dto/jwt-payload";
import bcrypt from "bcrypt";
import HttpException from "../exceptions/httpException";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";

export class AuthService {
    constructor(private userService:UserService) {}

    async login(email:string, password:string){
        
        const user= await this.userService.getUserByEmail(email);
        if(!user){
            throw new HttpException(401,"User not found");
        }
        const isPasswordValid= await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            
            throw new HttpException(400,"Invalid user")
        }
        const payload:JwtPayload={
            user_id:user.user_id,
            name:user.name,
            email:user.email,
            role:user.role.role_name
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn: JWT_VALIDITY});
        return{
            tokenType:"Bearer",
            accessToken:token
        }

    }

}