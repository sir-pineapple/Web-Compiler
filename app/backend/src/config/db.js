const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "Web-Compiler",
    port: 5432
});

module.exports = pool;