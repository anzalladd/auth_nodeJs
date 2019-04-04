const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// make table users
const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', {unique: true});

// validate with joi
const schema = Joi.object().keys({
    username: Joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
})

// Router di sini sudah diberi nilai /auth
router.get('/', (req, res) => {
    res.json({
        messages: 'Hello this is a Router bruh  ⏲'
    });
});

// Post Route /auth/signup
router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if(result.error === null){
        // unique username
        users.findOne({
            username: req.body.username
        }).then(user => {
            if(user){
                // there's already user in db
                // respond with an error
                const err = new Error('Username alredy existed');
                next(err);
            }
            else{
                // hash password
                bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                    // insert to data base
                    const newUser = {
                        username: req.body.username,
                        password: hashedPassword
                    }

                    users.insert(newUser).then(insertedUser => {
                        res.json({insertedUser})
                    })
                })
            }
        })
    }
    else{
        next(result.error);
    }
});

module.exports = router;
