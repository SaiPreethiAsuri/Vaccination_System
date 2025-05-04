require('dotenv').config()

const express=require('express');

const cors=require('cors')
const app=express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose');
const vaccineConfig = require('./config/vaccineConfig');
const {authenticated}=require('./middleware/auth');
const adminRoutes=require('./routes/adminRoutes');
const studentRoutes=require('./routes/studentRoutes');
const vaccineRoutes=require('./routes/vaccineRoutes');
const metricsRoutes=require('./routes/metricsRoutes');

app.use('/admin',adminRoutes)
app.use('/student',authenticated,studentRoutes)
app.use('/vaccine',authenticated,vaccineRoutes)
app.use('/metrics',authenticated,metricsRoutes)


mongoose.connect(vaccineConfig.database.url).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


    // const firstUser=async()=>{
    //     const user=new adminModel({
    //         username:'admin',
    //         password:'admin',
    //     })
    //     await user.save()
    // }
    
    // firstUser()

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));