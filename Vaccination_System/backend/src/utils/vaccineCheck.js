const vaccineModal = require('../models/VaccineModal');
checkVaccineDate = async (vaccineDate) => {
    const today = new Date();
    const vaccineDateObj = new Date(vaccineDate);
    if(vaccineDateObj<today){
        return {
            message: 'Vaccine Date should be in the future',
        }
    }
    const diffTime = Math.abs(vaccineDateObj - today);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 15) {
        const vaccine = await vaccineModal.findOne({ date: vaccineDate });
        console.log(vaccine);
        if (vaccine) {
            return {
                message: 'This date is not available',
            }
        }
    }
    else {
        return {
            message: 'Vaccine Date should be at least 15 days in advance',
        }
    }
}

module.exports = {
    checkVaccineDate,
}