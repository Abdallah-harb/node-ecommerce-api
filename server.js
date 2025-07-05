const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const ApiError = require("./utils/apiError");
const globalErrorMiddleware = require("./middleware/globalErrorMiddleware");
const {dbConnection} = require("./config/dbConnection");
const apiRoute = require('./route/apiRoute');

require('./helpier/response');


// db connection
dbConnection()

if (process.env.APP_ENV === 'local'){
    const morgan = require('morgan');
    app.use(morgan('dev'))
}
app.use(express.json());

//routes
app.use('/api',apiRoute);

//middleware for route not find
app.use((req,res,next)=>{
    next(new ApiError(`route not found ${req.originalUrl}`,400));
})

// Global Error handel middleware
app.use(globalErrorMiddleware)

const port = process.env.APP_PORT || 8000;
const server = app.listen(port,()=>{
    console.log(`app listen on port ${port}`)
})


// handel error outside express as DB connect or any things
process.on('unhandledRejection',(error)=>{
    console.error(`unhandledRejection Error : ${error.name} |${error.message}`)
    server.close(()=>{
        process.exit(1);
    })
})