// Create a new router
const express = require("express")
const router = express.Router()


router.get('/books', function (req, res, next) {

    // Get the search term and price from the URL query string
    let searchTerm = req.query.search;
    let minPrice = req.query.minprice;
    let maxPrice = req.query.maxprice;
    let sort = req.query.sort;

    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

   // Search term filter
    if (searchTerm) {
        sqlquery += " AND name LIKE ?";
        params.push(`%${searchTerm}%`);
    }

    // Min price filter
    if (minPrice) {
        sqlquery += " AND price >= ?";
        params.push(minPrice);
    }

    // Max price filter
    if (maxPrice) {
        sqlquery += " AND price <= ?";
        params.push(maxPrice);
    }

    // Sorting options
    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    } else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    // Execute the sql query
    db.query(sqlquery, params, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})


// Export the router object so index.js can access it
module.exports = router