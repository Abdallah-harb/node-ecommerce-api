const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        min:[1,'min value for rate is 1'],
        max:[5,'max value for rate is 5 or equal it'],
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    status:{
        type:Boolean,
        default:false
    }
},{timestamps:true,versionKey:false});

const Review = mongoose.model('Review',ReviewSchema);

module.exports = Review;