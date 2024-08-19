 const { type } = require('express/lib/response');
const mongoose =require('mongoose');
 
mongoose.connect("mongodb://127.0.0.1:27017/mindfreeplace")


const userModel = mongoose.Schema({
    username: String,
    name: String,
    age:Number,
    email:String,
    password:String,
    profilepic:{
        type: String,
        default: "defaultProfile.jpg"
    },
    date:{
        type:Date,
        default:Date.now
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
})

module.exports = mongoose.model("user", userModel);