var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var PersonSchema = new Schema({
    username: String,
    age: Number,
    create: Date
});
PersonSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Person', PersonSchema);



