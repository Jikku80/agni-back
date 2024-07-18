const PatientRecord = require('../Model/PatientRecordModel');
const PatientSubRecord = require('../Model/PatientSubRecordModel');
const Patient = require('../Model/PatientModel');

exports.createPatientRecord = async(req, res) => {
    try{
        if (!req.body.problem) return res.status(400).json({message: "Problem must be provided!"});
        if (!req.body.totalSession) return res.status(400).json({message: "totalSession must be provided"})
        if (!req.body.totalAmount) return res.status(400).json({message: "Total Amount must be provided"})
        const num = parseInt(req.params.id);
        await Patient.find().then(items => {
            items.forEach(async (el) => {
                if (el.phone == num){
                    await PatientRecord.create({
                        totalSession : req.body.totalSession,
                        problem : req.body.problem,
                        subProblem : req.body.subProblem,
                        totalAmount : req.body.totalAmount,
                        patient : el._id,
                        createdAt : Date.now()
                    });
                    const patientRecord = await PatientRecord.find({patient : el._id}).sort({createdAt: -1});
                    res.status(201).json({patientRecord});
                }
            })
        })
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.getAllPatientRecord = async(req, res) => {
    try{
        const patientRecord = await PatientRecord.find();
        res.status(200).json({patientRecord});
    }catch(err){
        console.log('Error!!!!', err);
    }
}

exports.getOnePatientRecord = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        const num = parseInt(req.params.id);
        await Patient.find().then(items => {
            items.forEach(async (element) => {
                if (element.phone == num){
                    const patientRecord = await PatientRecord.find({patient : element._id}).sort({createdAt: -1});
                    if (!patientRecord) return res.status(400).json({message: "No record found !"});
                    res.status(200).json({patientRecord});
                }
            });
        });
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.updatePatientRecord = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        await PatientRecord.findByIdAndUpdate(req.params.id, req.body, {new : true})
        const num = parseInt(req.params.phone);
        await Patient.find().then(items => {
            items.forEach(async (item) => {
                if (item.phone == num){
                    const patientRecord = await PatientRecord.find({patient : item._id}).sort({createdAt: -1});
                    if (!patientRecord) return res.status(400).json({message: "No record found !"});
                    res.status(200).json({patientRecord});
                }
            })
        })
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.deletePatientRecord = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        await PatientRecord.findByIdAndDelete(req.params.id);
        const num = parseInt(req.params.phone);
        await Patient.find().then(items => {
            items.forEach(async (item) => {
                if (item.phone == num){
                    const patientRecord = await PatientRecord.find({patient : item._id}).sort({createdAt: -1});
                    if (!patientRecord) return res.status(400).json({message: "No record found !"});
                    await PatientSubRecord.deleteMany({patientRecord : req.params.id});
                    res.status(200).json({patientRecord});
                }
            })
        })
    }catch(err){
        console.log('Error!!!!', err)
    }
}