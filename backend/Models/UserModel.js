import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        firstname:{
            type: String,
            required: true
        },
        lastname:{
            type: String,
            required: true                             // Problem was here.
        },
        isadmin:{
            type: Boolean,
            default: false 
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesIn: String,
        worksAt: String,
        relationship: String,
        country: String,
        followers: [],              // ID's of users who are following the current user
        following: []               // username of user to whome the current user is following
    },

    {timestamps: true}             // creating the time stamp so we dont have to manually add it in the database (created and updated at)
)

const UserModel= mongoose.model("Users", UserSchema);
export default UserModel