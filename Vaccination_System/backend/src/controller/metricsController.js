const StudentsModel=require('../models/StudentsModel')
const VaccineModal=require('../models/VaccineModal')

getMetrics=async(req,res)=>{
    try{
        const students=await StudentsModel.find()
        const vaccines=await VaccineModal.find()
        const totalStudents=students.length;
        const totalVaccines=vaccines.length;
        const vaccinatedCount = students.reduce((count, student) => {
            const isVaccinated = student.vaccinationStatus.some(vaccine => vaccine.status === true);
            return isVaccinated ? count + 1 : count;
        }, 0);
        const vaccinatedStudentsPercentage = ((vaccinatedCount / totalStudents) * 100).toFixed(2);
        const unvaccinatedStudentsPercentage = (100 - vaccinatedStudentsPercentage).toFixed(2);

        res.status(200).json({
            message:'Metrics Retrieved Successfully',
            data:{
                totalStudents,
                totalVaccines,
                vaccinatedCount,
                vaccinatedStudentsPercentage,
                unvaccinatedStudentsPercentage
            }
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message,
        })
    }
}
module.exports={getMetrics}