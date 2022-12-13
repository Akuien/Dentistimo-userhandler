//
//const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
//const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { generateEmailTemplate } = require("../services/mails");


var mongoose = require('mongoose');

/* mongoose.connect(mongoURI,
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }, function (err) {
      if (err) {
          console.error(`Failed to connect to MpngoDB with URI: ${mongoURI}`);
          console.error(err.stack);
          process.exit(1);
      }
      console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  }); */



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

// setup the callbacks
client.on('connect', function () {
  console.log('Connected Successfully');
  console.log('Listening...');
});

client.on('error', function (error) {
  console.log(error);
});

//client.subscribe(UserInfo/test)

/* const authenticateUser = function (topic, payload) {
  
} */ 



client.subscribe('UserInfo/test', function () {
  // When a message arrives, print it to the console
  client.on('message', function (topic, message) {

    console.log("Received '" + message + "' on '" + topic + "'")
    
    const userInfo = JSON.parse(message);


    const newUser = new User({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phoneNumber: userInfo.phoneNumber,
      email: userInfo.email,
      password: bcrypt.hashSync(userInfo.password, 10)
    })

    console.log(newUser)
    var savedUser = newUser.save();
    //sendVerifyMail(savedUser);
  })
})


client.subscribe('LoginInfo/test', function () {
  // When a message arrives, print it to the console
  client.on('message', async function (topic, message) {

    console.log("Received '" + message + "' on '" + topic + "'")

    const loginInfo = JSON.parse(message);

    // const loginInfo =  {
    //   email: this.form.email,
    //   password: this.form.password
    // }

if(topic === 'LoginInfo/test') {
  console.log(message.toString())
  var emailMessage = JSON.parse(message)
  var passwordMessage = JSON.parse(message)
  var insertedEmail = emailMessage.email
  var insertedPassword = passwordMessage.password
}
  try {
    const user =  await User.findOne( {email: insertedEmail, password: insertedPassword})
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
  })
})


/*
registerNewCompany =  function(req, res) {
  if(req.body.company_email && req.body.password){
      Company.find({company_email: req.body.company_email}, function(err, company){
          if(err){
              return res.status(409).json({'message': 'Not able to register Company!', 'error': err});
          }
          if(company.length >= 1){
              return res.status(409).json({
                  message: 'A company with such email address already exists'
              });
          }
          bcrypt.hash(req.body.password,8,(err,hash) => {
              if(err){return res.status(500).json({error: err});}
              else{
                  var company = new Company({

                      _id: new mongoose.Types.ObjectId()  ,
                      company_name : req.body.company_name,
                      company_description : req.body.company_description,
                      company_location : req.body.company_location,
                      company_email : req.body.company_email,
                      company_phone : req.body.company_phone,
                      password : hash,
                      job_posts : []
                  });
                  let data = company;
                  const token = jwt.sign({_id: company._id, email: company.company_email, name: company.company_name}, "secret");
                  company.tokens.push({token});
                  company.save(function(err, data) {
                      if (err) { return res.status(409).json({'message': 'Company unvailable!', 'error': err}); }
                      res.status(201).json({data, token});
                  }); 
              }
          });
      });
  }
  else {
      return res.status(409).json({
          message: 'Please provide email and password'
      });
  }
};


*/

// for sending email verification
const sendVerifyMail = async (savedUser) => {
  var name = savedUser.firstName
  var email = savedUser.email
  var user_id = User._id

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
      to: email,
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
    const email = message.email;
    const password = message.password;

    User.find({email: email}, function(err, user){
      if (err) { return next(err); }
      console.log(company)
      if (!company) {
          return res.status(404).json({ error: "Account does not exist." });
      }
      if (bcrypt.compare(password, company.password)){
          const token = jwt.sign({_id: company._id, email: company.company_email, name: company.company_name}, "secret");
          res.status(201).json({ company, token });    
      } else {
          return res.status(400).json({error: 'Email or password incorrect.'})
      }
   }).catch((err) => {return res.send(err);});
  }; */
