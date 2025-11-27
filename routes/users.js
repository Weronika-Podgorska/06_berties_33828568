// Create a new router
const express = require("express")
const bcrypt = require('bcrypt')
const router = express.Router()
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
            [check('email').isEmail(), 
            check('username').trim().isLength({ min: 5, max: 20}),
            check('password').trim().isLength({min: 8}),
            check('first').trim().notEmpty(),
            check('last').trim().notEmpty()], 
            function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register')
    }
    else { 
        // saving data in database
        const saltRounds = 10
        const plainPassword = req.body.password

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        if(err){
            return next(err)
        }
            const sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)"
            const newUser = [
                req.sanitize(req.body.username),
                req.sanitize(req.body.first),
                req.sanitize(req.body.last),
                req.sanitize(req.body.email),
                hashedPassword
            ]
            
            db.query(sqlquery, newUser, function(err, result) {
                if (err) {
                    return next(err)
                } else {
                    result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email)
                    //result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                    res.send(result)
                }
            })
        
        
        })
    }
                                                                        
}); 

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("listusers.ejs", {availableUsers:result})
    });
});


router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})


router.post('/loggedin', 
            [check('username').trim().notEmpty().isLength({min:5, max:20}), 
            check('password').trim().notEmpty().isLength({min:8})], 
            function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./login')
    }
    else {
        const username = req.sanitize(req.body.username);
        const password = req.body.password;

        //query the database to compare username
        const sqlquery = "SELECT * FROM users WHERE username = ?";
        db.query(sqlquery, [username], function(err, results) {
            if (err) return next(err);

            const logAction = "INSERT INTO audit_log (username, action) VALUES (?, ?)";

            if (results.length === 0) {
                // log failed attempt with unknown username
                db.query(logAction, [username, "login_failed_username_not_found"], (err) => {
                    if (err) console.error("Audit log insert failed:", err);
                });

                return res.send("Login failed: Username not found.");
            }

            const user = results[0];

            // compare the password with hashed password 
            bcrypt.compare(password, user.hashed_password, function(err, match) {
                if (err) return next(err);

                const action = match ? "login_success" : "login_failed_wrong_password";
                db.query(logAction, [user.username, action], (err) => {
                    if (err) console.error("Audit log insert failed:", err);
                });

                if (match) {
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;

                    res.send("Login successful. Welcome back, " + req.sanitize(user.first_name) + "!");
                } else {
                    res.send("Login failed: Incorrect password.");
                }
            });
        });
    }
});

router.get('/audit', redirectLogin, function (req, res, next) {
    const sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";
    db.query(sqlquery, function(err, result) {
        if (err) return next(err);
        res.render('audit.ejs', { audit: result });
    });
});


// Export the router object so index.js can access it
module.exports = router
