import UserModel from "../models/user.model.js";
import jwt from  "jsonwebtoken"


/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 * @body    { username, email, password }
 */
export async function register(req,res){
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({success:false,message:"Please provide all the required fields"});
        }
        const isUserExisted = await UserModel.findOne({
            $or: [{ email }, { username }]
        });
        if(isUserExisted){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        if(!process.env.JWT_SECRET){
            return res.status(500).json({success:false,message:"Server configuration error"});
        }

        const user = await UserModel.create({username,email,password});
        const token= jwt.sign(
            {
                username:user.username,
                id:user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"5d"
            }
        )
        res.cookie("token",token)

        return res.status(201).json(
            {   
                success:true,
                message:"User registered successfully",
                token,
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email
                }
            
            });

    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 * @body    { email, password }
 */
export async function login(req,res){
    try{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({success:false,message:"Please provide all the required fields"});
    }

    const user=await UserModel.findOne({email});
    if(!user){
        return res.status(400).json({success:false,message:"User not found"});
    }
    const isPasswordValid= await user.comparePassword(password);
    if(!isPasswordValid){
        return res.status(400).json({success:false,message:"Invalid password"});
    }

    const token= jwt.sign(
        {
            username:user.username,
            id:user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"5d"
        }
    )
    res.cookie("token",token)

    return res.status(200).json(
        {   
            success:true,
            message:"User logged in successfully",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        
        });

    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

/**
 * @route   GET /api/auth/getMe
 * @desc    Get currently logged-in user profile
 * @access  Private (Requires Token)
 * @headers Authorization: Bearer <token> or Cookie token
 */
export async function getMe(req,res){
    try{
        const user=await UserModel.findById(req.user.id).select("-password");
        if(!user) {
            return res.status(404).json({success:false,message:"User not found"});
        }
        return res.status(200).json(
            {
                success:true,
                user:user
            })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}


 