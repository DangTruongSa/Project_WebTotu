const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postsSchema = new Schema({
    categoryId: {type: ObjectId, ref: 'category' },
    postId:{type: ObjectId},
    userId:{type: ObjectId, ref:'users'},
    title:{type: String}
});


module.exports = mongoose.model('posts', postsSchema)
