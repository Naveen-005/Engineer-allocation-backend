import{Request, Response, NextFunction} from 'express'
import HttpException from '../exceptions/httpException';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils/constants';
import { JwtPayload } from "../dto/jwt-payload";


export const authMiddleware=(req:Request, res:Response, next:NextFunction)=>{
    
    const token=getToken(req);
    if(!token){
        throw new HttpException(401,"Not authenticated")
    }
    try{
        const payload=jwt.verify(token,JWT_SECRET) as JwtPayload
        req.user=payload
    } catch {
        throw new HttpException(401,"Invalid or expired token")
    }
    next()
    
}

const getToken = (req:Request):string =>{

    const token:string =req.headers.authorization;
    if(!token){
        throw new HttpException(401,'Not Authorized')
    }
    const tokenSplits=token.split(' ')
    if(tokenSplits.length!=2){
        throw new HttpException(401,"Invalid token")
    }
    return tokenSplits[1]

}