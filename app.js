const express=require("express");
const request=require("request");
var async = require('async');
const mongoose=require('mongoose');
const session= require('express-session');
const passport= require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const bcrypt=require("bcrypt");
// const saltRounds=10;


// api key : 8f520d48e32f1c66bbb9e17300dc5258
const API_KEY= "api_key=8f520d48e32f1c66bbb9e17300dc5258";
const BASE_URL= "https://api.themoviedb.org/3";
const popular =BASE_URL+ "/discover/movie?sort_by=popularity.desc&"+ API_KEY;
const bollywood =BASE_URL+"/discover/movie?"+ API_KEY+"&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2021&with_original_language=hi";
const thriller =BASE_URL+"/discover/movie?"+ API_KEY+ "&with_genres=53";
const action =BASE_URL+"/discover/movie?"+ API_KEY +"&with_genres=28";
const anim =BASE_URL+"/discover/movie?"+ API_KEY +"&with_genres=16";
const horror =BASE_URL+"/discover/movie?"+ API_KEY +"&with_genres=27";



const app=express();

app.use(express.urlencoded({extended: "true"}));
app.use(express.static("public"));
app.set('views','./src/views');
app.set("view engine","ejs");

app.use(session({
    secret: "bingeit",
    resave: false,
    saveUninitialized: false

}));
app.use(passport.initialize());
app.use(passport.session()); 
 
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);
const userSchema=new mongoose.Schema({
 name: String,   
 username: String,
 password: String
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("user", userSchema);

passport.use(User.createStrategy());

//old serialize
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

const interestSchema=new mongoose.Schema({
  user: userSchema,
  interest: []
});
const postSchema=new mongoose.Schema({
    text: String,
    user: userSchema
});
const Post=mongoose.model("post", postSchema);
// to add new post first time- for using on ur system(first make a user user2 :) )
// const post1=new Post({
//     text: "abcd very lorem ipsum dolor agfag sfagh ghas",
//     user:user2  
// })
const portalSchema=new mongoose.Schema({
    genres: String,
    post: [postSchema]
});
const Portal=mongoose.model("portal", portalSchema);
const portal1=new Portal({
    genres: "Thriller"
})
const portal2=new Portal({
    genres: "Comedy"
})
const def=[portal1,portal2];
// to gen initial Potals on ur sysytem
// Portal.insertMany(def,function(err){
//     if(!err)
//     {
//         console.log("added post");
//     }
    
// });
// Portal.findOne({genres:"Comedy"},function(err,genport){
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(genport.genres);
//         console.log(post1);
//         genport.post.push(post1);
//         genport.save();
//     }
// })

const home=require('./src/routes/home');
app.use("/",home);
const detail=require('./src/routes/detail');
app.use("/details",detail);
const genre=require('./src/routes/genre');
app.use("/genre",genre);
const search=require('./src/routes/search');
app.use("/search",search);

const groups=["Most Popular","Bollywood","Horror","Thriller","Action","Sci-fi","Comedy","Romance"];


app.get("/discussion",function(req,res){
    if(req.isAuthenticated()){
        
        Portal.find({},function(err,cont){
            if(!err)
            {   
                // console.log(cont);
                res.render("discussion",{content: cont,aut: true});
            } 
            else {
                res.redirect("/")
            }
        }) 
    }
    else{
        res.render("discussion",{auth: false});
    }
});
app.post("/discussion",function(req,res){
    // make new interest collection and add content then redirect to discussion
    res.redirect("/discussion");
})
app.post("/register",function(req,res){
    
    User.register({username: req.body.username}, req.body.password,function(err,user){
        if(err){console.log(err)
        res.redirect("/")}
        else{
            console.log(user)
            passport.authenticate("local")(req,res,function(){
                console.log("authenticated");
                res.render("interes");
            })
        }
    })
})
app.post("/login",function(req,res){
    const user=new User({
        username: req.body.username,
        password: req.body.password
    })
    
    req.login(user, function(err) {
        if (err) { console.log(err); }
        else 
        {   console.log("r1");
            passport.authenticate("local")(req,res,function(){
                console.log("auth");
                res.redirect("/"); 
            })
        }
      });
})
app.listen(3000,function(){
    
    console.log("server started on port 3000");
})