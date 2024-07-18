const Blog = require('../Model/BlogModel');

exports.createBlog = async(req, res) => {
    try{
        if (!req.body.title) return res.status(400).json({message: "Title must be provided!"});
        if (!req.body.content) return res.status(400).json({message: "Content must br provided"})
        const blog = await Blog.create(req.body);
        res.status(201).json({blog});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.getAllBlog = async(req, res) => {
    try{
        const blog = await Blog.find();
        res.status(200).json({blog});
    }catch(err){
        console.log('Error!!!!', err);
    }
}

exports.getOneBlog = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        const blog = await Blog.findOne({_id : req.params.id});
        if (!blog) return res.status(400).json({message: "No blog found !"});
        res.status(200).json({blog});
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.updateBlog = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new : true})
        res.status(200).json({blog})
    }catch(err){
        console.log('Error!!!!', err)
    }
}

exports.deleteBlog = async(req, res) => {
    try{
        if (!req.params.id) return res.status(400).json({message: "Please provide a id!"});
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Blog Deleted"});
    }catch(err){
        console.log('Error!!!!', err)
    }
}