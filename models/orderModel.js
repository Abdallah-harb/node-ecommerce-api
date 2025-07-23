const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    coupon:{
        type:mongoose.Schema.ObjectId,
        ref:"Coupon",
        default:null
    },
    shipping_price:{
      type:Number,
      default:0
    },
    tax_price:{
      type:Number,
      default:0
    },
    payment_type:{
        type:String,
        enum:["cash","credit","wallet","Back-transfer"],
        required:true,
        default:"cash"
    },
    is_paid:{
        type:Boolean,
        default:false
    },
    paid_at:{
        type:Date
    },
    delivery_status:{
        type:String,
        enum:["pending","on-the-way","delivered"],
        default:"pending"
    },
    total_price:{
        type:Number,
        required:true
    },
    total_price_after_discount:{
        type:Number,
        required:true
    },
    order_details:[{
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
            require_decimal:true
        },
        price: {type:Number,required:true},
        quantity: {type:Number,required:true}
    }],
},{timestamps:true,versionKey:false});

const Order = mongoose.model('Order',orderSchema);

module.exports=Order;