const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    specialist: {
        type: String,
        required: true
    },
    date : {
        type: String,
        required: true
    },
    time : {
        type: String,
        required: true
    },
    branch:{
        type: String,
        required: true
    },
    accepted : {
        type: Boolean,
        default : false
    },
    createdAt: {
        type : Date,
        default: Date.now()
    }
})

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;