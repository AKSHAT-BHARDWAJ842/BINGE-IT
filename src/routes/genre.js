const express=require("express");
const request=require("request");
var async = require('async');
const genre=express.Router();

const API_KEY= "api_key=8f520d48e32f1c66bbb9e17300dc5258";
const BASE_URL= "https://api.themoviedb.org/3";

function apiCall(url) {
    return function(callback) {
        request(url, function(error, response, body) {
            if (error || response.statusCode != 200) {
                return callback(error);
            }

            try {
                return callback(null, JSON.parse(body).results);
            } catch (error) {
                return callback(error);
            }
        });
    };
} 

genre.get("/:id/:name",function(req,res){
    var id=(req.params.id);
    
    var name=(req.params.name);
    if(name=="bollywood")
    {   console.log("inside bollywood");
        var d_url=(BASE_URL+"/discover/movie?"+ API_KEY+"&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2021&with_original_language=hi");
        async.parallel({
            d_r: apiCall(d_url)
        }, function(err, result) {
            if (err) console.log(err);
            var heading='Bollywood'
            res.render("genre", {detr:result, hh: heading});
        });
    }
    else if(name=="mp")
    {
        d_url=(BASE_URL+ "/discover/movie?sort_by=popularity.desc&"+ API_KEY);
        async.parallel({
            d_r: apiCall(d_url)
        }, function(err, result) {
            if (err) console.log(err);
            var heading='Most Popular'
            res.render("genre", {detr:result,hh: heading});
        });
    }
    else{
        d_url=(BASE_URL+"/discover/movie?"+ API_KEY+ "&with_genres="+id);
        async.parallel({
            d_r: apiCall(d_url)
        }, function(err, result) {
            if (err) console.log(err);
            var heading=name;
            res.render("genre", {detr:result,hh:heading});
        });
    }
    

})


module.exports = genre;