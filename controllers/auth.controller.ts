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
            res.status(200).send("success")
        } catch(error){
            next(error)
        }
    }
}

export default AuthController