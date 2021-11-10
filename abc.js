import express from "express";
import request from "request";
import fetch from "node-fetch";

var response= await fetch('https://api.themoviedb.org/3/movie/580489?api_key=8f520d48e32f1c66bbb9e17300dc5258&language=en-US');
console.log(response.json());
const app=express();

app.use(express.urlencoded({extended: "true"}));
app.use(express.static("public"));
app.set("view engine","ejs");