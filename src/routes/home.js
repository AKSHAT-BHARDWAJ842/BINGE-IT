const express=require("express");
const request=require("request");
const home=express.Router();

// api key : 8f520d48e32f1c66bbb9e17300dc5258
const API_KEY= "api_key=8f520d48e32f1c66bbb9e17300dc5258";
const BASE_URL= "https://api.themoviedb.org/3";
const popular =BASE_URL+ "/discover/movie?sort_by=popularity.desc&"+ API_KEY;
const bollywood =BASE_URL+"/discover/movie?"+ API_KEY+"&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2021&with_original_language=hi";
const thriller =BASE_URL+"/discover/movie?"+ API_KEY+ "&with_genres=53";
const action =BASE_URL+"/discover/movie?"+ API_KEY +"&with_genres=28";
const anim =BASE_URL+"/discover/movie?"+ API_KEY +"&with_genres=16";
const horror =BASE_URL+"/discover/movie?"+ API_KEY +"&with_genres=27";

request(popular,function(error,response,body){
    var data=JSON.parse(body);
    mp=data.results;
});
request(bollywood,function(error,response,body){
    var data=JSON.parse(body);
    boll=data.results;
});
request(thriller,function(error,response,body){
    var data=JSON.parse(body);
    thrill=data.results;
});
request(action,function(error,response,body){
    var data=JSON.parse(body);
    act=data.results;
});
request(horror,function(error,response,body){
    var data=JSON.parse(body);
    hor=data.results;
});
request(anim,function(error,response,body){
    var data=JSON.parse(body);
    animat=data.results;
});


home.get("", async(req,res) =>{
    res.render("home",{p_result: mp,b_result: boll,t_result: thrill,a_result: act,an_result: animat,h_result:hor});
})

module.exports = home;
