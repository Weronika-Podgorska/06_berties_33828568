// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
        return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
});


router.get('/weather', (req, res) => {
    res.render('weather', { weather: null, error: null });
});


router.post('/weather', (req, res, next) => {
    console.log("POST /weather hit, city =", req.body.city_text);
    let apiKey = process.env.BB_API_KEY;
    let city = req.body.city_text; // get city from form

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, (err, response, body) => {
        if (err) {
            return next(err);
        }

        let data = JSON.parse(body);

        if (data.cod != 200 || !data.main) {
            return res.render('weather', {
                 weather: null,
                 error: "City not found."
            });
        }

        let weather = {
            temp: data.main.temp,
            name: data.name,
            humidity: data.main.humidity,
            feels_like: data.main.feels_like,
            wind_speed: data.wind.speed,
            wind_deg: data.wind.deg,
        };

        res.render('weather', { weather, error: null });
    });
});



// Export the router object so index.js can access it
module.exports = router