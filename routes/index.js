var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

// home page
router.get("/", function(req, res){
    res.render("landing");
});

// ------------------------
// AUTH ROUTES
// ------------------------

// CREATE / NEW new registration: display form
router.get("/register", function(req, res){
    res.render("register")
})

// CREATE new registration: submit form
router.post("/register", function(req, res){
    // use passport-local-mongoose to register user
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            // authenticate user (log in) and go to campgrounds
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    })
})

// CREATE / NEW new login: display form
router.get("/login", function(req, res){
    res.render("login");
})

// CREATE new login: submit form
// use middleware passport.authenticate that is provided by passport-local-mongoose
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
})      

// READ logout user
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
})

module.exports = router;