const express=require('express');
const router=express.Router();
const {addVaccine,editVaccine,getVaccine,upcomingVaccineDrives,deleteVaccine}=require('../controller/vaccineController');

router.get('/',getVaccine);
router.post('/add',addVaccine)
router.put('/:id',editVaccine);
router.get('/upcoming',upcomingVaccineDrives)
router.delete('/:id',deleteVaccine);

module.exports=router;