const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        min:[1,"min value rate is 1.0"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }
},{timestamps:true,versionKey:false});

module.exports = mongoose.model('Review',ReviewSchema);