const dayjs = require('dayjs');
const CouponResource = (coupon)=>{
    return {
        id:coupon._id,
        code:coupon.code,
        expire:coupon.expire,
        max_limit:coupon.max_limit,
        discount:coupon.discount,
        status:coupon.status,
        created_at:dayjs(coupon.createdAt).format('YYYY-MM-DD')
    }
}
const CouponCollectionResource = (coupons) => {
    return coupons.map(coupon => CouponResource(coupon));
};

module.exports={CouponResource,CouponCollectionResource}