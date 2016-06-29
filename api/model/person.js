var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

module.exports = function(){
    var PersonSchema = new Schema({
        username: String,
        age: Number,
        create: Date
    });
    PersonSchema.plugin(mongoosePaginate);
    mongoose.model('Person', PersonSchema);
}

