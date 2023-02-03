var posts = [];
var categories = [];
const file = require("fs"); //to use file system module

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
