const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:
        {
            type:String,required:[true,'category name is required'],unique:true,maxLength:[32,'max Length to category 32 char']
        },
    slug:
        {
           type:String,lowercase:true
        },
    image: { type:String },
    parent:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        default:null
    }

},{
    timestamps:true,
    versionKey:false
});

// relation to return children
categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});


categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('Category',categorySchema);

module.exports =Category