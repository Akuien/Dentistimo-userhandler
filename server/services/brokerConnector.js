const mqtt = require('mqtt')


const options = { //need to hide info in a confiq file
  host: 'b38f131fe30e471dab185c4a2316c77f.s2.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'BrokerConnector',
  password: '1234dentistimo1234'
}


const client = mqtt.connect(options)
client.on('connect', function () {
  console.log('Connected') // subscribe and publish to the same topic
  client.subscribe('test', function (err) {
    if (!err) {
      client.publish('test', 'Hello mqtt')
    }
  })
})

// prints a received message
client.on('message', function (topic, message) {
  console.log(String.fromCharCode.apply(null, message)) // need to convert the byte array to string
})


client.on('connect', () => {
  console.log('Connected!')
})


client.on('error', (error) => {
  console.log('Error:', error)
})


