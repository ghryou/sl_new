var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var config = require('../../config')

router.get(['/','/:user'], function (req, res, next){
    var user = req.params.user
    if(user){
        User.findOne({username:user},function(err,docs){
	        if(docs){res.json(docs)}
	        else{res.json(false)}
        })
    }else{
        if(!req.headers['x-auth']){
            return res.send(401)
        }
        var auth = jwt.decode(req.headers['x-auth'], config.secret)
        console.log("res "+auth)
        User.findOne({username: auth.username}, function(err, user){
            if(err){return next(err)}
	        res.json(user)
        })
    }
})

router.post('/', function (req, res, next) {
    var user = new User({
		username: req.body.username,
		gender: req.body.gender,
		insta: req.body.insta
		})
    bcrypt.hash(req.body.password, 10, function(err, hash) {
	    user.password = hash
	    user.save(function (err, user) {
	        if(err) {throw next(err)}
	        res.send(201)
	    })
    })
})

router.put('/:user/like/:path', function (req, res, next) {
    var user = req.params.user
    var path = req.params.path
    
    User.findOne({username: user},function(err,user){
        if(user.photo_like.indexOf(path) == -1){ user.photo_like.push(path) }
        user.save(function(err,updated_user){
            if(err){next(err)}
            res.json(updated_user)
        })
    })
})
router.put('/:user/like_remove/:path', function (req, res, next) {
    var user = req.params.user
    var path = req.params.path
    
    User.findOne({username: user},function(err,user){
        user.photo_like.remove(path)
        user.save(function(err,updated_user){
            if(err){next(err)}
            res.json(updated_user)
        })
    })
})
router.put('/:user/upload/:path', function (req, res, next) {
    var user = req.params.user
    var path = req.params.path
    
    User.findOne({username: user},function(err,user){
        if(user.photo_upload.indexOf(path) == -1){ user.photo_upload.push(path) }
        user.save(function(err,updated_user){
            if(err){next(err)}
            res.json(updated_user)
        })
    })
})
router.put('/:user/upload_remove/:path', function (req, res, next) {
    var user = req.params.user
    var path = req.params.path
    
    User.findOne({username: user},function(err,user){
        user.photo_upload.push(path)
        user.save(function(err,updated_user){
            if(err){next(err)}
            res.json(updated_user)
        })
    })
})

module.exports = router
