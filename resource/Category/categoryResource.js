const dayjs = require('dayjs');
const CategoryResource = (category)=>{
    return {
        id:category._id,
        name:category.name,
        slug:category.slug,
        created_at:dayjs(category.createdAt).format('YY-MM-DD')
    }
}
module.exports={CategoryResource}