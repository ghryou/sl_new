var router = require('express').Router()
var Photo = require('../../models/photo')
var User = require('../../models/user')

var photoPath = 'res/photos/'

router.get('/', function(req, res, next){
    
	Photo.find(function(err, docs) {
        if(err){return next(err)}
	        
	    var res_docs = []
	    for(var i=0; i<5; i++){
	        var index = Math.floor((Math.random() * docs.length) + 1)
	        console.log(index)
	        res_docs.push(docs[index-1])
	    }    
	    res.json(res_docs)
	    //res.sendFile('./public/'+docs[index].image_path, {"root": __dirname})
	    console.log(index)
	})
})

router.get('/gender/:gender', function(req, res, next){
    var gender = req.params.gender
    
    Photo.find({gender:gender},function(err, docs) {
        if(err){return next(err)}
	        
	    var res_docs = []
	    for(var i=0; i<5; i++){
	        var index = Math.floor((Math.random() * docs.length) + 1)
	        console.log(index)
	        res_docs.push(docs[index-1])
	    }    
	    res.json(res_docs)
	    //res.sendFile('./public/'+docs[index].image_path, {"root": __dirname})
	    console.log(index)
	})
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

router.put('/:path/like/:inc', function(req, res, next){
    var path = req.params.path
    var inc = req.params.inc
    
    Photo.findOne({image_path: path},function(err,photo){
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

module.exports = router
