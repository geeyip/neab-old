var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var EntrySchema = new Schema({
    userId: String,
    userName: String,
    userUnit: String,
    ip: String,
    logTime: Date,
    offTime: Date
});
EntrySchema.plugin(mongoosePaginate);
EntrySchema.virtual('logTime1').get(function () {
    return moment(this.logTime).format('YYYY-MM-DD H:mm:ss');
});
EntrySchema.virtual('offTime1').get(function () {
    if(this.offTime){
        return moment(this.offTime).format('YYYY-MM-DD H:mm:ss');
    }else{
        return '';
    }
});
module.exports = mongoose.model('Entry', EntrySchema);



