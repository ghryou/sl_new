var db = require('../db')
var User = db.model('user', {
    username: {type: String, required: true},
    password: {type: String, required: true, select: false},
    gender: {type: Number, required: true, default: 0},
    insta: {type: String},
    photo_like: {type: Array, default: []},
    photo_upload: {type: Array, default: []}
})
module.exports = User
