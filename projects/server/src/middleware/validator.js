const { body, validationResult } = require("express-validator")
const db = require('../models')
const User = db.user

const userValidateRules = () => {
    return [
        body('email').isEmail().withMessage('This is not email').normalizeEmail().custom( async (val) => {
            return await User.findOne({
                where : {email : val}
            }).then(user => {
                if(user){
                    return Promise.reject('Email already in use')
                }
            })
        }),
        body('username').notEmpty().withMessage("Username must be filled").custom( async (val) => {
            return await User.findOne({
                where : {username : val}
            }).then(user => {
                if(user){
                    return Promise.reject('Username already in use')
                }
            })
        }),        
        body('firstName').notEmpty().withMessage("First name must be filled").matches(/[a-zA-Z]/).withMessage("First ame must be a characters"),
        body('lastName').notEmpty().withMessage("Last name must be filled").matches(/[a-zA-Z]/).withMessage("Last name must be a characters"),
        body('address').notEmpty().withMessage("Address must be filled"),
        body('birthdate').notEmpty().withMessage("Birth date must be filled"),
        body('password').notEmpty().withMessage("Password must be filled").isLength({min: 8, max: 16}).withMessage("Password length must between 8 - 16 characters"),
        body('passwordConfirm').notEmpty().withMessage("Password Confirm must be filled").custom((value, { req }) => {
            if (value != req.body.password) {
              throw new Error('Password confirmation does not match password');
            }
        
            // Indicates the success of this synchronous custom validator
            return true;
          })

    ]
}

const validate = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});    
    }

    return next()
}

module.exports = {
    userValidateRules,
    validate
}