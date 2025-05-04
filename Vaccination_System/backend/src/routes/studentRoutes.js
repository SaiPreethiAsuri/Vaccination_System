const express=require('express');
const router=express.Router();
const upload = require('../middleware/fileUpload');
const {getStudents,addStudent,editStudent,getStudent,updateStudentsVaccinationStatus,deleteVaccinationRegistraion,bulkUpload, deleteStudent}=require('../controller/studentController');

router.get('/',getStudents);
router.post('/add',addStudent);
router.put('/:id',editStudent);
router.get('/:id',getStudent);
router.put('/:studentId/vaccination-status/:vaccineId',updateStudentsVaccinationStatus);
router.post('/bulk-upload',upload.single('file'),bulkUpload);
router.delete('/:id',deleteStudent)
router.delete('/:studentId/:vaccineId',deleteVaccinationRegistraion);
module.exports=router;
