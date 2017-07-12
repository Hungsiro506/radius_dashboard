var mongoose = require('mongoose');
//setup connect autoIncrement
var connection = mongoose.createConnection('mongodb://127.0.0.1:27017/sparkline');

var outlierSchema = new mongoose.Schema({
    bras_id: { type: String, default: '' },
    signin_total_count: { type: Number, default: 0 },
    logoff_total_count: { type: Number, default: 0 },
    signin_distinct_count: { type: Number, default: 0 },
    logoff_distinct_count: { type: Number, default: 0 },
    label: { type: String, default: '' },
    time: { type: Date, default: Date.now },
});

var outlier = mongoose.model('outlier', outlierSchema);

module.exports = outlier;