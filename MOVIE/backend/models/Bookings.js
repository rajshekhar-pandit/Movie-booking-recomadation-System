import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    seatNumber:[{
        type:Number,
        required:true
    }],
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    show:{
        type:mongoose.Types.ObjectId,
        ref:"Show",
        required:true,
    }
});

export default mongoose.model("Booking",bookingSchema);