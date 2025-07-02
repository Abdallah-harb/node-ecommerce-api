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
    image: { type:String }

},{
    timestamps:true,
    versionKey:false
})

const Category = mongoose.model('Category',categorySchema);

module.exports =Category