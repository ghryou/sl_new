var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var config = require('../../config')

router.post('/', function (req, res, next) {
    User.findOne({username: req.body.username})
        .select('password').select('username')
        .exec(function (err, user) {
	    if (err) { return next(err) }
	    if (!user) { return res.json(null) }
	
	    bcrypt.compare (req.body.password, user.password, function (err, valid) {
	        if (err) { return res.send(401)}
	        if (!valid) { return res.json(null) }
	        var token = jwt.encode({username:user.username}, config.secret)
	        res.json(token)
	    })
    })
})

module.exports = router
