const express = require('express')
require('dotenv').config()
const sequelize = require('./configs/sequelize.config');
const PORT = process.env.PORT || 3000
const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes


// Database connection and server start
sequelize.authenticate()
    .then(() => {
        console.log('💾 Conexión establecida con la base de datos.');
        app.listen(PORT, () => {
            console.log('✔ Servidor escuchando en el puerto 3000.');
        });
    })
    .catch(error => {
        console.error('Error al conectar con la base de datos:', error);
    });