const express = require('express');
const UserModel = require('../models/users');
var sendMail = require('../utils/sendmail');
const router = express.Router();
const bcryptjs = require('bcryptjs');

// danh sach nguoi dung 
router.get('/get-list-user',async(req,res)=>{
    try{
        const data = await UserModel.find();
        res.json({
            "status":200,
            "messenger":"Danh sach User",
            "data":data
        })
    }catch(error){
        console.log(error);
    }
});
// lay 1 user

// app.get('/user/:id', async (req, res) => {
//     const users = await (UserModel.findById(req.params.id, req.body));
//     try {
//         res.send(users);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });
router.get('/get-user/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await UserModel.findOne({ username: username });
        if (user) {
            res.send(user);
            // res.status(200).json({
            //     status: 200,
            //     messenger: "Thông tin người dùng",
            //     data: user
            // });
        } else {
            res.status(404).json({
                status: 404,
                messenger: "Người dùng không tồn tại"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            messenger: "Lỗi "
        });
    }
});

//DangKy
router.post("/register", async (req, res) => {
    try {
        var {username,email,password} = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const hashPassword = bcryptjs.hashSync(password,salt);
        var accountUser ={
            username,
            email,
            password : hashPassword
        };

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        // so sánh xem trùng tên ko
        const user = await UserModel.findOne({ username : username});
        const emailUser = await UserModel.findOne({ email : email});
        // nếu trung thon bao
        if(user){
            res.json({
                "status":200,
                "messenger":"Tên người dùng đã tồn tại!",
                "data":data
            })
        }
        else if(emailUser){
            res.json({
                "status":201,
                "messenger":"Email đã tồn tại!",
                "data":data
            })
        }
        else if (!emailRegex.test(email)) {
            return res.json({
                "status": 199,
                "message": "Email không hợp lệ",
                "data": []
            });
        }
        else {
            var data = await UserModel.create(accountUser);
            if(data!=null)
            {
                res.json({
                    "status":200,
                    "messenger":"Chúc mừng đăng ký thành công! (♥_♥)",
                    "data":data
                })
            }
            else
            {
                res.json({
                    "status":400,
                    "messenger":"Đăng ký thất bại vui lòng thử lại",
                    "data":[]
                })
            }
        }
        
       
    } catch(error) {
        console.log(error);
    }
});

//dang nhap
router.post("/login", async (req, res) => {
    try {
        var {nameOrEmail,password}=req.body;

        // so sánh xem trùng tên ko
        const user = await UserModel.findOne({
            $or: [
                { username: nameOrEmail },
                { email: nameOrEmail }
            ]
        });
        
        // nếu trung thon bao
        if(user != null && await bcryptjs.compareSync(password,user.password)){
            console.log("thanh cong");
            res.json({
                "status":111,
                "messenger":"Chúc mừng đăng nhập thành công (♥_♥)"
                
            })
        }else{
            console.log("thatbai");
            res.json({
                "status":100,
                "messenger":"Sai tài khoản hoặc mật khẩu!"
            })
        }
    } catch(error) {
        console.log(error);
        
    }
});

// luu diem
router.post("/save-score", async (req, res) => {
    try {
        var {username,score}= req.body;
        const scoreUser = await UserModel.findOne({ username :username});
        
        if(scoreUser!=null){
            scoreUser.score = score ? score : scoreUser.score;
            var data = await scoreUser.save();
            if(data!=null){
                res.json({
                    "status":400,
                    "messenger":"Lưu điểm thành công!(♥_♥) ",
                    "data":[]
                })
            }else{
                es.json({
                    "status":400,
                    "messenger":"Lưu điểm thất bại!",
                    "data":[]
                })
            }
           
        }else{
            res.json({
                "status":400,
                "messenger":"Lưu điểm thất bại! ",
                "data":[]
            })
        }
    } catch(error) {
        console.log(error);
    }
});


// Luu vi tri 

router.post("/save-position", async (req, res) => {
    try {
        var {username,positionX,positionY,positionZ}= req.body;
        const positionUser = await UserModel.findOne({ username :username});
        
        if(positionUser!=null){
            positionUser.positionX = positionX ? positionX : positionUser.positionX;
            positionUser.positionY = positionY ? positionY : positionUser.positionY;
            positionUser.positionZ = positionZ ? positionZ : positionUser.positionZ;

            var data = await positionUser.save();
            if(data!=null){
                res.json({
                    "status":400,
                    "messenger":"Lưu vị trí thành công! (♥_♥)",
                    "data":[]
                })
            }else{
                es.json({
                    "status":400,
                    "messenger":"Lưu vị trí thất bại!",
                    "data":[]
                })
            }
           
        }else{
            res.json({
                "status":400,
                "messenger":"Lưu vị trí thất bại! ",
                "data":[]
            })
        }
    } catch(error) {
        console.log(error);
    }
});




// gui otp

router.post("/send-otp",async function(req,res,next){
    try {

        const randomOtp = Math.floor(Math.random() * (99999 - 10001 + 1)) + 10001;

        var {username,otp}= req.body;
        
        const saveOtp = await UserModel.findOne({ username :username});
        
        if(saveOtp!=null){
            
            saveOtp.otp = otp ? otp : randomOtp;
            const data = await saveOtp.save();
            if(data!=null){
                const mailOption = {
                    from:"Game siêu cấp vip pro <Game102>",
                    to:username,
                    subject:"Mã otp để tạo lại mật khẩu. ",
                    html:"mã otp của bạn là "+randomOtp
                };
                await sendMail.transporter.sendMail(mailOption);
                res.json({
                    "status":200,
                    "messenger":"Gửi otp thành công (♥_♥)",
                });
               
            }else{
                es.json({
                    "status":400,
                    "messenger":"Username không tồn tại!",
                    "data":[]
                })
            }
        }
    } catch (error) {
        res.json({
            "status":210,
            "messenger":"Gủi lại đê (¬_¬) ",
        });

        console.log(error);
    }
});

// cai lai mat khau 

router.post("/reset-pass", async (req, res) => {
    try {
        var {username,password,otp}= req.body;
        const resetPass = await UserModel.findOne({ username :username,otp:otp});
        
        if(resetPass!=null){
            resetPass.password = password ? password : resetPass.password;
            

            var data = await resetPass.save();
            if(data!=null){
                res.json({
                    "status":400,
                    "messenger":"Cài lại mật khẩu thành công!",
                    "data":[]
                })
            }else{
                es.json({
                    "status":4007,
                    "messenger":"Cài lại đê!",
                    "data":[]
                })
            }
           
        }else{
            res.json({
                "status":400,
                "messenger":" thất bại! ",
                "data":[]
            })
        }
    } catch(error) {
        console.log(error);
    }
});

// doi mat khau
router.post("/change-pass", async (req, res) => {
    try {
        const{username,password,newpass}= req.body;
        const changePass = await UserModel.findOne({username :username,password:password});
        
        if(changePass!=null){
            
            changePass.password = newpass? newpass :changePass.newpass;
           
            const data = await changePass.save();
            if(data!=null){
                res.json({
                    "status":400,
                    "messenger":"Đổi xong rùi!",
                    "data":[]
                })
            }else{
                es.json({
                    "status":4007,
                    "messenger":"Thử lại xem !",
                    "data":[]
                })
            }
           
        }else{
            res.json({
                "status":400,
                "messenger":" thất bại! ",
                "data":[]
            })
        }
    } catch(error) {
        console.log(error);
    }
});




module.exports = router;