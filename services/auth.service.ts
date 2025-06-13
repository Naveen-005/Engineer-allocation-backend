
export class AuthService {
    constructor() {}

    async login(email:string, password:string){
        
        return{
            tokenType:"Bearer",
            accessToken:"token"
        }
    }

}