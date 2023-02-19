/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name:Justin Joseph Student ID: 127690212 Date: 18/02/2023
 *  Online (Cyclic) Link: https://zany-pink-octopus-yoke.cyclic.app/about
 ********************************************************************************/

var posts = [];
var categories = [];
const file = require("fs"); //to use file system module
const { resolve } = require("path");

exports.initialize = () => {
  return new Promise((resolve, reject) => {
    file.readFile("./data/posts.json", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        posts = JSON.parse(data);
      }
    });

    file.readFile("./data/categories.json", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        categories = JSON.parse(data);
      }
    });
    resolve();
  });
};

exports.getAllPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    var published = posts.filter((posts) => posts.published == true);
    if (published.length == 0) {
      reject("no results returned");
    }
    resolve(published);
  });
};

exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length == 0) {
      reject("no results returned");
    } else {
      resolve(posts);
    }
  });
};

exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length == 0) {
      reject("no results returned");
    } else {
      resolve(categories);
    }
  });
};

exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    if (postData.published) {
      postData.published == true;
    } else postData == false;

    postData.id = posts.length + 1;
    posts.push(postData);
    resolve();
  });
};

exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("No results returned");
    } else {
      resolve(posts.filter((post) => post.category == category));
    }
  });
};

exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    if (posts.length != 0) {
      resolve(
        posts.filter((post) => {
          return new Date(post.postDate) >= new Date(minDateStr);
        })
      );
    } else {
      reject("No results returned");
    }
  });
};

exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
    let foundPost = posts.find((post) => post.id == id);

    if (foundPost) {
      resolve(foundPost);
    } else {
      reject("No results returned");
    }
  });
};
