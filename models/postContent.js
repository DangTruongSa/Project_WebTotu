const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postContentSchema = new Schema({
    postId:{type: ObjectId, ref:'posts'},
    title:{type:String },
    content:{type: String },
    image:{type: String, default: "111"}

});


module.exports = mongoose.model('postContent', postContentSchema)