const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:
        {
        type:String,required:[true,'product name is required'],minLength:[2,'min length for product 2 char '],maxLength:[100,'max char for product is 100 char']
         },

    slug:
        {
            type:String,required:[true,'slug is required'],lowercase:true
        },

    description:
        {
            type:String,required:[true,'description filed is required']
        },

    main_image : {
        type:String,required:[true,'main image is required']
    },

    images : [String],

    sold: {
        type:Number,default:0
    },

    colors : [String],

    price:{
        type:Number,required:[true,'price filed is required']
    },

    price_after_discount : {type:Number},

    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true,'category i required']
    },

    brand:{
        type:mongoose.Schema.ObjectId,
        ref:'Brand'
    },
    ratting_quantity:{
      type:Number,default:0
    },

    ratting_average:{
        type:Number,
        min:[1,'min value for rate is 1'],
        max:[5,'max value for rate is 5 or equal it']
    }
},{timestamps:true,versionKey:false});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;