const db = require('mongoose');
const config = require('config');

db.connect(config.get("DB_PRODUCTION"))
    .then(() => console.log(`Connected to the ${config.get("DB_PRODUCTION")}...`))
    .catch((err) => console.log(err.message));