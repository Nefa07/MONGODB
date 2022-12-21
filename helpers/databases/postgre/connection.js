// const { Pool } = require('pg')
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "tutorial",
//     password: '12345',
//     port: 5432
// })

// module.exports = pool

const {MongoClient} = require('mongodb')
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
// const dbName = 'sell';

module.exports = client