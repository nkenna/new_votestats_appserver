/**
 * Created by General Steinacoz on 12/5/2017.
 */
var mongoose = require('mongoose');

var candidate = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  title: String,
  votes: {type: Number, default: 0},
  positionid: String,
  positiontitle: String,
  electionid: String,
  voters: { 
    id: { type: String }
        }

});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Candidate', candidate);