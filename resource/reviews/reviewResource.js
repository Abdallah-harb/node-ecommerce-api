const dayjs = require('dayjs');
const {raw} = require("express");
const {UserResource} = require("../user/userResource");
const {CategoryResource} = require("../Category/categoryResource");
const ReviewResource = async (review)=>{
    return {
        id:review._id,
        review:review.review,
        user: await UserResource(review.user),
        product: await CategoryResource(review.category),
        parent:review.parent,
        children:review.children??[],
        created_at:dayjs(review.createdAt).format('YYYY-MM-DD')
    }
}
const ReviewCollectionResource = (reviews) => {
    return reviews.map(review => CategoryResource(review));
};

module.exports={ReviewResource,ReviewCollectionResource}