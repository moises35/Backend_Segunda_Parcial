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

// api/cliente/:cedula
const findByCedula = (req, res) => {
    const { cedula } = req.params;
    Cliente.findOne({
        where: { cedula: cedula }
    })
        .then(cliente => {
            if (!cliente) {
                res.status(200).json({find: false});
            } else {
                res.status(200).json({find: true, cliente});
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el cliente' });
        });
};





module.exports = { create, findAll, findByCedula };