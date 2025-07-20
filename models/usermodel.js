const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const {sendMail} = require('../utils/authMail')
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
    email_code_verified:{
      type:String,
        default:null
    },
    email_verified_at:{
        type:Date,
        default:null
    },
    password:{
        type:String,
        required:true,
        maxLength:[200,'max password length is 200 char']
    },
    password_changed_at:{
        type:Date,
        default:null
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
        default:'user',
    },
    status:{
      type:Boolean,
      default:true
    },
    wishlist:[{
        type:mongoose.Schema.ObjectId,
        ref:"Product"
    }],
    address:[
        {
            id: {type:mongoose.Schema.Types.ObjectId},
            country:String,
            city:String,
            alies:String,  // as title ( Home address , work Address )
            details:String,
            phone:String,
        }
    ]
},{timestamps:true,versionKey:false});


// generate code verification
userSchema.methods.sentCodeVerification =async function (){
    const code = Math.floor(100000+Math.random()*900000);
    this.email_code_verified = await bcrypt.hash(code.toString(),10);
    await this.save();
    await sendMail({code:code,email:this.email});

}

const User = mongoose.model('User',userSchema);
module.exports = User;