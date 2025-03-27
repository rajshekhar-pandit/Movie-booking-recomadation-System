import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    admin:{
        type:mongoose.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    shows:[{
        type:mongoose.Types.ObjectId,
        ref:"Show",
    }]
});

export default mongoose.model("Theater",theaterSchema);