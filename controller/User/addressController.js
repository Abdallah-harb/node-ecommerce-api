const User = require('../../models/usermodel');
const ApiError = require("../../utils/apiError");
const asyncHandler = require('express-async-handler')

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const user = await User.findById(req.user._id).select('address').populate({
        path: 'address',
        options: {skip,limit }});

    const totalUser = await User.findById(req.user._id).select('address');
    const total = totalUser.address.length;
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'address':user.address,"pagination":pagination})
});

// add or update
const add = asyncHandler(async (req,res)=>{

    const user = await User.findByIdAndUpdate(req.user._id,
        {$addToSet: {address:req.body}},
        {new:true});
    return jsonResponse(res,{"address":user.address});
});

const remove = asyncHandler(async (req,res)=>{
    //$pull remove product if not exists if it not in ignore it
    const addressId = req.params.id;
    console.log(addressId)
    const user = await User.findByIdAndUpdate(req.user._id,
        {$pull: {address: {_id:addressId}}},
        {new:true});
    return jsonResponse(res,{},'address deleted successfully');
});




module.exports={index,add,remove}
