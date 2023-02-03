/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name:Justin Joseph Student ID: 127690212 Date: 03/02/2023
 *  Online (Cyclic) Link: https://zany-pink-octopus-yoke.cyclic.app/about
 ********************************************************************************/

var express = require("express");
var HTTP_PORT = process.env.port || 8080;

var app = express();
var path = require("path");

var blogService = require(__dirname + "/blog-service.js");

app.use(express.static("public"));

function onHttpStart() {
  console.log("Express http server listening on " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/blog", (req, res) => {
  blogService
    .getAllPublishedPosts()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/posts", (req, res) => {
  blogService
    .getAllPosts()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/Categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.use((req, res) => {
  res.status(404).end("404 PAGE NOT FOUND");
});

blogService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart());
  })
  .catch(() => {
    console.log("promises not working.");
  });
