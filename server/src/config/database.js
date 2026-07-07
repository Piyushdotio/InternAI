import mongoose from "mongoose"

async function connectDb(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to database")
    }).catch(()=>{
        console.log("failed to connect to database")
    })
}

export default connectDb