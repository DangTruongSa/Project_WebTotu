const jwt = require('jsonwebtoken');
const UserModel = require('../models/users'); // Đảm bảo import đúng model User

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('Received Token:', token); // Log token nhận được
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Sử dụng đúng secret key
        console.log('Decoded Token:', decoded); // Log thông tin token sau khi decode
        const user = await UserModel.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error('User not found');
        }

        console.log('Authenticated User:', user); // Log thông tin người dùng sau khi xác thực
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authenticate;