import mongoose from 'mongoose';
import Bookings from '../models/Bookings.js';
import User from '../models/User.js';
import Show from "../models/Show.js";

export const newBooking = async(req,res,next) => {
    const {date,seatNumber,user,show} = req.body;
    
    let existingShow;
    let existingUser;
    try {
        existingShow = await Show.findById(show).populate('movie');
        existingUser = await User.findById(user);
    } catch (err) {
        console.log(err);
    }

    if(!existingShow)
    {
        return res.status(404).json({message:"Show not found with Given ID"});
    }
    if(!existingUser)
    {
        return res.status(404).json({message:"User not found"});
    }
    let booking;
    try{
        booking = new Bookings({show,date:new Date(`${date}`),seatNumber,user});
        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.bookings.push(booking);
        existingShow.bookings.push(booking);
        existingShow.movie.bookings.push(booking);
        await existingUser.save({session});
        await existingShow.save({session});
        await existingShow.movie.save({session});
        await booking.save({session});
        session.commitTransaction();
    }catch(err){
        console.log(err);
    }
    if(!booking)
    {
        return res.status(500).json({message:"Unable to create a booking"});
    }

    return res.status(201).json({booking});
};

export const getBookingById = async(req,res,next) => {
    const id = req.params.id;
    let booking;
    try {
        booking = await Bookings.findById(id);
    } catch (err) {
        console.log(err);
    }

    if(!booking)
    {
        return res.status(500).json({message:"Unexpected Error"});
    }
    return res.status(200).json({booking});
};

export const deleteBooking = async(req,res,next) => {
    const id = req.params.id;
    let booking;
    try {
        booking = await Bookings.findByIdAndDelete(id)
        .populate('user')
        .populate({
            path: 'show',
            populate: {
            path: 'movie',  // Populate 'movie' inside 'show'
        }
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking);
        await booking.show.bookings.pull(booking);
        await booking.show.movie.bookings.pull(booking);
        await booking.show.movie.save({session});
        await booking.user.save({session});
        await booking.show.save({session});
        session.commitTransaction();
    } catch (err) {
        console.log(err);
    }

    if(!booking)
    {
        return res.status(500).json({message:"Unable to Delete"});
    }
    return res.status(200).json({message:"Deleted Successfully"});
};