var mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
  },
  discription: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date()
  },
  postimage: {
    type: String,
  }
});

module.exports = mongoose.model("post", postSchema);