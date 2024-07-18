const PatientRecord = require('../Model/PatientRecordModel');
const PatientSubRecord = require('../Model/PatientSubRecordModel');

exports.createPatientRecord = async(req, res) => {
    try{
        if (!req.body.treatment) return res.status(400).json({message: "Treatment must be provided!"});
        if (!req.body.session) return res.status(400).json({message: "Session must be provided"})
        if (!req.body.paidAmount) return res.status(400).json({message: "Paid Amount must be provided"})
            
        await PatientSubRecord.create({
            patientRecord : req.body.patientRecord,
            session : req.body.session,
            treatment : req.body.treatment,
            paidAmount : req.body.paidAmount,
            createdAt: Date.now()
        });
        const patientSubRecord = await PatientSubRecord.find({patientRecord : req.params.id}).sort({createdAt: -1})
        const allSessionList = [];
        const allAmountList = [];
        patientSubRecord.forEach(item => {
            allSessionList.push(item.session);
            allAmountList.push(item.paidAmount);
        })
        const patientRecord = await PatientRecord.findOne({_id : req.params.id})
        const totalSessionCompleted = allSessionList.reduce((a, b) => a + b, 0);
        const totalAmountPaid = allAmountList.reduce((a, b) => a + b, 0);
        const leftSession = patientRecord.totalSession - totalSessionCompleted;
        const dueAmount = patientRecord.totalAmount - totalAmountPaid;

        await PatientRecord.findByIdAndUpdate(req.params.id, {$set : {leftSession: leftSession, sessionCompleted: totalSessionCompleted, dueAmount : dueAmount}}, {new : true})

        res.status(200).json({patientSubRecord});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.getOnePatientSubRecord = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        const patientSubRecord = await PatientSubRecord.find({patientRecord : req.params.id}).sort({createdAt: -1});
        res.status(200).json({patientSubRecord});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.updateSubRecord = async(req, res) => {
    try{
        await PatientSubRecord.findByIdAndUpdate(req.params.id, req.body, {new : true});

        const patientSubRecord = await PatientSubRecord.find({patientRecord : req.params.patientRecord}).sort({createdAt: -1})
        const allSessionList = [];
        const allAmountList = [];
        patientSubRecord.forEach(item => {
            allSessionList.push(item.session);
            allAmountList.push(item.paidAmount);
        })
        const patientRecord = await PatientRecord.findOne({_id : req.params.patientRecord})
        const totalSessionCompleted = allSessionList.reduce((a, b) => a + b, 0);
        const totalAmountPaid = allAmountList.reduce((a, b) => a + b, 0);
        const leftSession = patientRecord.totalSession - totalSessionCompleted;
        const dueAmount = patientRecord.totalAmount - totalAmountPaid;

        await PatientRecord.findByIdAndUpdate(req.params.patientRecord, {$set : {leftSession: leftSession, sessionCompleted: totalSessionCompleted, dueAmount : dueAmount}}, {new : true})

        res.status(200).json({patientSubRecord});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.deleteSubRecord = async(req, res) => {
    await PatientSubRecord.findByIdAndDelete(req.params.id)

    const patientSubRecord = await PatientSubRecord.find({patientRecord : req.params.patientRecord}).sort({createdAt: -1})
    const allSessionList = [];
    const allAmountList = [];
    patientSubRecord.forEach(item => {
        allSessionList.push(item.session);
        allAmountList.push(item.paidAmount);
    })
    const patientRecord = await PatientRecord.findOne({_id : req.params.patientRecord})
    const totalSessionCompleted = allSessionList.reduce((a, b) => a + b, 0);
    const totalAmountPaid = allAmountList.reduce((a, b) => a + b, 0);
    const leftSession = patientRecord.totalSession - totalSessionCompleted;
    const dueAmount = patientRecord.totalAmount - totalAmountPaid;

    await PatientRecord.findByIdAndUpdate(req.params.patientRecord, {$set : {leftSession: leftSession, sessionCompleted: totalSessionCompleted, dueAmount : dueAmount}}, {new : true})
    res.status(200).json({patientSubRecord});
}