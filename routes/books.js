// Create a new router
const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const BASE_PATH = process.env.BASE_PATH || '';
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect(`${BASE_PATH}/users/login`) // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', 
            [check('search_text').trim().notEmpty().isLength({max:100})], 
            function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./search')
    }
    else {
        //searching in the database
        let sqlquery = "SELECT name, price FROM books WHERE name LIKE ? "; 
        let keyword = [`%${req.sanitize(req.query.search_text)}%`] //allow text to come before and after keyword
        //execute sql query
        db.query(sqlquery, keyword, (err, result) => {
            if (err) {
                next(err)
            }
            else
                //res.send("You searched for: " + req.query.search_text)
                res.render("searchresult.ejs", {availableBooks:result})
        })
    }
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

router.get('/addbook', redirectLogin, function(req, res, next){
    res.render("addbook.ejs")
})

router.post('/bookadded', 
            [check('name').trim().notEmpty().isLength({max:100}), 
            check('price').trim().notEmpty().isFloat({gt:0})], 
            function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./addbook')
    }
    else {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
        // execute sql query
        let newrecord = [req.sanitize(req.body.name), req.sanitize(req.body.price)]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                res.send(' This book is added to database, name: '+ req.sanitize(req.body.name) + ' price '+ req.sanitize(req.body.price))
        })
    }
}) 

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price<20"; // query database to get books priced under 20
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargainbooks.ejs", {availableBooks:result})
    });
});

// Export the router object so index.js can access it
module.exports = router
