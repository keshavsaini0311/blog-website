//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const _ = require("lodash");
const mongoose = require('mongoose');
const Blog = require('./models/blog.model');


const port=process.env.port||3000;
const homeStartingContent = "Welcome to my daily journal, your personal window into the everyday adventures of life! Step into a realm where each day unfolds as a new chapter, filled with moments of introspection, growth, and discovery.Join me on a journey through the intricacies of daily life, where the ordinary transforms into the extraordinary. From small triumphs to profound reflections, I invite you to witness the raw and unfiltered essence of each day as it unfolds.Explore the highs and lows, the joys and challenges, and the lessons learned along the way. Through the pages of my daily journal, find inspiration, solace, and perhaps a glimpse into your own experiences mirrored in mine.Let's embark on this journey together, embracing the beauty of imperfection and finding meaning in the mundane. Your presence here is not just welcomed, but cherished as we navigate the tapestry of life, one day at a time.Begin your exploration now and uncover the treasures hidden within the pages of my daily journal. Welcome to a space where authenticity reigns supreme, and every moment is worth celebrating.";
const aboutContent = " ";
const contactContent = "";

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
  res.render("sign-in",{incorrect:""});
})

app.post("/sign-in",async(req,res)=>{
  let email=req.body.email;
  let password=req.body.password;
  if(email==process.env.email&&password==process.env.password){
    res.render("compose");
  }else{
    res.render("sign-in",{incorrect:"Email and Password do not match"});
  }
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
