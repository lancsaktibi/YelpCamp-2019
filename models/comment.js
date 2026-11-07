// import mongoose
var mongoose = require("mongoose");

// setup db schema
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// return data to main app
module.exports = mongoose.model("Comment", commentSchema);