const mqtt = require('mqtt')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const client = mqtt.connect({
  host: process.env.HOST,
  port: process.env.PORT,
  protocol: 'mqtts',
  username: process.env.USERNAME,
  password: process.env.PASSWORD
})

client.on('connect', function () {
  console.log('Connected') // subscribe and publish to the same topic
  client.subscribe('user/auth', function (err) {
    if (!err) {
      client.publish('user/auth', 'Hello mqtt')
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


