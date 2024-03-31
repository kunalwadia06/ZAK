import express from "express";
import { deleteUser, followUser, getUser, unFollowUser, updateUser, getAllUsers } from "../Controllers/UserController.js";
import authMiddleWare from "../Middlewares/authMiddleWare.js";
const router = express.Router();

// router.get('/', async(req, res)=>{res.send("This is UserRoute")})      // checking if its working or not

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.put('/:id', authMiddleWare, updateUser)
router.delete('/:id', authMiddleWare, deleteUser)
router.put('/:id/follow', authMiddleWare, followUser)
router.put('/:id/unFollow', authMiddleWare, unFollowUser)

export default router;