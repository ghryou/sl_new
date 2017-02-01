var db = require('../db')
var Photo = db.model('photo', {
    image_path: {type: String, required: true},
    username: {type: String, required: true, default: "admin"},
    score: {type: Number, required: true, default: 0},
    gender: {type: Number, required: true, default: 0},
    date: {type: Date, required: true, default: Date.now}
})
module.exports = Photo
