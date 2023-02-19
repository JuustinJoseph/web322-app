/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name:Justin Joseph Student ID: 127690212 Date: 18/02/2023
 *  Online (Cyclic) Link: https://zany-pink-octopus-yoke.cyclic.app/about
 ********************************************************************************/

var express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

var HTTP_PORT = process.env.port || 8080;

var app = express();
var path = require("path");

var blogService = require(__dirname + "/blog-service.js");

app.use(express.static("public"));

cloudinary.config({
  cloud_name: "dtxgth5y4",
  api_key: "921983894482744",
  api_secret: "3ud31wmTJfDGAEY-FMLQU-A6xWY",
  secure: true,
});

const upload = multer();

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
  let retData = null;

  if (req.query.category) {
    retData = blogService.getPostsByCategory(req.query.category);
  } else if (req.query.minDate) {
    retData = blogService.getPostsByMinDate(req.query.minDate);
  } else {
    retData = blogService.getAllPosts();
  }

  retData
    .then((data) => {
      res.json(data);
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

app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;

    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts

    blogService
      .addPost(req.body)
      .then(() => res.redirect("/posts"))
      .catch((err) => {
        console.log(err);
        res.send("Failed");
      });
  });
});

app.get("/post/:id", (req, res) => {
  blogService
    .getPostById(req.params.id)
    .then((data) => {
      res.json(data);
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
