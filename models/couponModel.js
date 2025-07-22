const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CouponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        trim:true,
        unique:[true,'code must be unique']
    },
    expire:{
        type:Date,
        required:true
    },
    max_limit:{
        type:Number,
        required:true,
        minLength:1
    },
    usage_number:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        maxLength:100,
        minLength:1
    },
    status:{
      type:Boolean,
      default:false
    },
    users:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }]
},{timestamps:true,versionKey:false});

CouponSchema.pre('validate',async function (next){
    const baseCode = `NEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    let finalCode = baseCode;
    let counter = 1;

    while (await mongoose.models.Coupon.findOne({ code: finalCode })) {
        finalCode = `${baseCode}-S${counter}`;
        counter++;
    }
    this.code = finalCode;
    next();
});

module.exports = mongoose.model('Coupon',CouponSchema);