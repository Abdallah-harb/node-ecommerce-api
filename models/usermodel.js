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
        default:null,
    }
},{timestamps:true,versionKey:false});


// const imageUrl = (doc)=>{
//     if (doc.image){
//         const image = `${process.env.APP_URL}/user/${doc.image}`;
//         doc.image = image;
//     }
// }
//
// // create
// userSchema.pre('save',function (){
//     imageUrl(this);
// });
//
// // find , findOne , update
// userSchema.pre('init',function (doc) {
//     imageUrl(doc);
// });


// generate code verification
userSchema.methods.sentCodeVerification =async function (){
    const code = Math.floor(100000+Math.random()*900000);
    this.email_code_verified = await bcrypt.hash(code.toString(),10);
    await this.save();
    await sendMail({code:code,email:this.email});

}

const User = mongoose.model('User',userSchema);
module.exports = User;