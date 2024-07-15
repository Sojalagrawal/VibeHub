const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
        
    },
    likes:[{type:ObjectId,ref:"USER"}],
    comments:[{
        comment:{type:String},
        postedBy:{type:ObjectId,ref:"USER"}
    }],
    postedBy:{
        type:ObjectId,
        ref:"USER"
    },
    revealAt: {
        type: Date
    },
},{timestamps:true}) //timetamps to record time of posts so that we can use it to show latest post on top of home
mongoose.model("POST",postSchema);