const conn = require('../../../../helpers/databases/postgre/connection')
const bcrypt = require('bcryptjs');
const { query } = require('express');
conn.connect()
const db = conn.db('sell')

const getDataUser = async (req) => {
    const page = req.query.page;
    const limit = req.query.limit;

    const queryCount = await db.collection('users').find({}).count()
    const query = {}
    const getData = await db.collection('users').find(query).skip(parseInt(page-1) * parseInt(limit)).limit(parseInt(limit)).toArray()
    const totalPages = Math.ceil(parseInt(queryCount) / limit);

    const resultObj = {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPage: totalPages,//totalPages,
        totalDataInPage: getData.rowCount,//getData.rowCount,
        totalItems: parseInt(queryCount),//parseInt(queryCount.rows[0].count),
        data: getData//getData.rows
    }
    return resultObj
};

const getDataUserById = async (req) => {
    const user = req.params.user
    console.log(user);
    // const getData = await db.query('select * from userr where id =$1', [id])
    const getData = await db.collection('users').find({ username: user }).toArray()
    const resultObj = {}
    return getData
}

const register = async (req) => {
    const { username, password } = req.body
    // const getData = async () => await db.query('insert into userr (username,pass) values ($1,$2)', [username, password])
    const hash = await bcrypt.hash(password, 2)
    const getData = await db.collection('users').insertOne({ username: username, pass: hash })
    return getData
}

const updateUser = async (req) => {
    const user = req.params.user
    console.log('ini user', user);
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 2);
    console.log('ini hash', hash);
    const updateData = await db.collection('users').updateOne({ username: user }, { $set: { pass: hash } }, { upsert: true });
    return updateData
}

const deleteUser = async (req) => {
    const user = req.params.user
    console.log(user);
    // const deleteData = async () => await db.query('delete from userr where id = $1', [id])
    const deleteData = await db.collection('users').deleteOne({ username: user })
    return deleteData
}

module.exports = {
    getDataUser,
    getDataUserById,
    register,
    updateUser,
    deleteUser
}