var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// READ / INDEX of campgrounds --- added user info from passport (req.user)
router.get("/", function(req, res){
    // get data from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});
 
// CREATE / NEW new campground: display form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

// CREATE new campground: submit form
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to db
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // add author to campground -- the user that is logged in
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    // save campground to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });

})

// READ / SHOW details of a specific campground
router.get("/:id", function(req, res){
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            // render show template with the id
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }) 
})

// UPDATE / EDIT a specific campground: display form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // find the campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground){
        // render form
        res.render("campgrounds/edit", {campground: foundCampground});
    })
})

// UPDATE a specific campground: submit form -- PUT!!!!
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the campground with provided id
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            // redirect to show template with the id
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY a specific campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and remove the campground with provided id
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            // render show template
            req.flash("success", "Successfully deleted campground");
            res.redirect("/campgrounds/");
        }
    })
})

module.exports = router;