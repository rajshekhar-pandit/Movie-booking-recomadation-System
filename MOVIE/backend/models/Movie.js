import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    actors:[{type:String,required:true}],
    releaseDate:{
        type:Date,
        required:true
    },
    posterUrl:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean
    },
    bookings:[{type:mongoose.Types.ObjectId,ref:"Booking"}],
    admin:{
        // type:String,
        type:mongoose.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    shows:[{
        type:mongoose.Types.ObjectId,
        ref:"Show",
    }]
});

export default mongoose.model("Movie",movieSchema);