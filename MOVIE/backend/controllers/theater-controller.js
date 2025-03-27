import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Theater from "../models/Theater.js";
import Admin from "../models/Admin.js";

export const addTheater = async(req,res,next) => {
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

    // create new theater
    const {name,location} = req.body;
    if(!name && name.trim() === "" && !location && location.trim() === "")
    {
        return res.status(422).json({message:"Invalid Inputs"});
    }

    let theater;
    try {
        theater = new Theater({name,location,admin:adminId});
        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        session.startTransaction();
        adminUser.addedTheaters.push(theater);
        await adminUser.save({session});
        await theater.save({session});
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
    }

    if(!theater){
        return res.status(500).json({message:"Request Failed"});
    }
    return res.status(201).json({theater});
}

export const getAllTheaters = async(req,res,next) => {
    let theaters;
    try {
        theaters = await Theater.find();
    } catch (err) {
        console.log(err);
    }

    if(!theaters){
        return res.status(500).json({message:'Request Failed'});
    }
    return res.status(200).json({theaters});
}

export const getTheaterById = async(req,res,next) => {
    const id = req.params.id;
    let theater;
    try {
        theater = await Theater.findById(id);
    } catch (err) {
        console.log(err);
    }
    
    if(!theater){
        return res.status(404).json({message:'Invalid Theater ID'});
    }
    return res.status(200).json({theater});
}
