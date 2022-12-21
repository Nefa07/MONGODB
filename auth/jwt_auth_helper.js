const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
// console.log(process.env) 

// const generateWebToken = function (username) {
//     return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' })
// }

const generateAccessToken = function (username) {
    // sign ini untuk membuat tokennya
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

const authenticateToken = function (token) {
    return jwt.verify(token, process.env.TOKEN_SECRET) 
}

module.exports = {
    jwt,
    generateAccessToken,
    authenticateToken
}