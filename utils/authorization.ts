import HttpException from '../exceptions/httpException'


export const verifyRole=(req,allowedRoles:string[])=>{

    const user=req.user

    if(!allowedRoles.includes(user.role)){

        return false
    }
        
    return true
    
}

export const verifyUser=(req, allowedIds:number[])=>{

    const user=req.user

    if(!allowedIds.includes(user.id)){

        return false
    }
        
    return true
}

