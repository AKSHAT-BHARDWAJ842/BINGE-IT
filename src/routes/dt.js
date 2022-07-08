require('dotenv').config()
const express=require("express");
const fetch=require("node-fetch");
const dt=express.Router();

const API_KEY= process.env.API_KEY;
const BASE_URL= "https://api.themoviedb.org/3";

async function getdet(urls){
   const det1=await fetch(urls[0]);
   const det2=await fetch(urls[1]);
   const det3=await fetch(urls[2]);
   const data1=await det1.json();
   const data2=await det2.json();
   const data3=await det3.json();
   const res={
       m_r: data1,
       c_r: data2,
       v_r: data3
   }
   return res;
}

dt.get("/:id",async function(req,res){
    var id=req.params.id;
    var movie_url=BASE_URL+`/movie/${id}?`+API_KEY+`&language=en-US`;
    var cst_url=BASE_URL+`/movie/${id}/credits?`+API_KEY+`&language=en-US`;
    var v_url=BASE_URL+`/movie/${id}/videos?`+API_KEY+`&language=en-US`;
    var urls=[movie_url,cst_url,v_url];
    const results=await getdet(urls);
    // console.log(results);
    var strs={
        s:[0,0]
    }
    var st=(results.m_r.vote_average)/2;
    // console.log(st);
    for(var i=1;i<=st;i++){
       strs.s[0]++;
    }
    i--;
    if(st>i){strs.s[1]++;}
    var cres={
        direct: [],
        producer: [],
        writ : [],
        castimg :{
            prof: [],
            name: []
        }}
    results.c_r.crew.forEach(element => {
        if(element.job=='Director')
        {  
          //   console.log(element);
           cres.direct.push(element.name)
        }
        if(element.job=='Producer')
        {
           cres.producer.push(element.name)
        }
        if(element.job=='Story' || element.department=='Writing')
        {
           cres.writ.push(element.name)
        }

    });
    for(var i=0;i<7;i++)
    {   if(results.c_r.cast[i])
      {
        cres.castimg.prof.push(results.c_r.cast[i].profile_path);
        cres.castimg.name.push(results.c_r.cast[i].name);
      }
    }
    var link;
    var i=0;
    while(results.v_r.results){
        if(results.v_r.results[i].type=='Trailer' && results.v_r.results[i].name.includes('Official'))
        {
           link=results.v_r.results[i].key
           break;
        }
        i++;
    };
    // console.log(results);
    var retres={
        mr:results.m_r  ,
        cr: cres ,
        vr: link ,
        stars: strs
    }
    res.render("details", {results:retres});


})

module.exports=dt;