const User = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const config = require('config');
const bcrypt = require('bcrypt');

exports.signUp = async(req, res) => {
    if (!req.body.name) return res.status(400).json({message: 'Please give a name!'})
    if (!req.body.password) return res.status(400).json({message: 'Please provide a password!'});
    try{
        const user = await User.findOne({name : req.body.name});
        if (user) return res.status(400).json({message: 'User with this name already exists!'});
        const newUser = await User.create(req.body);
        if (newUser) {
            const expiry = new Date(Date.now() + config.get('COOKIE_EXPIRES') * 24 * 60 * 60 * 1000)
            const token = jwt.sign({
                name: newUser.name, id: newUser._id
              }, config.get('JWT_SECRET'), { expiresIn: config.get('JWT_EXPIRE') });
            res.cookie('jwt', token, {
                expires: expiry,
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
            });
            res.status(201).json({newUser, token, expiry})
        }
    }catch(err) {
        console.log('Error!!!!', err);
    }
}

exports.register = async(req, res) => {
    if (!req.body.name) return res.status(400).json({message: 'Please give a name!'})
    if (!req.body.password) return res.status(400).json({message: 'Please provide a password!'});
    try{
        const user = await User.findOne({name : req.body.name});
        if (user) return res.status(400).json({message: 'User with this name already exists!'});
        const newUser = await User.create(req.body);
        if (newUser) {
            const expiry = new Date(Date.now() + config.get('COOKIE_EXPIRES') * 24 * 60 * 60 * 1000)
            const token = jwt.sign({
                name: newUser.name, id: newUser._id
              }, config.get('JWT_SECRET'), { expiresIn: config.get('JWT_EXPIRE') });
            res.status(201).json({newUser, token, expiry})
        }
    }catch(err) {
        console.log('Error!!!!', err);
    }
}

exports.login = async(req, res) => {
    if (!req.body.name) return res.status(400).json({message: 'Please give your username!'})
    if (!req.body.password) return res.status(400).json({message: 'Please provide your password!'});
    try{
        const user = await User.findOne({name : req.body.name});
        if (!user) return res.status(400).json({message: 'User name does not match!'})
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            return res.status(400).json({message: 'Password does not match!'})
        }else{
            const expiry = new Date(Date.now() + config.get('COOKIE_EXPIRES') * 24 * 60 * 60 * 1000)
            const token = jwt.sign({
                name: user.name, id: user._id
              }, config.get('JWT_SECRET'), { expiresIn: config.get('JWT_EXPIRE') });
            res.status(200).json({user, token, expiry});
        }
    }catch(err){
        console.log('Error!!!!', err);
    }
}

exports.logout = (req,res) => {
    const expiry = new Date(Date.now() + 10 * 1000);
    res.cookie('jwt', 'loggedout', {
        expires: expiry,
        httpOnly: true
    });
    res.status(200).json({ status: 'success', message: "You logged out!", expiry });
}

exports.isLoggedIn = async(req, res, next) => {
    if (req.cookies.jwt) {
        try{
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                config.get("JWT_SECRET")
            ); 
            const user = await User.findOne({_id : decoded.id})
    
            if (!user) {
                res.status(401).json({message: "User not found!"})
                return next();
            }
    
            res.locals.user = user;
            return next();
        }catch(err){
            console.log('Error!!!!', err)
        }
    }
    return res.status(401).json({message: "You are not logged in!"})
}

exports.getUser = async(req,res) => {
    try{
        const token = (req.params.token).slice(4);
        const decoded = await promisify(jwt.verify)(
            token,
            config.get("JWT_SECRET"));
        const user = await User.findOne({ _id: decoded.id}, '-password');
        if (!user) return res.status(400).json({message: 'no user found!'});
        return res.status(200).json({user});
    }catch(Err){
        console.log('Error!!!!', Err);
    }
}