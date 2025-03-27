import express from 'express';
import { addShow,getShowSeats } from '../controllers/show-controller.js';
const showRouter = express.Router();

showRouter.post("/",addShow);
showRouter.get("/:id/seats",getShowSeats);

export default showRouter;