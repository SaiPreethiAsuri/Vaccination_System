const vaccineConfig = {
    app:{
        name:'Vaccination App',
        version:'1.0.0',
        port:process.env.PORT || 5000,
        environment:process.env.NODE_ENV || 'development',
    },
    database:{
        url:process.env.DB_URL || 'mongodb://localhost:27017/schoolVaccine',
    },
    logging:{
        level: process.env.LOG_LEVEL || 'info',
    },
}
module.exports=vaccineConfig;