const express = require('express');
const router = express.Router();
const mesa_controller = require('./../controllers/mesa.controllers');

// Rutas
router.get('/', mesa_controller.findAll);
router.get('/:id', mesa_controller.findById);
router.post('/', mesa_controller.create);
router.put('/:id', mesa_controller.update);
router.delete('/:id', mesa_controller.eliminar);
router.get('/:idRestaurante/:planta' , mesa_controller.findCoordenada);

module.exports = router;
