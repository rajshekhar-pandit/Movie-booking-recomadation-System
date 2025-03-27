import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";

// By Admin
export const addShow = async(req,res,next) => {
    const extractedToken = req.headers.authorization.split(" ")[1];
    if(!extractedToken && extractedToken.trim() === ""){
        return res.status(404).json({message:"Token Not Found"});
    }

    let adminId;

    // verify token
    jwt.verify(extractedToken,process.env.SECRET_KEY,(err,decrypted) => {
        if(err){
            return res.status(400).json({message: `${err.message}`});
        }
        else{
            adminId = decrypted.id;
            return;
        }
    });

    // create new show
    const {movie,theater,startTime,endTime} = req.body;
    let existingMovie;
    let existingTheater;
    try {
        existingMovie = await Movie.findById(movie);
        existingTheater = await Theater.findById(theater);
    } catch (err) {
        console.log(err);
    }

    if(!existingMovie)
    {
        return res.status(404).json({message:"Movie not found with Given ID"});
    }
    if(!existingTheater)
    {
        return res.status(404).json({message:"Theater not found with Given ID"});
    }
    let show;
    try {
        show = new Show({movie,theater,startTime:new Date(`${startTime}`),endTime :new Date(`${endTime}`),admin:adminId});
        const session = await mongoose.startSession();
        session.startTransaction();
        existingMovie.shows.push(show);
        existingTheater.shows.push(show);
        await existingMovie.save({session});
        await existingTheater.save({session});
        await show.save({session});
        session.commitTransaction();
    } catch (err) {
        console.log(err);
    }

    if(!show)
    {
        return res.status(500).json({message:"Unable to create a Show"});
    }
    
    return res.status(201).json({show});
}

export const getShowSeats = async(req,res,next) => {
    try {
        const showId = req.params.id;
        const totalSeats = 50; // Define total seats for each show
        
        // Fetch the show with bookings populated
        const show = await Show.findById(showId).populate({
            path: 'bookings',
            select: 'seatNumber',
        });

        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        // Get all booked seats by aggregating seat numbers from each booking
        const bookedSeats = show.bookings.flatMap(booking => booking.seatNumber);

        // Create an array of seats with availability status
        const seats = Array.from({ length: totalSeats }, (_, i) => {
            const seatNumber = i + 1;
            return {
                seatNumber,
                status: bookedSeats.includes(seatNumber) ? 'booked' : 'available',
            };
        });

        return res.status(200).json({ seats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve seats" });
    }
}