const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default : "user"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12)
})

const User = mongoose.model('User', userSchema);

module.exports = User;