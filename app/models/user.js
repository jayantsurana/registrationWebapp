var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var userSchema =new Schema({
    name: String,
    rollnumber: String,
    teamname:String
})
var User =mongoose.model('User', userSchema);
module.exports = User;
