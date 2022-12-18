# User Handler

## Description
The user handler is responsible for handling user information sent to it by the user interface component. The information will either be saved to the database creating a new user, used for authentication of the user by matching provided data with data saved in the database, or used to verify the users email address.

## Component Responsibilities
* Save user data in the database

* Authentication of users 

* Verification of users’ email address

* Listen to MQTT for user data requests from the user interface component

* Publish user data via MQTT

## Architectural style
- **Publish and subscribe:**

The user handler acts as a subscriber when receiving the user requests from the user interface component. It then either searches the database for the requested user and publishes the results to the MQTT Broker, or saves the data to the database.

## Technologies:
This component uses the following dependencies:

- Node JS
- HiveMQ
- Mongoose

Get started:
1. Clone the repository
2. To Install the component dependencies run `npm install` in the terminal 
3. To run the component, do: `cd server` and `cd controllers` then `node authentication.js`


Authors and acknowledgment(Team Members)
* Akuen Akoi Deng
* Marwa Selwaye
* Kanokwan Haesatith
* Cynthia Tarwireyi
* Nazli Moghaddam
* Jonna Johansson
* Sergey Balan
##
**More details about this system can be found in:** [Documentation](https://git.chalmers.se/courses/dit355/dit356-2022/t-5/t-5-documentation)

