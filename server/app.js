var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var app = express();
var _ = require('lodash')
var cors = require('cors')
var Photo = require('./models/photo')
var User = require('./models/user')
var cors = require('cors')

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})
var upload = multer({ storage: _storage })


app.all('/admin/photo/clean', function(req, res, next){
    Photo.remove(function(err){if(err){return next(err)}})
    Photo.find(function(err, docs){
	    res.json(docs);
    })
})
app.get('/admin/photo/init', function(req, res){
    for(i=1;i<=10;i++){
    	var photo = new Photo({
            image_path : i+'.jpg',
			score: i,
			explanation:'Cheer Up!'+i,
			gender: 0
    	})
    	console.log(photo)
    	photo.save(function (err, post) {
    	    if(err) {return next(err)}
    	})
    }
    res.send("end")
})

/* Snaplook Photo API */
app.use('/api/photo', require('./controllers/api/photo'))

/* Snaplook bestlook API */
app.get('/api/bestlook', function(req,res){

	var minimum = (new Date((new Date()).getTime()-(60*60*1000)));

	Photo.find({date: { $gte: minimum }}, function(err,docs){
		res.json(docs)	
	}).sort({score : -1}).limit(5)
			
})

/* Snaplook Login API */
app.use('/api/session', require('./controllers/api/session'))
app.use('/api/user', require('./controllers/api/user'))

/* Snaplook Inquiry API */
app.post('/api/inquiry', function(req,res,next){
    console.log(req.body.comment)
    res.json(req.body.comment)
})

/* etc */
app.get('/upload', function(req, res){
    res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req,res){
    console.log(req.file);
    res.send('Uploaded : '+req.file.filename);
});
app.get('/topic/new', function(req,res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
	res.render('new',{topics:files});
    });
});
app.get(['/topic','/topic/:id'], function(req, res){
    fs.readdir('data', function(err, files){
	if(err){
	    console.log(err);
	    res.status(500).send('Internal Server Error');
	}
	var id = req.params.id;
	if(id){
            fs.readFile('data/'+id, 'utf8', function(err, data){
		if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
		}
		res.render('view', {topics:files, title:id, description:data});
            });
	}else{
	    res.render('view', {topics:files, title:'Welcome', description:'HIHIHI'});
	}
    });
});
app.post('/topic', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
	if(err){
	    console.log(err);
	    res.status(500).send('Internal Server Error');
	}
	res.redirect('/topic/'+title);
    });
});
app.listen(3000, function(){
    console.log('Connected, 3000 port!');
});
