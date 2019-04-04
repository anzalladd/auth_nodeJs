const monk = require('monk');
const db = monk('localhost:27017/auth-forNoobs');


module.exports = db;