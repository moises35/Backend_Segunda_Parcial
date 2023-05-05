const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');

const Mesa = sequelize.define('Mesa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    restaurante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    posicion_x: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    posicion_y: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    planta: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = { Mesa };
