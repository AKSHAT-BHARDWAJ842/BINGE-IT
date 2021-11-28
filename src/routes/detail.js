const express=require("express");
const request=require("request");
var async = require('async');
const detail=express.Router();

const API_KEY= "api_key=8f520d48e32f1c66bbb9e17300dc5258";
const BASE_URL= "https://api.themoviedb.org/3";

function apiCall(url) {
    return function(callback) {
        request(url, function(error, response, body) {
            if (error || response.statusCode != 200) {
                return callback(error);
            }

            try {
                var d=JSON.parse(body);
                // console.log(d);
                return callback(null, JSON.parse(body));
            } catch (error) {
                return callback(error);
            }
        });
    };
}  
 function cstCall(url) {
    return  function(callback) {
        request(url, function(error, response, body) {
            if (error || response.statusCode != 200) {
                console.log("error-30");
                return callback(error);
            }
            
            try { var r={
                   direct: [],
                   producer: [],
                   cast : [],
                   castimg :{
                       prof: [],
                       name: []

                   }
                }
                  var d=JSON.parse(body);
                  d.crew.forEach(element => {
                      if(element.job=='Director')
                      {  
                        //   console.log(element);
                         r.direct.push(element.name)
                      }
                      if(element.job=='Producer')
                      {
                         r.producer.push(element.name)
                      }

                  });
                  for(var i=0;i<7;i++)
                  {   if(d.cast[i])
                    {
                      r.castimg.prof.push(d.cast[i].profile_path);
                      r.castimg.name.push(d.cast[i].name);
                    }
                  }
                  
                  
                return callback(null, r);
                //JSON.parse(body)
            } catch (error) {
                // console.log("error-66");
                return callback(error);
            }
        });
    };
}  
 function vidCall(url) {
    return function(callback) {
        request(url, function(error, response, body) {
            try { var link;
                  var d=JSON.parse(body);
                  var i=0;
                  while(d.results){
                      if(d.results[i].type=='Trailer' && d.results[i].name.includes('Official'))
                      {
                         link=d.results[i].key
                         break;
                      }
                      i++;
                  };
                return callback(null, link);
                //JSON.parse(body)
            } catch (error) {
                return callback(error);
            }
        });
    };
}  

detail.get("/:id",function(req,res){
    var id=(req.params.id);
     var movie_url=BASE_URL+`/movie/${id}?`+API_KEY+`&language=en-US`;
     var cst_url=BASE_URL+`/movie/${id}/credits?`+API_KEY+`&language=en-US`;
     var v_url=BASE_URL+`/movie/${id}/videos?`+API_KEY+`&language=en-US`;
  async.parallel({
      mr:  apiCall(movie_url),
      cr:  cstCall(cst_url),
      vr:  vidCall(v_url)
  }, function(err, results) {
      if (err) console.log(err);
      console.log(results);
      res.render("details", {results:results});
  });
  
  })


module.exports =detail;