const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
            type:String,
            required:true,
            trim:true,
            maxLength:[150,'max length name is 150 char']
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        maxLength:[200,'max password length is 200 char']
    },
    phone:{
        type:String,
        default:null,
        unique:true,
    },
    image:{
        type:String,
        default:null
    },
    role:{
        type:String,
        default:null,
    }
},{timestamps:true,versionKey:false});


const imageUrl = (doc)=>{
    if (doc.image){
        const image = `${process.env.APP_URL}/user/${doc.image}`;
        doc.image = image;
    }
}

// create
userSchema.pre('save',function (){
    imageUrl(this);
});

// find , findOne , update
userSchema.pre('init',function (doc) {
    imageUrl(doc);
})

const User = mongoose.model('User',userSchema);
module.exports = User;