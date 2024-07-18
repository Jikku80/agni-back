const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
    patient : {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient record must belong to a patient']
    },
    totalSession : {
        type: Number,
        required : true
    },
    leftSession : {
        type: Number,
        default : 0
    },
    sessionCompleted: {
        type: Number,
        default : 0
    },
    problem : {
        type: String,
        required: true
    },
    subProblem : {
        type: String,
        default : "None"
    },
    totalAmount : {
        type : Number,
        required : true
    },
    dueAmount : {
        type: Number
    },
    createdAt: {
        type: Date,
        default : Date.now()
    }

})

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;