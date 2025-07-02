const Category = require('../models/categoryModel')
const slugify = require('slugify');
const {CategoryResource} = require('../resource/Category/categoryResource');
const store = async (req,res)=>{
    const name = req.body.name;
    const category = await Category.create({name,'slug':slugify(name)});
   return jsonResponse(res,{'category':CategoryResource(category)});
}

module.exports = {store}