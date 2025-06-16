import{Request, Response, NextFunction} from 'express'
import HttpException from '../exceptions/httpException'


export const checkRole=(allowedRoles:string[])=>{
    
    return (req:Request, res:Response, next:NextFunction)=>{
    
        const user=req.user

        if(!allowedRoles.includes(user.role)){
            throw new HttpException(403,"User has no access to this resource")
        }
        
        next()
    }

}
