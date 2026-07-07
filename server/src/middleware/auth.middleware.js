import jwt from "jsonwebtoken"

export async function authUser(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({success:false,message:"Unauthorized"});
    }
    try{
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decodedToken.userId;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({success:false,message:"Invalid token"});
    }
}