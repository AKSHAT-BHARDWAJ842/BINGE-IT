const express=require("express");
const request=require("request");
const axios=require("axios");
var async = require('async');


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

const home=require('./src/routes/home');
app.use("/",home);
const detail=require('./src/routes/detail');
app.use("/details",detail);
const genre=require('./src/routes/genre');
app.use("/genre",genre);

const groups=["Most Popular","Bollywood","Horror","Thriller","Action","Sci-fi","Comedy","Romance"];

app.listen(3000,function(){
    
    console.log("server started on port 3000");
})