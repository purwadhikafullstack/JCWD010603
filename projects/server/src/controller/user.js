const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize");
const {sequelize} = require("../models")
const secret_key = process.env.secret_key
const mailer = require("../library/mailer")

const db = require("../models")
const User = db.user
const User_detail = db.user_detail
const Address = db.address


const userController = {

register: async (req,res) => {
    const data = req.body

    const t = await sequelize.transaction();
    try {

    // check password 

    const password = bcrypt.hashSync(data.password, 10)

    const dataUser = {
        email : data.email,
        username : data.username,
        password : password,
        isVerify : false
    }

    const user = await User.create({...dataUser}, {transaction: t})
    if(!user){
        throw new Error('Create user failed')
    }

    const dataUserDetail = {
        UserId: user.dataValues.id,  
        birthdate : data.birthdate,
        gender : data.gender,
        firstName : data.firstName,
        lastName : data.lastName,
    }

    const userDetail = await User_detail.create({...dataUserDetail}, {transaction: t})
    if(!userDetail){
        throw new Error('Create user detail failed')
    }

    const dataAddress = {
        UserId: user.dataValues.id,  
        address : data.address,
        province : data.province,
        city : data.city,
        district : data.district,
        postalCode : data.postalCode,
        isActive : true
    }

    const address = await Address.create({...dataAddress}, {transaction: t})
    if(!address){
        throw new Error('Create user detail failed')
    }

    const token = jwt.sign({...user.dataValues}, secret_key, {expiresIn: "1h"})
    const href = `http://localhost:8000/user/verify/${token}`
      // verify via email
      const mail = await mailer({
        to: data.email,
        subject: "Verify Your Account!",
        html: `<a href="${href}"> testing</a>`
      })
      console.log(mail);

      await t.commit();
      res.status(201).send('Create user success')
    } catch(err) {
        console.log(err);
        await t.rollback();
        return res.status(400).send(err)
    }
},
verify : async (req,res) => {
    token = req.params.token
    console.log(token);

    
    const t = await sequelize.transaction();
    try {
        if(!token){
            throw new Error('token is undefined')   
        }

        const verifyUser = jwt.verify(token, secret_key)
        console.log(verifyUser);
        const user = await User.findByPk(verifyUser.id, {transaction: t})
        console.log(user);
        if(!user){
            throw new Error('verify email failed, user not found')
        }
        await User.update({
            isVerify : true
        }, {
            where: {
                id : user.id
            }
        }, {transaction: t})

        res.status(202).send('Verify user success')
        await t.commit();
    } catch (err) {
        await t.rollback();
        return res.status(401).send(err)
    }
},
keeplogin: async (req, res) => {
    try {
      const token = req.headers.authorization;

      const oldUser = jwt.verify(token, process.env.secret_key);
      const newUSer = await User.findByPk(oldUser.id);

      delete newUSer.dataValues.password;

      res.status(200).json({
        result: newUSer,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
}

module.exports = userController;
