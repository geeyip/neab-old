var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: String,
    password: String,
    email:    String,
    date: Date
});
exports.User = mongoose.model('User', UserSchema);;