const {ProductResource} = require("../products/productResource");
const OrderDetailsResource =async (detail)=>{
    return {
        id:detail._id,
        product: await ProductResource(detail.product),
        quantity:detail.quantity,
        price:detail.price,
    }
}
const OrderDetailsCollectionResource =async (details) => {
    return await Promise.all(details.map(detail => OrderDetailsResource(detail)));
};

module.exports={OrderDetailsResource,OrderDetailsCollectionResource}