const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema({
    name:
        {
            type:String,required:[true,'brand name is required'],unique:true,maxLength:[32,'max Length to brand 32 char']
        },
    slug:
        {
            type:String,lowercase:true
        },
    image: { type:String },

},{
    timestamps:true,
    versionKey:false
})

const Brand = mongoose.model('Brand',brandSchema);

module.exports =Brand