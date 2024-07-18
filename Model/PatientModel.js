const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique : true
    },
    phone : {
        type: Number,
        required: true,
        unique : true
    },
    address : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required: true
    },
    age : {
        type : Number,
        required : true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;