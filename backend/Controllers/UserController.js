import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const getAllUsers = async(req, res) => {
    try {
        let users = await UserModel.find()

        users = users.map((user)=>{
            const {password, ...otherDetails} = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUser = async(req, res) => {
    const id = req.params.id;

    try {
        
        if(id.match(/^[0-9a-fA-F]{24}$/)){                 // validating the ObjectId
            const user = await UserModel.findById(id);
            if (user) {
              const { password, ...otherDetails } = user._doc;
        
              res.status(200).json(otherDetails);
            } else {
              res.status(404).json("No such user exists");
            }
        }
        else{
            res.status(400).json("invalid ObjectId")
        }
    
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const updateUser = async(req, res) => {
    const id = req.params.id

    const {_id, currentUserAdminStatus, password} = req.body;

    if(id===_id) {

        try {
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt)
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {new:true})
            const token = jwt.sign(
                {username: user.username, id: user._id},
                process.env.JWT_KEY, {expiresIn: "1h"}
            )
            res.status(200).json({user, token})
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
    else {
        res.status(403).json("Access Denied!");
    }
}

export const deleteUser = async(req, res) => {
    const id = req.params.id;

    const {currentUserId, currentUserAdminStatus} = req.body;

    if(id===currentUserId || currentUserAdminStatus){

        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json({message:error.message})
        }

    }
    else {
        res.status(403).json("Access Denied!");
    }
}

export const followUser = async(req, res) => {
    const id = req.params.id;

    const {_id} = req.body;

    if(_id === id) {
        res.status(403).json("Action Forbidden")
    }
    else{
        try {
            const followedUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(_id)

            if(!followedUser.followers.includes(_id)){
                await followedUser.updateOne({$push: {followers:_id}})
                await followingUser.updateOne({$push: {following:id}})
                res.status(200).json(`User followed`)
            }
            else{
                res.status(403).json("This user is already followed by you!");
            }

        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
}
export const unFollowUser = async(req, res) => {
    const id = req.params.id;

    const {_id} = req.body;

    if(_id === id) {
        res.status(403).json("Action Forbidden!")
    }
    else{
        try {
            const followingUser = await UserModel.findById(_id)
            const followedUser = await UserModel.findById(id)

            if(followedUser.followers.includes(_id)){
                await followedUser.updateOne({$pull: {followers:_id}})
                await followingUser.updateOne({$pull: {following:id}})
                res.status(200).json(`User Unfollowed`)
            }
            else{
                res.status(403).json("You are not following this user!");
            }

        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
}