const express = require('express');
const router = express.Router(); //handler different routes and reach different endpoints 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


// create a new user
router.post('/signup', (req, res, next) => {
    User
    .findOne({email: req.body.email}) //find if email exist already 
    .then(user => {
        if (user) { // if there's a user with the requested mail
            return res.status(409).json({
                message: `${req.body.email}, does already exist in the database.`
            }); 
        }else{ // if there's no user with that mail. then create one
        bcrypt.hash(req.body.password, 10, (err, hash) => {//hash password to a random string. saltOrRounds ads plaing text to the password to avoid people hasing hashing tables on a weak password  
        //^^GET INPUT FROM FORM^^
            if(err){
                console.log(err);
                res.status(500).json({
                    message: 'an error occurred while hashing your password',
                    error: err
                });
    
            }else{
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email, //GET INPUT FROM FORM
                    password: hash
                });
                user
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({    
                        message: 'user successful created'                    
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: 'Was not able to save user correctly in the database',
                        error: err
                    });                   
                })
            }
        }); 
        }
    })
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
            message: "authorization failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {// unauthorized
                return res.status(401).json({
                message: "authorization failed"
            });
            }
            // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            if (result) { //authorized you cabn decrypt the token here: https://jwt.io/
                const token = jwt.sign( //create a new token 
                {
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY,
                { // js object with the options of the signing process
                    expiresIn: "1h"
                }
            );
                return res.status(200).json({
                    message: "authorization successful",
                    token: token
                });
            }
            res.status(401).json({// unauthorized
                message: "authorization failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete("/:userId", (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .then(result => {
            res.status(200).json({
            message: "User deleted"
            });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
      });
  });

module.exports = router;