const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1:1883') 

client.on('connect', function () {
  client.subscribe('user/auth', function () {

  })
  // Publish a new message every 4 seconds
  setInterval(function () {
    const rand = Math.random() * 100
    client.publish('user/auth', String(rand), function () {
      console.log('Pushed: ' + rand)
    // client.end();
    })
  }, 4000)
})
