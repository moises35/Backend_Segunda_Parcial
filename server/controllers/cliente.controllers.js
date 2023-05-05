const { Cliente } = require('./../models/cliente.model');

const create = (req, res) => {
    const cliente = {
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        apellido: req.body.apellido
    };

    Cliente.create(cliente)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send({
                message:
                    error.message || "Ha ocurrido un error al crear el cliente."
            });
        });
};

const findAll = (req, res) => {
    Cliente.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send({
                message:
                    error.message || "Ha ocurrido un error al recuperar los clientes."
            });
        });
};

module.exports = { create, findAll };