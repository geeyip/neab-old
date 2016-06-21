var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

module.exports = function(){
    var PersonSchema = new Schema({
        name: String,
        age: Number,
        address: String
    });
    PersonSchema.plugin(mongoosePaginate);
    mongoose.model('Person', PersonSchema);
}

