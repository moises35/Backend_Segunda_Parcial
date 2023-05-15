const express = require('express');
const router = express.Router();
const reserva_controller = require('./../controllers/reserva.controllers');

// Rutas
router.get('/', reserva_controller.obtenerReservas);
router.get('/:idRestaurante/:fecha/:horas/', reserva_controller.listarMesasDisponibles);
router.post('/', reserva_controller.crearReserva);

module.exports = router;