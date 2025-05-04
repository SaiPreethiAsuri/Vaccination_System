const mongoose=require('mongoose');
const schema=mongoose.Schema;

const vaccineSchema=new schema({
    vaccineId:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:String,
        required:true,
    },
    available:{
        type:Number,
        required:true,
    },
    vaccineName:{
        type:String,
        required:true,
    },
    applicableClasses:{
        type:[String],
        required:true,
    }
});
const vaccineModal=mongoose.model('Vaccine',vaccineSchema);
module.exports=vaccineModal;