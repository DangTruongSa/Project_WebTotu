const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = new Schema({
    id: { type: ObjectId },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    joindate: { type: Date, default: Date.now },
    role: { type: Number, default: 1 },// 1 = user / 2 admin viết bài / 3 ad quản lý toàn bộ
    status: { type: Number, default: 1 },// 1 trạng thái bình thường // 0 trạng thái bị khóa 
    avatar: { type: String, default: "dfd" },
});


User.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret', { expiresIn: '1h' }); // Set expiration
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
User.statics.findByCredentials = async (nameOrEmail, password) => {
    const user = await User.findOne({
        $or: [
            { username: nameOrEmail },
            { email: nameOrEmail }
        ]
    });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};


module.exports = mongoose.model('users', User)