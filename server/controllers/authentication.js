
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { generateEmailTemplate } = require("../services/mails");


var mongoose = require('mongoose');


  // Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Dentistimo:QsyJymgvpYZZeJPc@cluster0.hnkdpp5.mongodb.net/?retryWrites=true&w=majority';
//var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

//mqtt connection
var mqtt = require('mqtt');

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })


const options = {
  host: '45fb8d87df7040eb8434cea2937cfb31.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'Team5@Broker',
  password: 'Team5@Broker'
}

const client = mqtt.connect(options)

client.subscribe('UserInfo/test')
client.subscribe('LoginInfo/test')

// setup the callbacks
client.on('connect', function () {
  console.log('Connected Successfully');
  console.log('Listening...');

  client.on('message', async function (topic, message) {

    console.log("Received '" + message + "' on '" + topic + "'")
  
    //signUp
    if(topic === 'UserInfo/test') {
  
      const userInfo = JSON.parse(message);
  
      const newUser = new User({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phoneNumber,
        email: userInfo.email,
        password: userInfo.password
        //password: bcrypt.hashSync(userInfo.password, 10)
      })
    
      console.log(newUser)
      var savedUser = newUser.save();
      sendVerifyMail(userInfo.firstName, userInfo.email, savedUser._id);
  
      //Login
    } else if(topic === 'LoginInfo/test')  {
  
      const loginInfo = JSON.parse(message);
  
      var insertedEmail = loginInfo.email
      var insertedPassword = loginInfo.password

      try {
        const user = await User.findOne( {email: insertedEmail, password: insertedPassword})
        if (user === null) {
          console.log("email error")
        } else if (insertedPassword !== user.password) {
          console.log("invalid pass")
        } else {
          let validateUser = JSON.stringify(user)
          client.publish("pub/loginResponse", validateUser, 1, (error) => {
            if (error) {
              console.log(error)
            }else {
              console.log(validateUser, 'ok')
            }
          })
        }
      }catch (error) {
          return (error)
        }
  
    }
    
  })

});

client.on('error', function (error) {
  console.log(error);
});





// for sending email verification
const sendVerifyMail = async (userFirstName, userEmail, userId) => {
  var name = userFirstName
  var email = userEmail
  var user_id = userId

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "dentistimogroup5@gmail.com",
        pass: "xhoevjhavlqgbhvn",
      },
    });
    const mailOptions = {
      from: "dentistimogroup5@gmail.com",
      to: userEmail,
      subject: "Verify your account",
      html: generateEmailTemplate(name, email, user_id),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email have been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//========================================================================================================================================


/*
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
      sendVerifyMail(req.body.firstName, req.body.email, savedUser._id);
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
  });


  router.get("/api/verify/:id", async (req, res) => {
  try {
    const updateInfo = await user.updateOne(
      { _id: req.params.id },
      { $set: { verified: true } }
    );

    console.log(updateInfo);
    return res.status(200).json({
      message: "verified!",
    });
  } catch (error) {
    console.log(error.message);
  }
  });

module.exports = router;   */


/*
login = (message) => {
    const insertedEmail = message.email;
    const insertedPassword = message.password;

    User.find({email: email}, function(err, user){
      if (err) { return next(err); }
      console.log(user)
      if (!user) {
          return ({ error: "Account does not exist." });
      }
      if (bcrypt.compare(insertedPassword, user.password)){
          console.log('Login successful')
      } else {
          console.log('incorrent password')
      }
   }).catch((err) => {return res.send(err);});
  }; 

        const checkPass = async (reqPass, pass) => await bcrypt.compare(reqPass, pass);
  
        try {
        const user = User.findOne( {email: insertedEmail, password: insertedPassword})    
        .then(async (foundUser) => {
          if (!foundUser) {
            return { authenticated: false, message: "User not found" };
          }
          console.log('user = '+ user)
          console.log('user = '+ foundUser)
          const isCorrectPass = await checkPass(insertedPassword, foundUser.password);
          if (isCorrectPass) {
            let validateUser = JSON.stringify(user)
            client.publish("pub/loginResponse", validateUser, 1, (error) => {
              if (error) {
                console.log(error)
              }else {
                console.log(validateUser, 'ok')
              }
            })
            return { authenticated: true, message: foundUser };
    
          } else {
            return { authenticated: false, message: "incorrect password" };
          }
        })
        } catch (error) {
          return (error)
        }
  
  */
