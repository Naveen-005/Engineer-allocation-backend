import {Request,Response,NextFunction} from "express";
import HttpException from "../exceptions/httpException";


export const errorMiddleware=(error:Error,
        req:Request,
        res:Response,
        next:NextFunction)=>{

                try{
                        if(error instanceof HttpException){
                                const status:number=error.status || 500;
                                const message: string=error.message || "Something went wrong"
                                let respBody= {message:message}
                                console.error(`${error.message} ${error.status} ${req.url}`)
                                res.status(status).json(respBody)
                                
                        }else{
                                console.error(`${error.message} ${req.url}`)
                                res.status(500).send({error: error.message})
                        }
                        

                } catch(errr){
                        next(error)
                }
}
