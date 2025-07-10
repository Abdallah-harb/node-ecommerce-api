const dayjs = require('dayjs');
const CategoryResource = (category)=>{
    return {
        id:category._id,
        name:category.name,
        slug:category.slug,
        image:category.image?`${process.env.APP_URL}/category/${category.image}`:null,
        parent:category.parent,
        children:category.children??[],
        created_at:dayjs(category.createdAt).format('YYYY-MM-DD')
    }
}
const CategoryCollectionResource = (categories) => {
    return categories.map(category => CategoryResource(category));
};

module.exports={CategoryResource,CategoryCollectionResource}