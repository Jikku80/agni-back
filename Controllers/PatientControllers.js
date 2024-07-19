const Patient = require('../Model/PatientModel');
const PatientRecord = require('../Model/PatientRecordModel');
const PatientSubRecord = require('../Model/PatientSubRecordModel');

exports.createPatient = async(req, res) => {
    try{
        if (!req.body.name) return res.status(400).json({message: "Name must be provided!"});
        if (!req.body.phone) return res.status(400).json({message: "Phone number must be provided"})
        if (!req.body.age) return res.status(400).json({message: "Age must be provided!"});
        if (!req.body.gender) return res.status(400).json({message: "Gender must be provided"})
        if (!req.body.address) return res.status(400).json({message: "Address must be provided!"});
        if (!req.body.opdno) return res.status(400).json({message: "Please provide patient opd no!"})
        if (!req.body.branch) return res.status(400).json({message: "Please provide a branch"});
        
        const emaillistedPatient = await Patient.findOne({email : req.body.email});
        if (emaillistedPatient) return res.status(400).json({message: 'Patient with this email already listed!'})
        const patient = await Patient.create({
            name : req.body.name,
            phone : req.body.phone,
            email : req.body.email,
            age : req.body.age,
            gender : req.body.gender,
            address : req.body.address,
            opdno: req.body.opdno,
            uopd: `${req.body.branch}-${req.body.opdno}`,
            branch: req.body.branch,
            createdAt: Date.now()
        }).then(async (item) => {
            await PatientRecord.create({
                patient : item._id,
                totalSession : req.body.totalSession,
                problem : req.body.problem,
                subProblem : req.body.subProblem,
                totalAmount : req.body.totalAmount
            })
        });
        res.status(201).json({patient});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.getAllPatient = async(req, res) => {
    try{
        const paginate = (req.params.paginate)*1;
        let currentPage = 1;
        currentPage = currentPage + paginate;
        const getAllPatient = await Patient.find();
        const pageSize = 50;
        const totalPage = Math.ceil(getAllPatient.length / pageSize);
        const patient = await Patient.find().sort({createdAt: -1}).skip(pageSize * (currentPage - 1)).limit(pageSize);
        res.status(200).json({patient, totalPage, pageSize});
    }catch(err){
        console.log('Error!!!!', err);
    }
}

exports.getOnePatient = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        const patient = await Patient.findOne({_id : req.params.id});
        if (!patient) return res.status(400).json({message: "No patient found !"});
        res.status(200).json({patient});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.getPatientByPhone = async(req,res) => {
    try{
        if (!req.params.phone) return res.status(400).json({message: "Please provide a number!"});
        const lower = (req.params.phone).toLowerCase();
        await Patient.find().then(items => {
            items.forEach(item => {
                if (item.uopd == lower) {
                    const patient = item.name;
                    res.status(200).json({patient});
                }else{
                    return res.status(400).json({message: "No patient found !"});
                }
            })
        });
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.updatePatient = async(req, res) => {
    try{
        if (!req.body.name) return res.status(400).json({message: "Name must be provided!"});
        if (!req.body.phone) return res.status(400).json({message: "Phone number must be provided"})
        if (!req.body.age) return res.status(400).json({message: "Age must be provided!"});
        if (!req.body.gender) return res.status(400).json({message: "Gender must be provided"})
        if (!req.body.address) return res.status(400).json({message: "Address must be provided!"});
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        if (!req.body.opdno) return res.status(400).json({message: "Please provide patient opd no!"})
        if (!req.body.branch) return res.status(400).json({message: "Please provide a branch"});

        await Patient.findByIdAndUpdate(req.params.id, req.body, {new : true})
        const patient = await Patient.find().sort({createdAt: -1});
        res.status(200).json({patient})
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.deletePatient = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        await Patient.findByIdAndDelete(req.params.id);
        const patientRecord = await PatientRecord.findOne({patient : req.params.id});
        await PatientRecord.deleteMany({patient : req.params.id});
        await PatientSubRecord.deleteMany({patientRecord : patientRecord.id});
        const patient = await Patient.find().sort({createdAt: -1});
        res.status(200).json({patient});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

const pagination = function (array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

exports.searchPatient = async(req, res) => {
    try{
        if (!req.params.name) return res.status(400).json({message: "Please provide a id!"});
        const searchVal = (req.params.name).toLowerCase();
        const paginate = (req.params.paginate)*1;
        let currentPage = 1;
        currentPage = currentPage + paginate;
        const pageSize = 50;
        let patient = [];
        await Patient.find().then(items => {
            items.forEach(item => {
                const name = (item.name).toLowerCase();
                const phone  = item.phone
                if (name.includes(searchVal) || phone == searchVal || item.branch == searchVal || item.uopd == searchVal) return patient.push(item);
            })
        })
        const totalPage = Math.ceil(patient.length / pageSize);
        patient = pagination(patient, pageSize, currentPage);
        res.status(200).json({patient, totalPage, pageSize});
    }catch(err) {
        console.log('Error!!!!', err);
    }
}