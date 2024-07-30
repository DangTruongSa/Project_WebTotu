const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const forumCommentModel = require('../models/forumComment');
const forumThreadModel = require('../models/forumThread');
const authenticate = require('../routes/authenticate');

// danh sách tất cà các bài đăng 

router.get('/get-list-forum-thread',async(req,res)=>{
    try{
        const data = await forumThreadModel.find();
        res.json({
            "status":200,
            "messenger":"Danh sach các bài đăng",
            "data":data
        })
    }catch(error){
        console.log(error);
    }
});


// tạo 1 câu hỏi mới 

router.post("/create-forum-thread/:userId", async (req, res) => {
    try {
        var {title,content} = req.body;
        const userId = req.params.userId;
        
        var newThread ={
            userId,
            title,
            content
        };
        console.log(" tên "+userId);
        var data = await forumThreadModel.create(newThread);
        res.json({
            "status":200,
            "messenger":"Chúc mừng thành công! (♥_♥)",
            "data":data
        })
    } catch(error) {
        console.log(error);
    }
});

// tạo 1 bình luận mới  

router.post("/create-forum-comments/:thread/:userId", async (req, res) => {
    try {
        var {content} = req.body;
        const userId = req.params.userId;
        const thread = req.params.thread;
        var newComments ={
            userId,
            thread,
            content
        };
        console.log(" tên "+userId);
        var data = await forumCommentModel.create(newComments);
        res.json({
            "status":200,
            "messenger":"Chúc mừng thành công! (♥_♥)",
            "data":data
        })
        
        
    } catch(error) {
        console.log(error);
    }
});

// xem binh luan dua theo id binh luan

router.get('/get-list-forum-comments/:thread',async(req,res)=>{
    try{

        const thread = req.params.thread;

        const userComments = await forumCommentModel.find({ thread: thread });
        if (userComments) {
            res.send(userComments);
        } else {
            res.status(404).json({
                status: 404,
                messenger: "ko timf thaays id comments"
            });
        }
        
    }catch(error){
        console.log(error);
    }
});


module.exports = router;