// all middlewares

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// check campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        // find the campground with provided id
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) {
                // send one page back
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    // step out from middleware
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.send("back");
                }             
            }
        })
    } else {
        // send one page back
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }    
}

// check comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        // find the campground with provided id
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                // send one page back
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    // step out from middleware
                    next();
                } else {
                    res.send("back");
                }             
            }
        })
    } else {
        // send one page back
        req.flash("error", "You don't have permission to do that");
        res.redirect("back");
    }    
}

// check login status
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;