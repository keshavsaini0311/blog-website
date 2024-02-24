//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const _ = require("lodash");
const mongoose = require('mongoose');
const Blog = require('./models/blog.model');


const port=process.env.port||3000;
const homeStartingContent = "Welcome to my daily journal, your personal window into the everyday adventures of life! Step into a realm where each day unfolds as a new chapter, filled with moments of introspection, growth, and discovery.Join me on a journey through the intricacies of daily life, where the ordinary transforms into the extraordinary. From small triumphs to profound reflections, I invite you to witness the raw and unfiltered essence of each day as it unfolds.Explore the highs and lows, the joys and challenges, and the lessons learned along the way. Through the pages of my daily journal, find inspiration, solace, and perhaps a glimpse into your own experiences mirrored in mine.Let's embark on this journey together, embracing the beauty of imperfection and finding meaning in the mundane. Your presence here is not just welcomed, but cherished as we navigate the tapestry of life, one day at a time.Begin your exploration now and uncover the treasures hidden within the pages of my daily journal. Welcome to a space where authenticity reigns supreme, and every moment is worth celebrating.";
const aboutContent = "Welcome to my daily journal, where the ordinary becomes extraordinary through the lens of a student's daily adventures!I'm Keshav Saini, a passionate student at IIIT Nagpur with a vision to become a software developer. Beyond the realms of academia, I delve into the captivating world of competitive programming, boasting a 3-star rating on CodeChef, and proudly holding the title of a pupil on Codeforces. My dedication to honing my coding skills is evident through my contributions to platforms like LeetCode, where I've tackled 130 questions and counting.But life isn't just about algorithms and code; it's a beautiful tapestry woven from everyday moments and experiences. That's where this blog comes in. Here, I invite you to accompany me on a journey through the highs and lows of student life, as I navigate the complexities of academia, chase my dreams, and embrace the challenges that come my way.Aspiring to be a software developer and deeply passionate about web development, I'm constantly exploring new technologies and pushing the boundaries of my knowledge. This blog serves as a creative outlet to share my insights, reflections, and learnings, while also connecting with like-minded individuals who share a love for coding, web development, and the pursuit of personal growth.Join me on this exhilarating ride as we unravel the mysteries of student life, celebrate victories, learn from setbacks, and find inspiration in the everyday moments that shape our journey. Together, let's embark on a quest for knowledge, growth, and fulfillment.Thank you for being a part of this community. Here's to embracing the beauty of the journey, one day at a time.";
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
