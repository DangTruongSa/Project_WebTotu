
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const forumThreadSchema = new Schema({
    username: {type: String, ref:'users'},
    title: {type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: ObjectId, ref: 'forumComment' }],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('forumThread', forumThreadSchema)