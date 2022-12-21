const queryHandler = require('../repositories/queries/query')
const { Query } = require('pg/lib/client');
const jwtAuth = require('../../../auth/jwt_auth_helper')
const bcrypt = require('bcryptjs');
const conn = require('../../../helpers/databases/postgre/connection')
conn.connect()
const db = conn.db('sell');

const { createClient } = require('redis');
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const getUser = async (req, res) => {
    try {
        const token = req.headers['authorization']
        if (token == null) return res.sendStatus(401)
        const user = jwtAuth.authenticateToken(token)
        const data = await client.get(user.username)
        if (data === token) {
            const result = await queryHandler.getDataUser(req)
            res.status(200).json(result);
        } else {
            res.status(404).json('authen failed')
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json('something broke');
    }
}

const getUserById = async (req, res) => {
    try {
        const token = req.headers['authorization']
        const user = jwtAuth.authenticateToken(token)
        console.log('ini user', user);
        const data = await client.get(user.username)
        console.log('ini data redis', data);
        if (data == token) {
            const result = await queryHandler.getDataUserById(req)
            console.log('ini result', result);
            if (result.rowCount != 0) {
                return res.status(200).json(result)
            } else {
                return res.json('user not found')
            }
        } else {
            res.status(404).json('authen failed')
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('something broke')
    }
}

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 2);

        // await db.query('insert into userr (username,pass) values ($1,$2)', [username, hash])
        // await db.collection('users').insertOne({ username: username, pass: hash });
        await queryHandler.register(req)
        res.status(200).json('user registed')
    }
    catch (err) {
        console.log(err);
        res.status(500).json('something broke')
    }
}

const updateUser = async (req, res) => {
    try {
        const token = req.headers['authorization']
        console.log('ini token', token);
        const user = jwtAuth.authenticateToken(token)
        console.log(user);
        const data = await client.get(user.username)
        console.log('ini data', data);
        if (data == token) {
            await queryHandler.updateUser(req)
            res.sendStatus(200)
        }
        else {
            return res.status(404).json('authentication failed')
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('something broke')
    }
}

const deleteUser = async (req, res) => {
    try {
        const token = req.headers['authorization']
        const user = jwtAuth.authenticateToken(token)
        const data = await client.get(user.username)
        console.log('1', token);
        console.log('2', data);
        if (data == token) {
            queryHandler.deleteUser(req)
            res.status(200).json('delete success')
        } else {
            res.status(404).json('authen failed')
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json('something broke')
    }
}

module.exports = {
    getUser,
    getUserById,
    register,
    updateUser,
    deleteUser
} 
