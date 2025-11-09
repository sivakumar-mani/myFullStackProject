const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "SELECT * from user WHERE email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "INSERT into user (name, contactNumber, email,password, status, role ) VALUES (?,?,?,?, 'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({
                            message: "User registered successfully"
                        })
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Email id already exists"
                })
            }
        } else {
            return res.status(500).json(err);
        }
    })
});

router.post('/login', (req, res) => {
    const user = req.body;
    query = "SELECT email,password,status, role FROM user WHERE email=? ";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: " User Name or password incorrect" })
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "User is not active, waiting or approval" })
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                return res.status(200).json({ token: accessToken })
            }
            else {
                return res.status(400).json({ message: "Something went wrong, try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
});

var transporter = nodemailer.createTransport({
    server: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "SELECT email, password FROM user WHERE email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: 'Password sent to your email id' });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password sent to from cafe',
                    html: '<p>please check this Email:' + results[0].email + 'Password :' + results[0].password + '</p><br><a href="http://localhost:4200">Click to login</a>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('email sent' + info.response);
                    }
                });
                return res.status(200).json({ message: 'Password sent to your email id' });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
});

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    query = "SELECT id, name, ContactNumber, role, status FROM user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    const user = req.body;
    query = "UPDATE user set status=? where id =?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "user is not found" })
            }
            return res.status(200).json({ message: "User status updated successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
});

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" })
});

router.post('/changePassword',auth.authenticateToken,(req, res) => {
    const user = req.body
    const email = res.locals.email;
    console.log(email)
    query = "select * from user where email=? and password=?";
    connection.query(query, [email,user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect old password" });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Updated successfully" });
                    }
                    else {
                        return res.status(500).json(err)
                    }
                })
            }
            else {
                return res.status(400).json({ message: "something went wrong" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;