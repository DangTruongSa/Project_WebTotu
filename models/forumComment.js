const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const forumCommentSchema = new Schema({
    username: {type: String, ref: 'users' },
    thread: { type: ObjectId, ref: 'forumThread' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('forumComment', forumCommentSchema)