const express = require('express');
const router = express.Router();
const PostModel = require('../models/posts');
const PostContentModel = require('../models/postContent');
const CategotyModel = require('../models/category');

// them thu vien
// chi danh admin
router.post("/create-categoty", async (req, res) => {
    try {
        var {name,description,status} = req.body;
        
        var newCategory ={
            name,
            description,
            status
        };
        
        var data = await CategotyModel.create(newCategory);
        res.json({
            "status":200,
            "messenger":"Chúc mừng thành công! (♥_♥)",
            "data":data
        })
    } catch(error) {
        console.log(error);
    }
});

// xem thu vien

router.post("/list-category", async (req, res)=>{
    try {
        const data = CategotyModel.find();
        res.json({
            "status":200,
            "messenger":"Chúc mừng thành công!",
            "data":data
        })
    } catch (error) {
        
    }
});

// tạo bài đăng 

router.post("/create-post/:userId", async (req, res) => {
    try {
        var {title} = req.body;
        
        const userId = req.params.userId;
        var newPost ={
            title,
            userId
        };
        
        var data = await PostModel.create(newPost);
        res.json({
            "status":200,
            "messenger":"Post thành công! (♥_♥)",
            "data":data
        })
    } catch(error) {
        console.log(error);
    }
});

// nội dung bài đăng // còn phần ảnh để xử lý sau

router.post("/create-post/:postId", async (req, res) => {
    try {
        var {title,content} = req.body;
        
        const postId = req.params.postId;
        var newPostContent ={
            title,
            content,
            postId
        };
        
        var data = await PostContentModel.create(newPostContent);
        res.json({
            "status":200,
            "messenger":"Post nội dungthành công! (♥_♥)",
            "data":data
        })
    } catch(error) {
        console.log(error);
    }
});


module.exports = router;