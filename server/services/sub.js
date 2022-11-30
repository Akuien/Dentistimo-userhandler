const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1:1883') 


client.on('connect', function () { // When connected
  // Subscribe to a topic
  client.subscribe('user/auth', function () {
    // When a message arrives, print it to the console
    client.on('message', function (topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'")
    })
  })
})
