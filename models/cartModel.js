const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    coupon:{
        type:mongoose.Schema.ObjectId,
        ref:"Coupon"
    },
    total_price:{
        type:Number
    },
    total_price_after_discount:{
        type:Number
    }

},{timestamps:true,versionKey:false});

const Cart = mongoose.model('Cart',CartSchema);
module.exports = Cart;