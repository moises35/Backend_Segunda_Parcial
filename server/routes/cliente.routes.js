const express = require('express');
const router = express.Router();
const clienteController = require('./../controllers/cliente.controllers');

router.post('/', clienteController.create);
router.get('/:cedula', clienteController.findByCedula);
router.get('/', clienteController.findAll);

module.exports = router;