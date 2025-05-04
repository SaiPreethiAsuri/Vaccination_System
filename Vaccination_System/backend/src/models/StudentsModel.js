const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    ID: {
        type: String,
        required: true,
        unique: true
    },
    vaccinationStatus: [{
        vaccine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vaccine',
        },
        status: {
            type: Boolean,
            required: true,
        },
        _id: false,
    }],
});
module.exports = mongoose.model('Student', studentSchema);