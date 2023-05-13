const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.SEQUELIZE_METHOD_CONNECTION !== "URL" ? 
    (process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    })
    : 
    process.env.DB_URL
    , {
        // Desactivar logs de sequelize en consola
        logging: false,
    }
);

module.exports = sequelize;