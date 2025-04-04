import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async(req,res,next) => {
    let users;
    try{
        users = await User.find();
    }
    catch(err){
        // return next(err);
        console.log(err);
    }

    if(!users)
    {
        return res.status(500).json({message:"Unexpected Error Occured"});
    }

    return res.status(200).json({users});
};

export const signup = async (req,res,next) => {
    const {name,email,password} = req.body;
    if(!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "" )
    {
        return res.status(422).json({message:"Invalid Inputs"});
    }

    const hashedPassword = bcrypt.hashSync(password);
    let user;
    try{
        user = new User({name,email,password:hashedPassword});
        user = await user.save();
    }
    catch(err){
        return next(err);
    }

    if(!user)
    {
        return res.status(500).json({message:"Unexpected Error Occured"});
    }
    return res.status(201).json({id:user._id});
};

export const updateUser = async(req,res,next) => {
    const id = req.params.id;
    const {name,email,password} = req.body;
    if(!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "" )
    {
        return res.status(422).json({message:"Invalid Inputs"});
    }
    const hashedPassword = bcrypt.hashSync(password);
    let user;
    try{
        user = await User.findByIdAndUpdate(id,{name,email,password:hashedPassword});
    }catch(err){
        return console.log(err);
    }
    if(!user)
    {
        return res.status(500).json({message:"Something went wrong"});
    }
    return res.status(200).json({message:"Updated Successfully"})
};

export const deleteUser = async(req,res,next) => {
    const id = req.params.id;
    let user;
    try{
        user = await User.findByIdAndDelete(id);
    }
    catch(err)
    {
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message:"Something went wrong"});
    }
    return res.status(200).json({message:"Deleted Successfully"});
};

export const login = async(req,res,next) => {
    const {email,password} = req.body;
    if(!email || email.trim() === "" || !password || password.trim() === "" )
    {
        return res.status(422).json({message:"Invalid Inputs"});
    }

    let exitingUser;
    try{
        exitingUser = await User.findOne({email});
    }
    catch(err)
    {
        return console.log(err);
    }
    if(!exitingUser)
    {
        return res.status(404).json({message:"Unable to find user from this ID"});
    }
    const isPasswordCorrect = bcrypt.compareSync(password,exitingUser.password);

    if(!isPasswordCorrect)
    {
        return res.status(400).json({message:"Password Incorrect"});
    }

    return res.status(200).json({message:"Login Successfull",id:exitingUser._id});
};

// export const getBookingsOfUser = async(req,res,next) => {
//     const id = req.params.id;
//     let bookings;
//     try {
//         bookings = await Bookings.find({user:id}).populate("user show");
//     } catch (err) {
//         console.log(err);
//     }
//     if(!bookings)
//     {
//         return res.status(500).json({message:"Unable to get Bookings"});
//     }
//     return res.status(200).json({bookings});
// }


export const getBookingsOfUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        // Populate both 'user' and 'show', and within 'show', populate 'movie'
        const bookings = await Bookings.find({ user: id }).populate({
            path: "show",
            populate: { path: "movie" }
        }).populate("user");

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        return res.status(200).json({ bookings });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        return res.status(500).json({ message: "Unable to get bookings due to an error" });
    }
};

export const getUserById = async (req, res, next) => {
    const id = req.params.id;
    let user;
    try {
      user = await User.findById(id);
    } catch (err) {
      return console.log(err);
    }
    if (!user) {
      return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    return res.status(200).json({ user });
};
