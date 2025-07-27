const dayjs = require('dayjs');
const {UserResource} = require("../user/userResource");
const {OrderDetailsCollectionResource} = require("./orderDetailsResource");
const OrderResource =async (order)=>{
    return {
        id:order._id,
        user: await UserResource(order.user),
        coupon:order.coupon,
        payment_type:order.payment_type,
        is_paid:order.is_paid,
        delivery_status:order.delivery_status,
        total_price:order.total_price,
        total_price_after_discount:order.total_price_after_discount,
        order_details: await OrderDetailsCollectionResource(order.order_details),
        created_at:dayjs(order.createdAt).format('YYYY-MM-DD')
    }
}
const OrderCollectionResource = async (orders) => {
    return await Promise.all(orders.map(order => OrderResource(order)));
};

module.exports={OrderResource,OrderCollectionResource}