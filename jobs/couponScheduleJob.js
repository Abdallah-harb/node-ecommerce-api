const cron = require('node-cron');
const Coupon = require('../models/couponModel');

// every minute
const couponJob = cron.schedule('* * * * *', async ()=>{
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    try {
        const result = await Coupon.updateMany(
            {
                status: true,
                expire: {
                    $gte: todayStart,
                    $lte: todayEnd
                }
            },
            {
                $set: { status: false }
            }
        );

        console.log(`[${new Date().toISOString()}] Expired ${result.modifiedCount} coupons`);
    } catch (error) {
        console.error('Error updating expired coupons:', error);
    }
},{ timezone: 'Africa/Cairo'});
couponJob.start();

module.exports = couponJob;