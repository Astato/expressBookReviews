const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const isUsernameInUse = users.filter((user) => {
    return user.username === username;
  });
  if (isUsernameInUse.length < 1) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const foundUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (foundUser.length > 0) {
    return true;
  } else {
    return false;
  }
};
//customer/auth/review/2?username=username&review=Awesome book
//only registered users can login
regd_users.post("/login", (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  if (!username || !password) {
    return res.status(422).json({ message: "Missing login data" });
  } else {
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username: username }, "access");
      req.session.authorization = {
        token,
        username,
      };
      return res.status(200).json({ message: "User successfully logged" });
    } else {
      return res.status(401).json({
        message: "Incorrect credentials, check username and password",
      });
    }
  }
  //Write your code here
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const username = req.user.username;
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!username) {
    return req
      .status(403)
      .json({ message: "You must me logged in to leave a review" });
  }
  if (book) {
    Object.assign(book.reviews, { [username]: { review: review } });
    return res
      .status(200)
      .json({ message: "Review saved successfully", ...book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.user.username;
  if (!book) {
    res.status(404).json({ message: "book not found" });
  }
  if (!book.reviews[username]) {
    res.status(404).json({ message: "No review to delete" });
  } else {
    delete book.reviews[username];
    res.status(200).json({ message: "review removed", ...book });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
