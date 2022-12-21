const express = require('express')
const dbUser = require("../../modules/user/handlers/api_handler")
var usr = express.Router();

usr.get("/listUser", dbUser.getUser)
usr.get("/user/:user",dbUser.getUserById)
usr.post("/register",dbUser.register)
usr.put("/updateUser/:user",dbUser.updateUser)
usr.delete("/deleteUser/:user",dbUser.deleteUser)

module.exports = usr




