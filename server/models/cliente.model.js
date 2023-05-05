const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');

const Cliente = sequelize.define('cliente', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = { Cliente };
