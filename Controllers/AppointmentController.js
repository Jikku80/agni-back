const Appointment = require('../Model/AppointmentModel');
const sendEmail = require('../util/mail');

exports.createAppointment = async (req, res) => {
    if (!req.body.name) return res.status(400).json({"message": "Please give your name!"})
    if (!req.body.email) return res.status(400).json({"message": "Please provide your email address!"})
    if (!req.body.message) return res.status(400).json({"message": "Please provide message why you or what you want appointment on!"})
    if (!req.body.date) return res.status(400).json({"message": "Please provide an appointment date"})
    if (!req.body.time) return res.status(400).json({"message": "Please provide a time for your appointment!"})
    if (!req.body.specialist) return res.status(400).json({message: "Please provide a specialist!"})

    try{
        const appointment = await Appointment.create(req.body)
        res.status(201).json({appointment});
    }
    catch(err){
        console.log('Error!!!!',err)
    }
}

exports.getAllAppointment = async (req, res) => {
    try{
        const paginate = (req.params.paginate)*1;
        let currentPage = 1;
        currentPage = currentPage + paginate;
        const getAllAppointment = await Appointment.find();
        const pageSize = 50;
        const totalPage = Math.ceil(getAllAppointment.length / pageSize);
        const appointment = await Appointment.find().sort({createdAt: -1}).skip(pageSize * (currentPage - 1)).limit(pageSize);
        res.status(200).json({appointment, totalPage, pageSize});
    }catch(err) {
        console.log('Error!!!!', err)
    }
}

exports.updateAppointmentAcceptance = async(req, res) => {
    try{
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, {$set : {accepted: true}}, {new : true}).sort({createdAt: -1})
        sendEmail(appointment)
        res.status(200).json({appointment});
    }catch(err){
        console.log('Error!!!!', err);
    }
}

exports.deleteAppointment = async(req, res) => {
    try{
        await Appointment.findByIdAndDelete({_id : req.params.id});
        const appointment = await Appointment.find().sort({createdAt: -1});
        res.status(200).json({
            status: 'success',
            appointment
        });
    }catch(Err){
        console.log('Error!!!!', Err);
    }
}

const pagination = function (array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}


exports.searchAppointment = async(req, res) => {
    try{
        const paginate = (req.params.paginate)*1;
        let currentPage = 1;
        currentPage = currentPage + paginate;
        let appointment = [];
        const allAppointment = [];
        const name = (req.params.name).toLowerCase()
        const pageSize = 50;
        await Appointment.find().sort({createdAt : -1}).then((items) => {
            items.forEach(item => {
                const itemName = (item.name).toLowerCase();
                const itemSpecialist = (item.specialist).toLowerCase()
                if ( itemName.includes(name)  ||  itemSpecialist.includes(name)) {
                    allAppointment.push(item);
                    appointment.push(item);
                }
            })
        });

        appointment = pagination(appointment, pageSize, currentPage);

        const totalPage = Math.ceil(allAppointment.length / pageSize);
        res.status(200).json({appointment, totalPage, pageSize});
    }catch(err) {
        console.log('Error!!!!', err)
    }
}

exports.filterAppointment = async(req, res) => {
    try{
        const paginate = (req.params.paginate)*1;
        let currentPage = 1;
        currentPage = currentPage + paginate;
        const allAppointment = await Appointment.find({ date : req.params.date });
        const pageSize = 50;
        const appointment = await Appointment.find({ date : req.params.date }).sort({createdAt: -1}).skip(pageSize * (currentPage - 1)).limit(pageSize);
        const totalPage = Math.ceil(allAppointment.length / pageSize);
        res.status(200).json({appointment, totalPage, pageSize});
    }catch(err) {
        console.log('Error!!!!', err)
    }
}

exports.filterTime = async(req, res) => {
    try{
        const time = [];
        await Appointment.find({ date : req.params.date }).then((items) => {
            items.forEach(item => {
                time.push(item.time);
            })
        })
        res.status(200).json({time});
    }catch(err) {
        console.log('Error!!!!', err)
    }
}