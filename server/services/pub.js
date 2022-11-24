const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1:1883') // public broker mqtt://broker.hivemq.com

client.on('connect', function () {
  client.subscribe('topic1/test', function () {

  })
  // Publish a new message every 4 seconds
  setInterval(function () {
    const rand = Math.random() * 100
    client.publish('topic1/test', String(rand), function () {
      console.log('Pushed: ' + rand)
    // client.end();
    })
  }, 4000)
})
