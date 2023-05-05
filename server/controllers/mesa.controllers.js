const Mesa = require('./../models/mesa.model');

// api/mesa
const findAll = (req, res) => {
    Mesa.findAll()
        .then(mesas => {
            res.status(200).json(mesas);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las mesas' });
        });
};

// api/mesa/:id
const findById = (req, res) => {
    const { id } = req.params;
    Mesa.findByPk(id)
        .then(mesa => {
            if (mesa) {
                res.status(200).json(mesa);
            } else {
                res.status(404).json({ error: 'Mesa no encontrada' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la mesa' });
        });
};

// api/mesa
const create = (req, res) => {
    const { nombre, restauranteId, x, y, planta, capacidad } = req.body;
    Mesa.create({ nombre, restauranteId, x, y, planta, capacidad })
        .then(mesa => {
            res.status(201).json(mesa);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la mesa' });
        });
};

// api/mesa/:id
const update = (req, res) => {
    const { id } = req.params;
    const { nombre, restauranteId, x, y, planta, capacidad } = req.body;
    Mesa.findByPk(id)
        .then(mesa => {
            if (mesa) {
                mesa.nombre = nombre;
                mesa.restauranteId = restauranteId;
                mesa.x = x;
                mesa.y = y;
                mesa.planta = planta;
                mesa.capacidad = capacidad;
                return mesa.save();
            } else {
                res.status(404).json({ error: 'Mesa no encontrada' });
            }
        })
        .then(mesaActualizada => {
            res.status(200).json(mesaActualizada);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la mesa' });
        });
};

// api/mesa/:id
const eliminar = (req, res) => {
    const { id } = req.params;
    Mesa.findByPk(id)
        .then(mesa => {
            if (mesa) {
                return mesa.destroy();
            } else {
                res.status(404).json({ error: 'Mesa no encontrada' });
            }
        })
        .then(() => {
            res.status(204).json();
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la mesa' });
        });
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    eliminar
};
