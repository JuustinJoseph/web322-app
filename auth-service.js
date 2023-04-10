/*********************************************************************************
 *  WEB322 – Assignment 06
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name:Justin Joseph Student ID: 127690212 Date: 09/04/2023
 *  Online (Cyclic) Link: https://zany-pink-octopus-yoke.cyclic.app
 ********************************************************************************/
bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

let User;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://admin:123justin@senecaweb.8c0oslq.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;
          let newUser = new User(userData);
          newUser
            .save()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              if (err.code === 11000) {
                reject("Username already taken");
              } else {
                reject(`There was an error creating the user: ${err}`);
              }
            });
        })
        .catch((err) => {
          console.log(err);
          reject("There was an error encrypting the password");
        });
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (users.length === 0) {
          reject(`Unable to find user: ${userData.userName}`);
        } else {
          bcrypt
            .compare(userData.password, users[0].password)
            .then((result) => {
              if (result === true) {
                resolve(users[0]);
              } else {
                reject(`Incorrect Password for user: ${userData.userName}`);
              }
            });
          users[0].loginHistory.push({
            dateTime: new Date().toString(),
            userAgent: userData.userAgent,
          });
          User.updateOne(
            { userName: users[0].userName },
            { $set: { loginHistory: users[0].loginHistory } },
            { multi: false }
          )
            .exec()
            .then(() => {
              resolve(users[0]);
            })
            .catch((err) => {
              reject(`There was an error verifying the user: ${err}`);
            });
        }
      })
      .catch(() => {
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
};
