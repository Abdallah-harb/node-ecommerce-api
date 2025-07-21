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
    }

},{timestamps:true,versionKey:false});

const Cart = mongoose.model('Cart',CartSchema);
module.exports = Cart;