/**
 * Created by General Steinacoz on 12/5/2017.
 *
 *
 */

var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var voter = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  voter_key: String,
  votername: String,
  voted: {type: Boolean, default: false},
  electionid: String,
  email: String

});



// create the model for elections and expose it to our app
module.exports = mongoose.model('Voter', voter);