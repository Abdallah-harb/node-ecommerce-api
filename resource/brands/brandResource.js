const dayjs = require('dayjs');
const BrandResource = (brand)=>{
    return {
        id:brand._id,
        name:brand.name,
        slug:brand.slug,
        created_at:dayjs(brand.createdAt).format('YYYY-MM-DD')
    }
}
const BrandCollectionResource = (brandies) => {
    return brandies.map(brand => BrandResource(brand));
};

module.exports={BrandResource,BrandCollectionResource}