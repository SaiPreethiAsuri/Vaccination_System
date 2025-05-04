const express=require('express');
const { getMetrics } = require('../controller/metricsController');
const router=express.Router();

router.get('/',getMetrics);

module.exports=router;