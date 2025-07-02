const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
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

const port = process.env.APP_PORT || 8000;
app.listen(port,()=>{
    console.log(`app listen on port ${port}`)
})