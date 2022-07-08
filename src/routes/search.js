require('dotenv').config()
const express=require("express");
const request=require("request");
var async = require('async');
const search=express.Router();

const API_KEY=process.env.API_KEY;
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

search.get("/:searchf",function(req,res){
    var sf=(req.params.searchf);
    sf=sf.replace(' ', '%20');
    s_url=BASE_URL+"/search/movie?"+API_KEY+"&query="+sf+"&language=en-US&page=1&include_adult=false";
    // console.log(s_url);
    async.parallel({
        sr: apiCall(s_url)
    }, function(err, result) {
        if (err) console.log(err);
        var heading
        if(result.sr.length===0)
        {
           heading="Sorry, No Matching Search Results"
        }
        else{
            heading="Results for \""+sf.replace('%20', ' ')+"\"";
        }
        // console.log(result);
        // if(result.sr.length===0)
        // {
        //     console.log("no res");
        // }
        
        res.render("search", {srch:result, hh: heading});
    });
})

module.exports=search;