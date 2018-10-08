const mongoose = require('mongoose');



var user = mongoose.Schema({
    //_id: String,//mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
    elections: { 
            election: { type: Number }
                }
 });

module.exports = mongoose.model('User', user);
