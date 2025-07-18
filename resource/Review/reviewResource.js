const dayjs = require('dayjs');
const {raw} = require("express");
const {ProductResource} = require("../products/productResource");
const {UserResource} = require("../user/userResource");
const ReviewResource = async (review)=>{
    return {
        id:review._id,
        description:review.description,
        rate:review.rate,
        status:review.status,
        product: await ProductResource(review.product),
        user:await UserResource(review.user),
        created_at:dayjs(review.createdAt).format('YYYY-MM-DD')
    }
}
const ReviewCollectionResource = async (reviews) => {
    return await Promise.all(reviews.map(review => ReviewResource(review)));
};

module.exports={ReviewResource,ReviewCollectionResource}