const mongoose = require("mongoose");

const Blogchema = mongoose.Schema(
  {
    Title: {
      type: String,
      requied: [true, "Please enter your name"],
    },
    Content: {
      type: String,
      requied: [true, "Please enter some content"],
    },
  },
  {
    timestamps: true,
  }
);


const Blog=mongoose.model("Blog",Blogchema);

module.exports=Blog;