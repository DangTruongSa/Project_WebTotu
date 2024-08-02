const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
    categoryId: {type: ObjectId},
    name: { type: String, required: true },
    description: {type: String},
    status:{type:Number,default:1} // 1 là trạng thái bình thường, 0 là trạng thái bị xóa
});

module.exports = mongoose.model('category', categorySchema)