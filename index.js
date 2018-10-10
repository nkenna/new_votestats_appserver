
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./routes/user.route');
var cors = require('cors');
var async = require('async');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

const bcrypt = require('bcrypt-nodejs');
const User = require('./models/user.model');
const Position = require('./models/position.model');
const Ballot = require('./models/ballot.model');
const Candidate = require('./models/candidate.model');
const Voter = require('./models/voter.model');
const Election = require('./models/election.model');
const jwt = require('jsonwebtoken');
var moment = require('moment')
var nodemailer = require('nodemailer');
//mongodb://<dbuser>:<dbpassword>@ds131932.mlab.com:31932/

//mongoose.connect('mongodb://nkenna:nkenna007@ds125673.mlab.com:25673/02lqbhk');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_0v20v9h9:nkenna007@ds131932.mlab.com:31932/heroku_0v20v9h9')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

//var x = app

//require('./routes/user.route')(x); // load our routes and pass in our app
app.options('*', cors()) 

app.use(function(req, res, next)
{
   /* Allow access from any requesting client */
   res.setHeader('Access-Control-Allow-Origin', '*');

   /* Allow access for any of the following Http request types */
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');

   /* Set the Http request header */
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

function sendEmail(to, subject, content){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nkennannadi@gmail.com',
      pass: 'nkenna007'
    }
  });
  
  var mailOptions = {
    from: 'nkennannadi@gmail.com',
    to: to,
    subject: subject,
    text: content
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}

setInterval(() =>{
  var now = moment().toDate;

  Election.findOne({startdate: now}, (err, election)=>{
    if(err){
      console.log(err);
      return;
    }else{
     // election.status = 'started';
      election.save((err, ele) =>{
        if(err){
          console.log(err)
          return;
        }else{
          Voter.find({_id: ele._id}, (err, voters)=>{
            sendEmail(voters.email, 'Election just started', ele.title + 'started, open account to vote' );
          })
          
        }
        
      })
    }
  });

  Election.findOne({enddate: now}, (err, election)=>{
    if(err){
      console.log(err);
      return;
    }else{
     // election.status = 'end';
      election.save((err, ele) =>{
        if(err){
          console.log(err)
          return;
        }else{
          Voter.find({_id: ele._id}, (err, voters)=>{
            sendEmail(voters.email, 'Election just ended', ele.title + 'ended, open account to see results' );
          })
        }
      })
    }
  });


}, 60000);

app.get('/', function(req, res){
   console.log('xxxx')
  
  
      res.json({ data: 'workin' });
        //return res.status(200).json(data);
    })



app.post('/addelection', function(req, res){
    console.log(req.body.title);
    const election = new Election({
        _id: new  mongoose.Types.ObjectId(),
        title: req.body.title,
        disc: req.body.disc,
        startdate: req.body.timeStarts,
        enddate: req.body.timeStarts,
        createdby: "5ba7f910f1744d23e0ed93a4",
        
     });
     election.save().then(function(result) {
        console.log(result);
        res.status(200).json({
           success: 'success'
        });
     }).catch(error => {
        res.status(500).json({
          // error: err,
           "error": "smtin is wrng_election",
           "e": req.body.disc/*  */
        });
     });
})

app.post('/allusers', function(req, res){
    User.find()
    .exec()
    .then(function(data){
        return res.status(200).json(data);
    })
})

app.post('/allpositions', function(req, res){
  Position.find()
      .exec()
      .then(function(data){
        return res.status(200).json(data);
      })
})

app.post('/allcandidates', function(req, res){
  Candidate.find()
      .exec()
      .then(function(data){
        return res.status(200).json(data);
      })
})

app.get('/allelections', function(req, res){
  
    Election.find()
    .exec()
    .then(function(data){
      res.json({ elections: data });
        //return res.status(200).json(data);
    })
})

app.post('/signin', function(req, res){
    User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
       bcrypt.compare(req.body.password, user.password, function(err, result){
          if(err) {
             return res.status(401).json({
                status: '0'
             });
          }
          if(result) {
            const JWTToken = jwt.sign({
                 email: user.email,
                 _id: user._id
               },
               'secret',
                {
                  expiresIn: '2h'
                });
                return res.send({
                  status: '1',
                  token: '1bvvyyfvxdtfj_kjfdfrsfx',
                  user: user
                });
           }
          return res.status(401).json({
             status: '2'
          });
       });
    })
    .catch(error => {
       res.status(500).json({
          error: error,
          status: '3'
       });
    });;
 });

app.post('/signup', function(req, res) {
   console.log(req.body.password);

  bcrypt.hash(req.body.password, null, null, function(err, hash){
       if(err) {
          return res.status(500).json({
             error: err,
             "error": "smtin is wrng"
          });
       }
       else {
          const user = new User({
             _id: new  mongoose.Types.ObjectId(),
             email: req.body.email,
             password: hash,
             firstname: req.body.firstname,
             lastname: req.body.lastname    
          });
          user.save().then(function(result) {
             console.log(result);
             res.status(200).json({
                status: 'success'
             });
          }).catch(error => {
             res.status(500).json({
                error: err,
                "status": "error"
             });
          });
       }
    });
 });


//add new position and ballot
/*
app.post('/addposition', function (req, res, next) {
  //console.log(req.body.candidates.candidate)
  var eId = req.body.electionID;
  var positiontitle = req.body.positionTitle;
  var positiondisc = req.body.positionDisc;
  var ballottype = req.body.ballotType;


  var candidates = req.body.candidates;
  //var candidates = textarea_candidate.split('\n');

  //console.log(candidates);
  //console.log(ballottype);


  Election.findOne({ '_id': eId }, function (err, election) {
    if (err) return handleError(err);

    election.save(function(err, election) {
      if (err) {
        next(err);
        return;
      }


      var newPosition = new Position();
      newPosition.positiontitle = positiontitle;
      newPosition.positiondisc = positiondisc;
      newPosition.electionid = election._id;

      newPosition.save(function (err, position) {
        if (err){next(err); return;}
        for (var i = 0; i < candidates.length; i++) {
          var newCandidate = new Candidate();
          newCandidate.name = candidates[i].name;
          newCandidate.positionid = position._id;
          newCandidate.electionid = election._id;

          newCandidate.save(function (err, candidate) {
            if (err){next(err); return;}


          });
        }

        var newBallot = new Ballot();
        newBallot.ballottype = ballottype;
        newBallot.positionid = position._id;
        newBallot.electionid = election._id;

        newBallot.save(function (err) {
          if (err){next(err); return;}
        });
      })


      //req.flash("info", "new ballot created!");
      res.json({status: "success"})//.redirect("/dashboard");

    });

  });
});
*/

app.post('/addposition', function (req, res, next) {
  //console.log(req.body.candidates.candidate)
  var eId = req.body.electionID;
  var positiontitle = req.body.positionTitle;
  var positiondisc = req.body.positionDisc;
  var ballottype = req.body.ballotType;


  var candidates = req.body.candidates;
  //var candidates = textarea_candidate.split('\n');

  //console.log(candidates);
  //console.log(ballottype);


  var newPosition = new Position();
  //newPosition._id = mongoose.Types.ObjectId;
  newPosition.positiontitle = positiontitle;
  newPosition.positiondisc = positiondisc;
  newPosition.electionid = eId;



  newPosition.save(function (err, position) {
    if (err){
      next(err);
       return;
    }

    console.log(candidates.length)

    for (var i = 0; i < candidates.length; i++) {
      var newCandidate = new Candidate();
      newCandidate.title = candidates[i];
      newCandidate.positionid = position._id;
      newCandidate.positiontitle = position.positiontitle;
      newCandidate.electionid = eId;

      newCandidate.save(function (err, candidate) {
        if (err){
          next(err);
          return;
        }


      });
    }

    var newBallot = new Ballot();
    newBallot.ballottype = ballottype;
    newBallot.positionid = position._id;
    newBallot.electionid = eId;

    newBallot.save(function (err) {
      if (err){
        next(err);
         return;}
    });
  })

  res.json({status: "success"})

});


app.get('/test', function(req, res){
    res.json({
       "Tutorial": "Welcome to the Node express JWT Tutorial"
    });
 });

 app.post('/addvoters', function(req, res){
  var eId = req.body.electionid;
  var voterId = req.body.voterid;
  var voter_Key = req.body.voterkey;
  var email = req.body.email;
  
  

  bcrypt.hash(voter_Key, null, null, function(err, en_key){
    Voter.create({
      voter_key: en_key,
      votername: voterId,
      electionid: eId,
      email: email
    }, function(error, voter){
      if(error){
        console.dir(err);
        return res.json({status: 'error'})
      }else{}
  
      res.json({ status: 'success', voter: voter });
    });
  }) 
  

 });

 app.post('/voterlogin', function(req, res){
   //bcrypt.compare(req.body.password, user.password, function(err, result){
    var voterId = req.body.voterid;
    var voter_Key = req.body.voterkey;

   
    
    
    Voter.findOne({votername: voterId}, (err, voter) => {
      if(err){
        res.json({message: 'not found'})
      }else{
        console.log(voterId);
        console.log(voter_Key);
        res.json({message: 'success', voter: voter})
      }
     
    })
 });

 app.get('/electionforvote', function(req, res){
   var voterID = req.query.voterID;
   console.log('xxxxx');
   console.log(voterID);
  

   Voter.findOne({_id: voterID}, (error, voter) => {
    if(error){
      console.dir(error);
      return;
    }
     console.log(voter._id)
     Election.find({_id: voter.electionid}, (err, elections) => {
       if(err){
         console.dir(err);
         return;
       }

       res.json({elections: elections})
     })
   })
 })

 app.get('/electiondetails', function(req, res){
  var electionID = req.query.electionID;
  var ps;
  var bs;
  var cs;
  console.log(electionID)
     

  Election.findOne({_id: electionID}, (error, election) => {
   if(error){
     console.dir(error);
     return;
   }
    
    Position.find({electionid: election.id}, (err, positions) => {
      if(err){
        console.dir(err);
        return;
      }

      ps = positions;

      Ballot.find({electionid: election.id}, (err, ballots) => {
        if(err){
          console.dir(err);
          return;
        }

        bs = ballots;
  
        Candidate.find({electionid: election.id}, (err, candidates) => {
          if(err){
            console.dir(err);
            return;
          }
  
          cs = candidates;
    
          res.json({election: election, positions: ps, ballots: bs, candidates: cs});  
        });   
      }); 

      
    });

    
     
    
  })   

})


app.post('/vote', function(req, res){
  var title = req.body.title;
  var election = req.body.election;
  var voter = req.body.voter;

  Candidate.findOneAndUpdate({title: title}, (err, candidate) => {
    console.log(candidate);

      if(err){
        console.dir(err);
        return;
      }else{
        candidate.votes = candidate.votes + 1;
        candidate.voters.id = cid;

        candidate.save((error, candidate) => {
          if (error)
            {
               res.status(500).json({status:  'success'})
            }else{
              Voter.findById({_id: voter._id}, (err, voter)=> {
                voter.voted = true;

                voter.save((error, voter) => {
                  if(error){
                    res.status(500).json({status:  'success'})
                  }else{
                    res.json({ candidate: candidate, voter: voter, status:  'success'});
                  }
                })
              })
            }


            /* If all is good then send a JSON encoded map of the retrieved data
               as a HTTP response */
            
        })

      }
  })


})


//election data and details


app.get('/positionelection', function(req, res){
  var eid = req.query.eid;

  Position.find({electionid: eid}, (err, positions) => {
    if(err){
      console.dir(err);

      return res.json({data: 'no data'});
    }else{
      console.log(positions);
      res.json({data: positions})
    }
  })
})

app.get('/candelection', function(req, res){
  var eid = req.query.eid;

  Candidate.find({electionid: eid}, (err, candidates) => {
    if(err){
      console.dir(err);

      return res.json({data: 'no data'});
    }else{
      console.log(candidates);
      res.json({data: candidates})
    }
  })
})

app.get('/start', function(req, res){
  var eid = req.query.eid;

  Election.findById({_id: eid}, (err, election) => {
    if(err){
      console.dir(err);

      return res.json({data: 'no data'});
    }else{
      election.status = 'started';

      election.save((error, election) => {
        if (error){
          res.status(500).json({status: 'error'});
        }else{
          res.status(200).json({status: 'success', election: election});
        }
      })
    }
  })
})

app.get('/end', function(req, res){
  var eid = req.query.eid;

  Election.findById({_id: eid}, (err, election) => {
    if(err){
      console.dir(err);

      return res.json({data: 'no data'});
    }else{
      election.status = 'end';

      election.save((error, election) => {
        if (error){
          res.status(500).json({status: 'error'});
        }else{
          res.status(200).json({status: 'success', election: election});
        }
      })
    }
  })
})

app.get('/delete', function(req, res){
  var eid = req.query.eid;

  Candidate.deleteMany({electionid: eid}, (err)=>{
    if(err){
      console.dir(err);

      
    }
  })

  Ballot.deleteMany({electionid: eid}, (err)=>{
    if(err){
      console.dir(err);

      
    }
  })

  Position.deleteMany({electionid: eid}, (err)=>{
    if(err){
      console.dir(err);

      
    }
  })

  Voter.deleteMany({electionid: eid}, (err)=>{
    if(err){
      console.dir(err);

      
    }
  })



  Election.findByIdAndRemove({_id: eid}, (err, election) => {
    if(err){
      console.dir(err);

      return res.json({data: 'no data or error'});
    }else{
      
      res.status(200).json({status: 'success', election: election});
      
    }
  })
})



  
 app.use('/user', user);



const port = process.env.PORT || 8000;

app.listen(port, function(){
   console.log('Server is running on Port', port);
});
