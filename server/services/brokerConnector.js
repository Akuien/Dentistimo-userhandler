/* const mqtt = require('mqtt')

require('dotenv').config();

const options = process.env.OPTIONS

const client = mqtt.connect(options)

client.on('connect', function () {
  console.log('Connected') // subscribe and publish to the same topic
  client.subscribe('user/auth', function (err) {
    if (!err) {
      client.publish('user/auth', 'Hello mqtt')
    }
  })
})

// prints a received message
client.on('message', function (message) {
  console.log(String.fromCharCode.apply(null, message)) // need to convert the byte array to string
})



client.on('error', (error) => {
  console.log('Error:', error)
})


client.on('connect', function () {
  client.subscribe('user/auth', function () {

  })
  /*
  // Publish a new message every 4 seconds
  setInterval(function () {
    const rand = Math.random() * 100
    client.publish('user/auth', String(rand), function () {
      console.log('Pushed: ' + rand)
    // client.end();
    })
  }, 4000) 
}) 


client.on('connect', function () { // When connected
  // Subscribe to a topic
  client.subscribe('user/auth', function () {
    // When a message arrives, print it to the console
    client.on('message', function (topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'")
    })
  })
}) */