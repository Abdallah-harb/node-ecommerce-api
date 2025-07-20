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

// aggregation method for rate and quantity
ReviewSchema.statics.calculateAvgAndSumRate =async function (productId) {
    const result = await  this.aggregate([
        {$match:{product:productId, status: true}},
        {$group:{_id:"$product",avgRate:{$avg:"$rate"},quantity:{$sum:1}}}
    ]);

    const Product = mongoose.model('Product');
    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratting_average: result[0].avgRate,
            ratting_quantity: result[0].quantity
        });
    }else {
        await Product.findByIdAndUpdate(productId, {
            ratting_average: 0,
            ratting_quantity: 0
        });
    }
}


// After update (for findByIdAndUpdate)
ReviewSchema.post('findOneAndUpdate', async function (doc) {
    if (doc && doc.product) {
        await doc.constructor.calculateAvgAndSumRate(doc.product);
    }
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.product) {
        await doc.constructor.calculateAvgAndSumRate(doc.product);
    }
});

// After save (for togglesActive)
ReviewSchema.post('save', async function () {

    await this.constructor.calculateAvgAndSumRate(this.product);
});


const Review = mongoose.model('Review',ReviewSchema);

module.exports = Review;