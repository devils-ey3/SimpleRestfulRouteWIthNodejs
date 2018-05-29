const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const saltRounds = 10;
const User = require("../models/users");


exports.user_signup = (req, res, next) => {
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
                    _id: mongoose.Types.ObjectId(),
                    user: req.body.email,
                    password: hashPassword
                })
                user.save().then((result) => {
                    res.status(200).json({
                        message: "User is created",
                        email: result.user
                    });
                }).catch((err) => {
                    res.status(500).json({
                        err
                    });
                });
            }
        })

    })

}

exports.user_login = (req, res, next) => {
    User.findOne({
        user: req.body.email
    }, (err, result) => {
        if (!result) {
            return res.status(500).json({
                error: "Auth Fail"
            })
        }
        bcrypt.compare(req.body.password, result.password).then((compareResult) => {
            if (compareResult) {

                const token = jwt.sign({
                    user: result.user,
                    _id: result._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1h"
                }, );
            return res.status(200).json({
                message:"Auth seccess",
                token:token
            })
            } else {
                return res.status(500).json({
                    error: "Auth Fail"
                })
            }
        });
    })

}

exports.user_remove = (req, res, next) => {
    User.findByIdAndRemove(req.params.userID).then((result) => {
        res.status(200).json({
            message: result.user + " is removed",
        });
    }).catch((err) => {
        res.status(500).json({
            error: err
        })
    });
}