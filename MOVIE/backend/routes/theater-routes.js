import express from "express";
import { addTheater, getAllTheaters, getTheaterById } from "../controllers/theater-controller.js";
const theaterRouter = express.Router();

theaterRouter.get('/',getAllTheaters);
theaterRouter.get('/:id',getTheaterById);
theaterRouter.post('/',addTheater);

export default theaterRouter;