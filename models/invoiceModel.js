const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
    code:String,
    order:{
        type:mongoose.Schema.ObjectId,
        ref:"Order",
        required:true
    },
    total_amount:{
        type:Number,
        required:true
    }
},{timestamps:true,versionKey:false});


InvoiceSchema.pre('validate',async function (next){
    const baseCode = `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    let finalCode = baseCode;
    let counter = 1;

    while (await mongoose.models.Coupon.findOne({ code: finalCode })) {
        finalCode = `${baseCode}-S${counter}`;
        counter++;
    }
    this.code = finalCode;
    next();
});
const Invoice = mongoose.model('Invoice',InvoiceSchema);
module.exports=Invoice;