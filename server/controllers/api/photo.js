var router = require('express').Router()
var Photo = require('../../models/photo')
var User = require('../../models/user')

var photoPath = 'res/photos/'

router.put('/:path/like/:inc', function(req, res, next){
    var path = req.params.path
    var realPath = photoPath + path
    Photo.findOne({image_path: realPath},function(err,photo){
        if(inc==0){
            photo.score--;
        }else{
            photo.score++;
        }
        photo.save(function(err,updated_photo){
            if(err){next(err)}
            res.json(updated_photo)
        })
    })
})
router.get(['/','/:path'], function(req, res, next){
    var path = req.params.path
	var realPath = photoPath + path
    
	if (path){
	    Photo.find({image_path: realPath},function(err,docs){
	        res.sendFile('./public/'+path, {"root":__dirname})
	    })
    }else{
	    Photo.find(function(err, docs) {
	        if(err){return next(err)}
	        var index = Math.floor((Math.random() * docs.length) + 1)
	        res.json(docs[index])
	        //res.sendFile('./public/'+docs[index].image_path, {"root": __dirname})
	        console.log(index)
	    })
    }
})
router.post('/', function (req, res, next) {
    console.log("post received")
    var photo = new Photo({
	    username: req.body.username,
	    body: req.body.body
    })
    console.log(photo)
    photo.save(function (err, post) {
	    if (err) { return next(err) }
	    res.json(201, post)
    })
})

module.exports = router
