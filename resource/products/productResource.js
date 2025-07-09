const dayjs = require('dayjs');
const ProductResource = (product)=>{
    return {
        id:product._id,
        name:product.name,
        slug:product.slug,
        description:product.description,
        quantity:product.quantity,
        colors:product.colors??[],
        price:product.price,
        price_after_discount:product.price_after_discount,
        category:product.category,
        brand:product.brand??null,
        main_image:product.main_image,
        images:product.images,
        created_at:dayjs(product.createdAt).format('YYYY-MM-DD')
    }
}
const ProductCollectionResource = (products) => {
    return products.map(product => ProductResource(product));
};

module.exports={ProductResource,ProductCollectionResource}