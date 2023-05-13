const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');
const { Restaurante } = require('./restaurante.model');
const { Mesa } = require('./mesa.model');
const { Cliente } = require('./cliente.model');

const Reserva = sequelize.define('Reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    cantidad_solicitada: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Establecer relación entre reserva y restaurante, una reserva pertenece a un restaurante
Reserva.belongsTo(Restaurante, { foreignKey: 'id_restaurante' });

// Establecer relación entre reserva y mesa, una reserva pertenece a una mesa
Reserva.belongsTo(Mesa, { foreignKey: 'id_mesa' });

// Establecer relación entre reserva y cliente, una reserva pertenece a un cliente
Reserva.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = { Reserva };
