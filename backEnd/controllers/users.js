const User = require('../models/users');

const bcrypt = require('bcrypt'); /// For hashing passwords 

const jwt = require('jsonwebtoken'); //Used for Authentication


exports.signUp = (req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(
        (hash)=>{
            let user = new User({
                email: req.body.email,
                password: hash
            });

            user.save().then(
                ()=>{
                    res.status(200).json({
                        message: 'User created successfully'
                    });
                }
            ).catch((err)=>{
                res.status(404).error(err);
            });
        }
    );
}


exports.login = (req,res,next)=>{
    //Find User
    let findUser = {
        email: req.body.email
    }
    User.findOne(findUser).then(
        (user)=>{
            if(!user) {
                return res.status(404).json({
                    message: 'User Not Found'
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid)=>{
                    if(!valid){
                        return res.status(401).json({
                            message: 'Incorrect Password'
                        });
                    }
                    const token = jwt.sign(
                        {userId: user._id},
                        'RANDOM_TOKEN',
                        {expiresIn: '24h'}
                    );
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch((err)=>{
                res.status(500).error(err);
            })
        }
    ).catch((err)=>{
        res.status(500).error(err);
    });
}