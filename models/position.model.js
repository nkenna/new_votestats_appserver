/**
 * Created by General Steinacoz on 12/5/2017.
 */
var mongoose = require('mongoose');

var position = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  positiontitle: String,
  positiondisc: String,
  electionid: String

});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Position', position);