const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        unique : true
    },
    user : {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Blog must belong to a User']
    },
    Content : {
        type: String
    },
    createdAt: {
        type : Date,
        default: Date.now()
    }
})

const Blog = mongoose.model('BlogSchema', blogSchema);

module.exports = Blog