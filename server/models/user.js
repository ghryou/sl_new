var db = require('../db')
var User = db.model('user', {
    username: {type: String, required: true},
    password: {type: String, required: true, select: false},
    gender: {type: Number, required: true, default: 0},
    insta: {type: String}
})
module.exports = User
