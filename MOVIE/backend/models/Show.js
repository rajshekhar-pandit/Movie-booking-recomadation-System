import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    movie:{
        type:mongoose.Types.ObjectId,
        ref:"Movie",
        required:true,
    },
    theater:{
        type:mongoose.Types.ObjectId,
        ref:"Theater",
        required:true,
    },
    startTime:{
        type:Date,
        required:true,
    },
    endTime:{
        type:Date,
        required:true,
    },
    bookings:[{
        type:mongoose.Types.ObjectId,
        ref:"Booking",
    }],
    admin:{
        type:mongoose.Types.ObjectId,
        ref:"Admin",
        required:true
    }
});

export default mongoose.model("Show",showSchema);