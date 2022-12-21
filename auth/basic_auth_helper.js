const db = require('../helpers/databases/postgre/connection');
const conn = require('../helpers/databases/postgre/connection')

// const findByUsername = async (user) => {
//     return await db.query('select username, pass from userr where username = $1', [user])
// }



const findByUsername = async user => {
    console.log('basic authen>>',user);
    conn.connect()
    const db = conn.db('sell');
    return await db.collection('users').find({ username: user }).toArray()
}

module.exports = {
    findByUsername
}