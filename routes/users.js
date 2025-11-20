// Create a new router
const express = require("express")
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
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
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ]
        
        db.query(sqlquery, newUser, function(err, result) {
            if (err) {
                return next(err)
            } else {
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
            }
        })
    
    
    })
                                                                        
}); 

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("listusers.ejs", {availableUsers:result})
    });
});


// Export the router object so index.js can access it
module.exports = router
