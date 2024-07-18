const mongoose = require('mongoose');

const patientSubRecordSchema = new mongoose.Schema({
    patientRecord : {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient sub record must belong to a patient']
    }, 
    session : {
        type: Number,
        required: true
    },
    treatment : {
        type: String,
        required: true
    },
    paidAmount : {
        type: Number,
        requried: true
    },
    createdAt : {
        type: Date,
        default: Date.now()
    }
})

const PatientSubRecord = mongoose.model('PatientSubRecord', patientSubRecordSchema);

module.exports = PatientSubRecord;