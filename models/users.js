const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    id: { type: ObjectId },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    joindate: { type: Date, default: Date.now },
    role: { type: Number, default: 1 },// 1 = user / 2 admin
    status: { type: Number, default: 1 },// 1 trạng thái bình thường // 0 trạng thái bị khóa 
    avatar: { type: String, default: "dfd" }
});


module.exports = mongoose.model('users', User)