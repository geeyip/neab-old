var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ResourceSchema = new Schema({
    key: String,
    name: String,
    desc: String,
    permission:Schema.Types.Mixed
});
module.exports = mongoose.model('Resource', ResourceSchema);
