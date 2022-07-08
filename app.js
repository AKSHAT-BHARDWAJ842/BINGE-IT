require('dotenv').config()
// console.log(process.env.API_KEY)
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
const API_KEY= process.env.API_KEY;
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

mongoose.connect(process.env.DB,{useNewUrlParser: true});
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
  user: String,
  interest: []
});
const Interest=mongoose.model("interest",interestSchema);
const postSchema=new mongoose.Schema({
    text: String,
    dt: String,
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
    genres: "Animation"
})
const portal2=new Portal({
    genres: "Family"
})
const def=[portal1];
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
// const detail=require('./src/routes/detail');
// app.use("/details",detail);
const dt=require('./src/routes/dt');
app.use("/dt",dt);
const genre=require('./src/routes/genre');
app.use("/genre",genre);
const search=require('./src/routes/search');
const { deserializeUser } = require("passport");
app.use("/search",search);

const groups=["Most Popular","Bollywood","Horror","Thriller","Action","Sci-fi","Comedy","Romance"];

var user_in;
var curr_gen;
app.get("/discussion",function(req,res){
    if(req.isAuthenticated()){
      
       
       Interest.find({user: user_in.username},function(err,u_int){
           Portal.find({},function(err,cont){
               if(!err)
               {  
                   if (typeof curr_gen == 'undefined')
               {  curr_gen=cont[0].genres;
                
               }
                   res.render("discussion",{content:cont,cu_int:u_int,curr_gen:curr_gen,aut: true});
               }
           })
       })
    }
    else{
        res.render("discussion",{aut: false});
    }

        // Portal.find({},function(err,cont){
        //     if(!err)
        //     {  
        //          Interest.find({user: user_in.username},function(err,u_int){
        //              console.log(u_int);
        //              res.render("discussion",{content: cont[0],cu_int:u_int,c_pg: u_int.interest[0],aut: true});
        //          })
        //         // console.log(cont);
        //     } 
        //     else {
        //         res.redirect("/")
        //     }
        // }) 
    // }
    
});
app.post("/discussion",function(req,res){
    // User.find({username: req.body.username},function(err,c_user){

        const interest1=new Interest({
            user: req.body.username,
            interest: req.body.intr
        }); 
        interest1.save();
    
    
    res.redirect("/discussion");
})
app.post("/genre",function(req,res){
    curr_gen= req.body.c_gen;
    res.redirect("/discussion")

})
app.post("/pst",function(req,res){
    const newPost = req.body.nPost;
    const date=new Date();
    const [month, day, year,hr,min] = [date.getMonth(), date.getDate(), date.getFullYear(),date.getHours(),date.getMinutes()];
    const pdatstring=day+" "+date.toLocaleString('default', { month: 'short' })+` ${ year} ${min}:${hr}`;
    const postNew = new Post({
        text: newPost,
        dt: pdatstring,
        user: user_in
    });
    postNew.save();

    Portal.findOne({genres:req.body.gen},function(err,genport){
        if(err){
            console.log(err)
        }
        else{
            // console.log(genport.genres);
            // console.log(postNew);
            genport.post.push(postNew);
            genport.save();
        }
    })
    
    
    res.redirect("/discussion");
})

app.post("/register",function(req,res){
    
    User.register({username: req.body.username}, req.body.password,function(err,user){
        if(err){console.log(err)
        res.redirect("/")}
        else{
            // console.log(user);

            passport.authenticate("local")(req,res,function(){
                console.log("authenticated");
                // req.app.set('curr_user', res.req.user)
                // var cur_user=res.req.user;
                user_in=user;

                // console.log(req.app.get('curr_user').username);
                res.render("interes",{user:user.username});
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
                user_in=user;
                res.redirect("/"); 
            })
        }
      });
})
app.listen(3000,function(){
    
    console.log("server started on port 3000");
})