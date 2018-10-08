const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


router.post('/signup', function(req, res) {
   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err
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
               success: 'success'
            });
         }).catch(error => {
            res.status(500).json({
               error: err
            });
         });
      }
   });
});

router.post('/signin', function(req, res){
    User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
       bcrypt.compare(req.body.password, user.password, function(err, result){
          if(err) {
             return res.status(401).json({
                failed: 'Unauthorized Access'
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

               return res.status(200).json({
                 success: 'Welcome to the JWT Auth',
                 token: '2hxxxx'
               });
           //  return res.status(200).json({
             //   success: 'Welcome to the JWT Auth'
           //  });
          }
          return res.status(401).json({
             failed: 'Unauthorized Access'
          });
       });
    })
    .catch(error => {
       res.status(500).json({
          error: error
       });
    });;
 });

module.exports = router;