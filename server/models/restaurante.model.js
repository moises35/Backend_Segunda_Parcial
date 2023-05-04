const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');

const Restaurante = sequelize.define('restaurante', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = {
    Restaurante
};
