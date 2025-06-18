import UserService from "./user.service";
import { JwtPayload } from "../dto/jwt-payload";
import bcrypt from "bcrypt";
import HttpException from "../exceptions/httpException";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import { LoggerService } from '../services/logger.service';

export class AuthService {
    private logger = LoggerService.getInstance(AuthService.name);

    constructor(private userService:UserService) {}

    async login(email:string, password:string){
        this.logger.info(`Login attempt for email: ${email}`);
        
        const user= await this.userService.getUserByEmail(email);
        if(!user){
            this.logger.error(`User not found for email: ${email}`);
            throw new HttpException(401,"User not found");
        }

        this.logger.info(`User found for email: ${email}, validating password`);
        const isPasswordValid= await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            this.logger.error(`Invalid password for user: ${email}`);
            throw new HttpException(400,"Invalid user")
        }

        this.logger.info(`Password validated for user: ${email}, generating token`);
        const payload:JwtPayload={
            user_id:user.user_id,
            name:user.name,
            email:user.email,
            role:user.role.role_name
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn: JWT_VALIDITY});
        
        this.logger.info(`Successfully generated token for user: ${email}`);
        return{
            tokenType:"Bearer",
            accessToken:token,
            role:user.role.role_name,
            user_id:user.user_id
        }
    }
}