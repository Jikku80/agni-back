const PatientRecord = require('../Model/PatientRecordModel');
const PatientSubRecord = require('../Model/PatientSubRecordModel');
const Patient = require('../Model/PatientModel');

exports.createPatientRecord = async(req, res) => {
    try{
        if (!req.body.problem) return res.status(400).json({message: "Problem must be provided!"});
        if (!req.body.totalSession) return res.status(400).json({message: "totalSession must be provided"})
        if (!req.body.totalAmount) return res.status(400).json({message: "Total Amount must be provided"})
        const num = (req.params.id).toLowerCase();
        await Patient.find().then(items => {
            items.forEach(async (el) => {
                if (el.uopd == num){
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
        const lower = (req.params.id).toLowerCase();
        await Patient.find().then(items => {
            items.forEach(async (element) => {
                if (element.uopd == lower){
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
        const oldPatientRecord = await PatientRecord.findOne({_id : req.params.id})
        const totalAmount = oldPatientRecord.totalAmount;
        const dueAmount = oldPatientRecord.dueAmount;
        const amount = totalAmount - dueAmount;
        const newDueAmount = req.body.totalAmount - amount;

        const sessionCompleted = oldPatientRecord.sessionCompleted;
        const totalSession = req.body.session * 1;
        const newLeftSession = totalSession - sessionCompleted;
        await PatientRecord.findByIdAndUpdate(req.params.id, {
            totalSession : totalSession,
            problem : req.body.problem,
            subProblem : req.body.subProblem,
            totalAmount : req.body.totalAmount,
            dueAmount : newDueAmount,
            sessionCompleted : sessionCompleted,
            leftSession: newLeftSession
        }, {new : true})
        const num = (req.params.phone).toLowerCase();
        await Patient.find().then(items => {
            items.forEach(async (item) => {
                if (item.uopd == num){
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
        const num = (req.params.phone).toLowerCase();
        await Patient.find().then(items => {
            items.forEach(async (item) => {
                if (item.uopd == num){
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