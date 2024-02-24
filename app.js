//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const _ = require("lodash");
const mongoose = require('mongoose');
const Blog = require('./models/blog.model');


const port=process.env.port||3000;
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

require('dotenv').config();
const username=process.env.mongoDBusername;
const password=process.env.mongoDBpassword;
mongoose.connect("mongodb+srv://"+username+":"+password+"@backend.b6ixj7e.mongodb.net/node?retryWrites=true&w=majority&appName=backend")
.then(()=>{
    console.log("connected");
})
.catch(()=>{
    console.log("connection failed");
})

let isfound=true;
var POSTS=[];


app.get("/",async(req,res)=>{
  isfound=true;
  POSTS= await Blog.find({}).exec();
  res.render("home",{Homecontent:homeStartingContent,POSTS:POSTS});
})

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
})


app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
})

app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",async(req,res)=>{

  let blog=new Blog({
    Title:_.capitalize(req.body.heading),
    Content:req.body.post
  });
  await blog.save();
  var post={
    heading:req.body.heading,
    content:req.body.post
  }
  res.redirect("/");
})


app.get("/posts/:heading",async(req,res)=>{
  let current= await Blog.findOne({ Title:_.capitalize(req.params.heading) }).exec();
  if(current==null){
    isfound=false;
    res.redirect("/");
  }else{
  let currentheading=current.Title;
  let currencontent=current.Content;
    res.render("post",{heading:currentheading,content:currencontent});}
  })


app.listen(port, function() {
  console.log("Server started on port 3000");
});
