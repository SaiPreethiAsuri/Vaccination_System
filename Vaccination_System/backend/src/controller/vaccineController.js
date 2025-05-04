const vaccineModal = require('../models/VaccineModal');
const studentModel = require('../models/StudentsModel');
const { checkVaccineDate } = require('../utils/vaccineCheck');
addVaccine = async (req, res) => {
    try {
        const { name, available, date, classes, vaccineId } = req.body;
        const vaccineExists = await vaccineModal.findOne({ vaccineId: vaccineId });
        if (vaccineExists) {
            return res.status(409).json({
                message: 'Vaccine Already Exists',
            })
        }
        const dateCheck = await checkVaccineDate(date);
        if (dateCheck) {
            return res.status(409).json({
                message: dateCheck.message,
            })
        }
        const vaccine = await vaccineModal.create({
            vaccineId,
            vaccineName: name,
            available,
            date,
            applicableClasses: classes,
        });
        res.status(200).json({
            message: 'Vaccine Added Successfully',
            data: vaccine
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
editVaccine = async (req, res) => {
    try {
        const { id } = req.params;
        const vaccineExist = await vaccineModal.findOne({ vaccineId: id });
        if (!vaccineExist) {
            return res.status(404).json({
                message: 'Vaccine Not Found',
            })
        }
        if (req.body.date) {
            const dateCheck = await checkVaccineDate(req.body.date);
            if (dateCheck) {
                return res.status(409).json({
                    message: dateCheck.message,
                })
            }
        }
        await vaccineModal.findOneAndUpdate({ vaccineId: id }, { $set: req.body });
        
        res.status(200).json({
            message: 'Vaccine Edited Successfully',
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
getVaccine = async (req, res) => {
    try {
        const vaccines = await vaccineModal.find();
        res.status(200).json({
            message: 'Vaccine Data Retrieved Successfully',
            data: vaccines
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
upcomingVaccineDrives=async(req,res)=>{
    try{
        const vaccines=await vaccineModal.find();
        const today=new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30); // Calculate the date 30 days from today
        const upcomingVaccines=vaccines.filter(vaccine=>{
            const vaccineDate=new Date(vaccine.date);
            return vaccineDate>=today && vaccineDate<=next30Days;
        });
        res.status(200).json({
            message:'Upcoming Vaccine Drives Retrieved Successfully',
            data:upcomingVaccines
        });
    }
    catch(err){
        console.log(err.message);
    }
}
deleteVaccine=async(req,res)=>{
    try{
        const {id}=req.params;
        const vaccine=await vaccineModal.findOne({vaccineId:id});
        const student= await studentModel.updateMany(
            { 'vaccinationStatus.vaccine': vaccine._id }, 
            { $pull: { vaccinationStatus: { vaccine: vaccine._id } } } 
        );
        if(!student){
            return res.status(404).json({
                message:'Student Not Found',
            })
        }
        if(!vaccine){
            return res.status(404).json({
                message:'Vaccine Not Found',
            })
        }
        await vaccineModal.findOneAndDelete({vaccineId:id});
        res.status(200).json({
            message:'Vaccine Deleted Successfully',
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message,
        })
    }

}

module.exports = { addVaccine, editVaccine, getVaccine , upcomingVaccineDrives,deleteVaccine}