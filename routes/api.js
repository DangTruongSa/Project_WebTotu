const express = require('express');
const UserModel = require('../models/users');
var sendMail = require('../utils/sendmail');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// // có thể tạo 1 file js mới để thêm phần natf vào 
//Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'ddnrkaryl',
    api_key: '664817628368138',
    api_secret: 'oHqbm-AMdMs1b2ZviIluMf7hNq8'
});

// Cấu hình lưu trữ với Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars', // Thư mục trên Cloudinary
        format: async (req, file) => 'png', // Định dạng file
        public_id: (req, file) => file.fieldname + '-' + Date.now() // Tên file
    },
});

const upload = multer({ storage: storage });


router.post('/upload-image', upload.single('avatar'), async (req, res) => {
    try {
        const { username } = req.body; 
        const user = await UserModel.findOne({ username: username }); 
        const file = req.file; 

        if (!user) {
            return res.status(400).json({
                "status": 400,
                "message": "Người dùng không tồn tại!",
                "data": []
            });
        }
        // Xóa ảnh cũ
        if (user.avatar) {
            
            const public_id = user.avatar.split('/').slice(7).join('/').split('.')[0];
            console.log(public_id);
            await cloudinary.uploader.destroy(public_id);
        }

        // Cập nhật avatar mới
        const urlImage = file ? file.path : null;
        user.avatar = urlImage ? urlImage : user.avatar;
        const data = await user.save(); // Lưu người dùng vào cơ sở dữ liệu

        if (data) {
            res.json({
                "status": 200,
                "message": "Lưu thành công!(♥_♥)",
                "data": []
            });
        } else {
            res.status(400).json({
                "status": 400,
                "message": "Lưu thất bại!",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật ảnh đại diện:', error);
        res.status(500).send('Lỗi khi cập nhật ảnh đại diện!');
    }
});



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images'); // Địa chỉ lưu ảnh
//     },
//     filename: (req, file, cb) => {
        
//         cb(null, file.fieldname + "-" + Date.now() + file.originalname); // Đặt tên file 
//     }
// });

// const upload = multer({ storage: storage });

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

//tải ảnh lên 
// router.post('/upload-image', upload.single('avatar'), async (req, res) => {
//     try {
//         var {username} = req.body;

//         const userName = await UserModel.findOne({username : username })

//         const file = req.file;
//         const urlsImage = file ? `${req.protocol}://${req.get("host")}/images/${file.filename}`: null;

//         if(userName != null){

//             if (username.avatar) {
//                 const oldImagePath = path.join(__dirname, '..', 'public', 'images', path.basename(userName.avatar));
//                 fs.unlink(oldImagePath, (err) => {
//                     if (err) {
//                         console.error('Lỗi khi xóa ảnh cũ:', err);
//                     } else {
//                         console.log('Đã xóa ảnh cũ thành công.');
//                     }
//                 });
//             }
    
//             userName.avatar = urlsImage ? urlsImage : userName.avatar;
//             var data = await userName.save();

//             if(data!=null){
//                 res.json({
//                     "status":400,
//                     "messenger":"Lưu thành công!(♥_♥) ",
//                     "data":[]
//                 })
//             }else{
//                 res.json({
//                     "status":400,
//                     "messenger":"Lưu thất bại!",
//                     "data":[]
//                 })
//             }
//         }
//         else{
//             res.json({
//                 "status":400,
//                 "messenger":"Lưu thất bại!",
//                 "data":[]
//             })
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Lỗi khi cập nhật ảnh đại diện!');
//     }
// });

// luu diem
router.post("/save-score", async (req, res) => {
    try {
        var {username,score}= req.body;
        const scoreUser = await UserModel.findOne({ username : username});
        
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
                res.json({
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



router.use('/images', express.static('images'));
module.exports = router;