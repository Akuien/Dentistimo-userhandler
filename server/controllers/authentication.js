const express = require("express");
const router = express.Router();
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

//register 

router.post("/api/users", async (req, res, next) => {
    const newUser = new user({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    })
    try {
      var savedUser = await newUser.save();
      res.status(200).json({
        savedUser,
        title: 'Signup Successful' })
    } 
    catch (err) {
      return res.status(400).json({
        title: 'error',
        error: 'email in use'
      })
    }
    });

    
//Login
router.post('/api/users/login', (req, res, next) => {
    user.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).json({
        title: 'server error',
        error: err
      })
      if (!user) {
        return res.status(401).json({
          title: 'user not found',
          error: 'invalid credentials'
        })
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: 'login failed',
          error: 'invalid credentials'
        })
      }

      try {
      let token = jwt.sign({ userId: user._id}, 'secretkey');
      return res.status(200).json({
        title: 'login sucess',
        token: token
      })
    } 
    catch (err) {
      return res.status(400).json({
        title: 'error',
        error: 'The login was not successful!'
      })
    }
    })
  })
  
  router.get('/api/user', (req, res, next) => {
    let token = req.headers.token; 
    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) return res.status(401).json({
        title: 'unauthorized'
      })
      
      user.findOne({ _id: decoded.userId }, (err, user) => {
        if (err) return console.log(err)
        return res.status(200).json({
          title: 'user info received ',
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            password: user.password,
            email: user.email,
            id: user.id
          }
        })
      })
  
    })
  })

module.exports = router;