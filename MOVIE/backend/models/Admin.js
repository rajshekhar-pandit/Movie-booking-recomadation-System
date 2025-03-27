import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        minLength:8,
        required:true,
    },
    addedMovies:[{
        // type:String
        type:mongoose.Types.ObjectId,
        ref:"Movie",
    }],
    addedTheaters:[{
        type:mongoose.Types.ObjectId,
        ref:"Theater",
    }],
    // addedShows
});

export default mongoose.model("Admin",adminSchema);