const express = require('express');
const router = express.Router();
const PostModel = require('../models/posts');
const PostContentModel = require('../models/postContent');
const CategotyModel = require('../models/category');


// them thu vien
// chi danh admin
router.post("/create-category", async (req, res) => {
    try {
        var {name,description} = req.body;
        var newCategory ={
            name,
            description
        };
        
        var data = await CategotyModel.create(newCategory);
        res.json({
            "status":200,
            "messenger":"Chúc mừng theem loai  thành công! (♥_♥)",
            "data":data
        })
    } catch(error) {
        console.log(error);
    }
});

// xem thu vien

router.get("/list-category", async (req, res)=>{
    try {
        const data = await CategotyModel.find();
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
        const categoryId = '66acc66e27fc1c58e21db2cd';
        const userId = req.params.userId;
        var newPost ={
            categoryId,
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

router.post("/create-post-content/:postId", async (req, res) => {
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

// xem bài đăng 

router.get("/get-list-posts", async (req, res)=>{
    console.log("thong a=bao")
    try {
        const data = await PostModel.find();
        res.json({
            "status":200,
            "messenger":"Chúc mừng thành công!",
            "data": data
        });
    } catch (error) {
        
    }
});

router.get("/list-post-content/:postId", async (req, res)=>{
    try {
        const postId = req.params.postId;

        const data = await PostContentModel.find({postId});
        res.json({
            "status":200,
            "messenger":"Chúc mừng thành công!",
            "data":data
        })
    } catch (error) {
        
    }
});




module.exports = router;