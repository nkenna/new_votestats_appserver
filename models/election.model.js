const mongoose = require('mongoose');

const election = mongoose.Schema({
       // _id: mongoose.Schema.Types.ObjectId,
        title: String,
        disc: String,
        startdate: {type: String, required: true},
        enddate: {type: String, required: true},
        createdAt: {type: Date, default: Date.now()},
        updatedAt: {type: Date, default: Date.now()},
        createdby: {type: String},
        status: {type: String, default: 'not started'}
})

//not started
//started
//end

// create the model for elections and expose it to our app
module.exports = mongoose.model('Election', election);

