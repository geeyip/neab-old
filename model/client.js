var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var ClientSchema = new Schema({
    key: String,
    name: String,
    pname: String,
    serverUrl: String,
    xjptUrl: String
});
ClientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Client', ClientSchema);



