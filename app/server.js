const db = require('../helpers/databases/postgre/connection')
const basicAuth = require('../auth/basic_auth_helper')
const bcrypt = require('bcryptjs');

// express
const express = require("express")
const bodyParser = require('body-parser')
const app = express()

// jwt
const jwtAuth = require('../auth/jwt_auth_helper')

// redis
const { createClient } = require('redis');
const { rows } = require('pg/lib/defaults');
const client = createClient();

// mongoDb
const conn = require('../helpers/databases/postgre/connection')
// const dbName = 'sell'

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get("/", function (req, res) {
    res.send('all good')
})

app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("connect to port 3000");
    }
})

app.post("/login", async (req, res) => {
    try {
        const usrname = req.body.username;
        const pass = req.body.password;
        console.log('server>>', usrname);
        const result = await basicAuth.findByUsername(usrname)
        console.log(result);
        console.log('ini username', result[0].username);
        console.log('ini pass', result[0].pass);
        if (result[0].username === usrname) {
            const validPass = await bcrypt.compare(pass, result[0].pass)
            // const validPass = result[0].pass
            if (validPass) {
                const token = jwtAuth.generateAccessToken({
                    username: req.body.username,
                })
                client.set(usrname, token)
                // console.log(token);
                res.status(200).json(`valid username and password!! ini tokennya >> ${token}`)
                // res.status(200).json(`all good`)
            } else {
                res.json('wrong password!!')
            }
        } else {
            res.status(404).json('user not found!!')
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send('something broke')
    }
})

app.get('/logout', async (req, res) => {
    try {
        const token = req.headers['authorization']
        console.log('ini token', token);
        const user = jwtAuth.jwt.verify(token, process.env.TOKEN_SECRET)
        console.log(user);
        // user = { username: 'alex' }
        const data = await client.get(user.username)

        console.log('ini data', data);
        if (data === token) {
            console.log(data);
            // delete redis[user.username]
            console.log('sebelum dihapus', await client.KEYS('*'));
            client.del(user.username);
            console.log('setelah dihapus', await client.KEYS('*'));
            return res.status(200).json('logout success')
        }

        if (err) return res.sendStatus(403)
    }

    catch (err) {
        console.log(err);
        res.status(500).json('something broke')
    }

})

app.use("/user", require("./routes/user"))
