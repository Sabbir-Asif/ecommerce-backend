import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users";

const usersRoute: Router = Router();

usersRoute.post('/address', [authMiddleware], errorHandler(addAddress));
usersRoute.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
usersRoute.get('/address', [authMiddleware], errorHandler(listAddress))
usersRoute.put('/',authMiddleware,errorHandler(updateUser))

export default usersRoute;