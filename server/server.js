const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./configs/sequelize.config');
const PORT = process.env.PORT || 8000;
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/restaurante', require('./routes/restaurante.routes'));
app.use('/api/mesa', require('./routes/mesa.routes'));
app.use('/api/cliente', require('./routes/cliente.routes'));
app.use('/api/reserva', require('./routes/reserva.routes'));


// Database connection and server start
sequelize.authenticate()
    .then(() => {
        console.log('💾 Conexión establecida con la base de datos.');
        // Sync database 
        sequelize.sync({ force: false })
            .then(() => {
                console.log('✔ Sincronización completada.');
                app.listen(PORT, () => {
                    // Start server
                    console.log(`🚀 Servidor escuchando en el puerto ${PORT}.`);
                });
            })
            .catch(error => {
                console.error('Error en la sincronización:', error);
            });
    })
    .catch(error => {
        console.error('Error al conectar con la base de datos:', error);
    });