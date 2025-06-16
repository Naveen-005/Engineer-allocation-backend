import {Router} from 'express'
import { AuthService } from '../services/auth.service'
import HttpException from '../exceptions/httpException'
import {Request, Response, NextFunction} from 'express'

class AuthController{
    constructor(private authService: AuthService,
        private router: Router
    ){
        router.post("/login",this.login.bind(this))
    }

    async login(req: Request, res: Response, next: NextFunction){

        try{

            const {email,password} = req.body
            if(!email || !password){
                throw new HttpException(400,"Email or password is not entered")
            }
            const token_data=await this.authService.login(email,password)
            res.status(200).send(token_data)

        } catch(error){
            next(error)
        }
    }
}

export default AuthController