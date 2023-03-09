const db = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const Admins = db.admin;

const adminController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        const result = await Admins.findOne({
            where: {
                email: email,
                password: password
            }
        })

        if (!result) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        else {
            const check = bcrypt.compare(password, result.password)

            if (!check) {
                return res.status(400).json({
                    message: "Wrong password"
                })
            }

            else {
                return res.status(200).json({
                    message: "Logged in",
                    result: result
                })
            }
        }
    },
}

module.exports = adminController
