import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingRouter from "./routes/booking-routes.js";
import theaterRouter from "./routes/theater-routes.js";
import showRouter from "./routes/show-router.js";
dotenv.config();
const app = express();

app.use(cors());

// middlewares
app.use(express.json());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/booking",bookingRouter);
app.use("/theater",theaterRouter);
app.use("/show",showRouter);

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.3oidq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => 
    {
        app.listen(5000,()=>{console.log("Connected To Database And Server is running")})
})
.catch((e) => {console.log(e)});






































// app.use("/",(req,res,next) => {
//     res.send("<h1>Hello</h1>");
// });

// app.listen(5000,() =>{
//     console.log(`Connected to Localhost Port ${5000}`);
// });

