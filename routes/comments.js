var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ------------------------
// COMMENTS ROUTES
// ------------------------

// CREATE / NEW new comment: display form -- login control middleware added!!!
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// CREATE new comment: submit form -- login control middleware added to prevent hacking!!!
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    // add username and ID to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
})

// UPDATE / EDIT a specific comment: display form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // find comment with provided id
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            // render form -- campground id is needed to use it in the form route / path
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
})

// UPDATE a specific comment: submit form -- PUT!!!!
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find and update the comment with provided id
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            // redirect to show template with the id
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY a specific comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find and remove the comment with provided id
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            // render show template
            req.flash("success", "Successfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;