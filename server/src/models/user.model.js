import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
    },
)

userSchema.pre('save', async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

const UserModel=mongoose.model("user",userSchema);

export default UserModel;