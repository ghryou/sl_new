var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/snaplook', function (){
    console.log('mongodb connected')
    mongoose.Promise = global.Promise;
})
module.exports = mongoose
