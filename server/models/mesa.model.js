const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');
const { Restaurante } = require('./restaurante.model')

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

// Establecer relación entre mesa y restaurante, un restaurante tiene muchas mesas
Mesa.belongsTo(Restaurante, { foreignKey: 'id_restaurante' });

module.exports = { Mesa };
