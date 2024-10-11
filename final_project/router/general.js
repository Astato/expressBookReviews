const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const password = req.body.password;
  const username = req.body.username;
  if (!password) {
    return res.status(422).json({ message: "You must include a password" });
  } else if (!username) {
    return res.status(422).json({ message: "You must include a username" });
  } else {
    if (!isValid(username)) {
      return res.status(409).json({ message: "Username already in use" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User succesfully registed." });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    } else {
      setTimeout(() => {
        reject(books);
      }, 1000);
    }
  });
  getBooks
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const getBook = new Promise((resolve, reject) => {
    if (book) {
      setTimeout(() => {
        resolve(book);
      }, 1000);
    } else {
      setTimeout(() => {
        reject(book);
      }, 1000);
    }
  });
  getBook
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const getBook = new Promise((resolve, reject) => {
    const getAuthor = Object.values(books).filter((el) => el.author === author);
    if (getAuthor.length > 0) {
      setTimeout(() => {
        resolve(getAuthor);
      }, 1000);
    } else {
      setTimeout(() => {
        reject(getAuthor);
      }, 1000);
    }
  });
  getBook
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.split("_").join(" ");
  const getBook = new Promise((resolve, reject) => {
    const getTitle = Object.values(books).filter((el) => el.title === title);
    if (getTitle.length > 0) {
      setTimeout(() => {
        resolve(getTitle);
      }, 1000);
    } else {
      setTimeout(() => {
        reject(getTitle);
      }, 1000);
    }
  });
  getBook
    .then((response) => {
      return res.status(300).json(response);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const bookFound = books[isbn];
  const getBookReview = bookFound && books[isbn].reviews;
  if (!bookFound) {
    return res.status(404).json({ message: "Book not found" });
  } else {
    return res.status(300).json(getBookReview);
  }
});

module.exports.general = public_users;
