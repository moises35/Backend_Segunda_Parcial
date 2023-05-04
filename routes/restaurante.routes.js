const express = require('express');
const router = express.Router();
const restaurante_controller = require('./../controllers/restaurante.controllers')

// Rutas
router.get('/', restaurante_controller.findAll);
router.get('/:id', restaurante_controller.findById);
router.post('/', restaurante_controller.create);
router.put('/:id', restaurante_controller.update);
router.delete('/:id', restaurante_controller.delete);

module.exports = router;