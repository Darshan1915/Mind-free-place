 const mongoose =require('mongoose');
 
mongoose.connect("mongodb://127.0.0.1:27017/mindfreeplace")

const postModel = mongoose.Schema({
    user:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ]
})

module.exports = mongoose.model("post", postModel);