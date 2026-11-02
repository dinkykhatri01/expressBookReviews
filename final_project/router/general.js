const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push(books[key]);
        }
    }

    res.send(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = [];

    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result.push(books[key]);
        }
    }

    res.send(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching books:", error.message);
    }
}

// Task 11: Get book details by ISBN using Promise callbacks
function getBookByISBN(isbn) {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log("Error fetching book:", error.message);
        });
}

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log("Error fetching books by author:", error.message);
    }
}

function getBooksByTitle(title) {
    return axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    )
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log("Error fetching books by title:", error.message);
        });
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;

module.exports.getBooksByTitle = getBooksByTitle;