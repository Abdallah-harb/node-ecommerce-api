
const express = require('express');
const dotenv = require('dotenv').config();
const compression = require('compression')
const {rateLimit} = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const ApiError = require("./utils/apiError");
const globalErrorMiddleware = require("./middleware/globalErrorMiddleware");
const {dbConnection} = require("./config/dbConnection");
const apiRoute = require('./route/apiRoute');
const authRoute = require('./route/authRoute');
const userRoute = require('./route/userRoute');
const {checkAuth} = require('./middleware/checkAuthMiddleware');
const {adminRoutes} = require('./middleware/adminMiddlewrae');
const checkoutController = require('./controller/User/checkoutController');
require('./helpier/response');


// db connection
dbConnection();

const app = express();
// to allow front ti uses endpoints
app.use(cors());
/*app.options('/!*', cors());*/
app.use(compression());
// debug endpoint and errors in console
if (process.env.APP_ENV === 'local'){
    const morgan = require('morgan');
    app.use(morgan('dev'))
}

app.post('/webhooks/stripe', express.raw({type: 'application/json'}),checkoutController.webhookCheckout);

app.use(express.json({limit:'20kb'}));

//rate-limit
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 5 minutes
    limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message:"too many requests , per minutes"
})
app.use(limiter);
// to direct access inside folder storage
app.use(express.static(path.join(__dirname,'storage/upload')));


// auth routes
app.use('/api',authRoute);

//user routes
app.use('/api',checkAuth,userRoute);
//routes admin dashboard
app.use('/api/admin',checkAuth,adminRoutes,apiRoute);



//middleware for route not find
app.use((req,res,next)=>{
    next(new ApiError(`route not found ${req.originalUrl}`,400));
})

// Global Error handel middleware
app.use(globalErrorMiddleware)

const port = process.env.APP_PORT || 8000;
const server = app.listen(port,()=>{
    console.log(`app listen on port ${port}`)
});

// cron-job
 //require('./jobs/couponScheduleJob');

// handel error outside express as DB connect or any things
process.on('unhandledRejection',(error)=>{
    console.error(`unhandledRejection Error : ${error.name} |${error.message}`)
    server.close(()=>{
        process.exit(1);
    })
})