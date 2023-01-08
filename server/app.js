const User = require("./models/user");
const nodemailer = require("nodemailer");
const { generateEmailTemplate } = require("./services/mails");
var database = require('./Database/database');
var mqtt = require('mqtt');

const options = {
  host: '45fb8d87df7040eb8434cea2937cfb31.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'Team5@Broker',
  password: 'Team5@Broker'
}

const client = mqtt.connect(options)

client.subscribe('user/signUp/request')
client.subscribe('user/login/request')
client.subscribe('Users/verify')
client.subscribe('user/updateUser/request')

client.on('connect', function () {
  console.log('Connected Successfully');
  console.log('Listening...');

  client.on('message', async function (topic, message) {

    console.log("Received '" + message + "' on '" + topic + "'")
  
    //signUp
    if(topic === 'user/signUp/request') {
  
      const userInfo = JSON.parse(message);
        const newUser = new User({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phoneNumber,
        email: userInfo.email,
        password: userInfo.password
      })
    
      console.log(newUser)
      var savedUser = newUser.save();
      
      sendVerifyMail(userInfo.firstName, userInfo.email, newUser._id);
  
      //Login
    } else if(topic === 'user/login/request')  {
  
      const loginInfo = JSON.parse(message);
      var insertedEmail = loginInfo.email
      var insertedPassword = loginInfo.password

      try {
        const user = await User.findOne( {email: insertedEmail})
        if (user === null || insertedPassword !== user.password ) {
          let validateUser = JSON.stringify(user)

          client.publish("user/login/response/notApproved", validateUser, { qos: 1, retain: false }, (error) => {
            if (error) {
              console.log(error)
            }else {
              console.log("incorrect credentials")
            }
          })
        } else {
          let validateUser = JSON.stringify(user)

          client.publish("user/login/response/approved", validateUser, { qos: 1, retain: false }, (error) => {
            if (error) {
              console.log(error)
            }else {
              console.log(validateUser, 'User authaurized')
            }
          })
        }
      }catch (error) {
          return (error)
        }
  //Verify new users email
    } else if (topic === 'Users/verify') {
      const updateUser = JSON.parse(message)
      const filter = { _id: updateUser.user_id };
      const update = { verified: true };
      try {
      let verifiedUser = await User.findOneAndUpdate(filter, update, {
        new: true}
      )
      console.log(verifiedUser);
    }catch (error) {
          return (error)
        }
  }
 // update user information
  else if(topic === 'user/updateUser/request') {
    const updateUser = JSON.parse(message)
    
      console.log(updateUser, "info")
      let user = ({
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        email: updateUser.email,
        phoneNumber: updateUser.phoneNumber,
        password: updateUser.password
      })
      try {
        let newUser = await User.findOneAndUpdate({_id: updateUser.id}, user, {new: true});
        console.log(newUser, "newUser")
        var id = updateUser.id;
        var UserErr = "user couldn't update"
        const Targetuser = User.find({_id: id})
  
        if (Targetuser !== null) {
          let userUpdat = JSON.stringify(newUser)

          client.publish("user/updateUser/response", userUpdat, { qos: 1, retain: false }, (error) => {
            if (error) {
              console.log(error)
            } else {
              console.log("user updated")
            }
          })
  
        } else {
          client.publish("ui/UserError", UserErr, 1, (error) => {
            if (error) {
              console.log(error)
            } else {
              console.log("error message sent back")
            }
          })
        }
      }
      catch (error) {
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