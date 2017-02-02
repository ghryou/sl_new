var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var config = require('../../config')

router.get('/new', function (req, res){
    var user = new User({username:'dick', password:'pass'});
    user.save()
    res.send(user)
})
router.post('/new', function (req, res, next){
    var user = new User({username:req.body.username, password:req.body.password})
    user.save(function (err, docs){
	    if(err) { return next(err) }
	    res.json(201, docs)
    })
})
router.get('/check/:user', function (req, res, next){
    var user = req.params.user
    User.findOne({username:user},function(err,docs){
	    if(docs){res.json(docs)}
	    else{res.json(false)}
    })
})
router.get('/', function (req, res, next){
    if(!req.headers['x-auth']){
        return res.send(401)
    }
    var auth = jwt.decode(req.headers['x-auth'], config.secret)
    console.log("res "+auth)
    User.findOne({username: auth.username}, function(err, user){
        if(err){return next(err)}
	    res.json(user)
    })
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

module.exports = router
