const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("../models/users");

router.post('/signup', (req, res, next) => {
    User.findOne({
        user: req.body.email
    }, (err, email) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        if (email) {
            return res.status(422).json({
                error: "Email exist"
            })  
        }
        bcrypt.hash(req.body.password, saltRounds, (err, hashPassword) => {
            if (err) {
                return req.status(500).json({
                    error: err
                })
            } else {
                const user = new User({
                    _id : mongoose.Types.ObjectId(),
                    user: req.body.email,
                    password: hashPassword
                })
                user.save().then((result) => {
                    res.status(200).json({
                        message: "User is created",
                        email : result.user
                    });
                }).catch((err) => {
                    res.status(500).json({
                        err
                    });
                });
            }
        })

    })

})

router.delete('/:userID',(req,res,next) => {
    User.findByIdAndRemove(req.params.userID).then((result) => {
        res.status(200).json({
            message:result.user+" is removed",
        });
    }).catch((err) => {
        res.status(500).json({
            error:err
        })
    });
})

module.exports = router;