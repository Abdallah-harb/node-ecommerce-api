const mongoose = require("mongoose")
const dbConnection = ()=>{
    mongoose.connect(process.env.DB_URL).then((conn)=>{
        console.log(`DB connect : ${conn.connection.host}`);
    }).catch((error)=>{
        console.error(`DB Error : ${error}`);
        process.exit(1);
    })
}

module.exports = {dbConnection}