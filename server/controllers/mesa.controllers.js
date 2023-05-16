const { Mesa } = require('./../models/mesa.model');
const { Restaurante } = require("./../models/restaurante.model")

// api/mesa
const findAll = (req, res) => {
    Mesa.findAll({
        include: Restaurante,
    })
        .then((mesas) => {
            res.status(200).json(mesas);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las mesas' });
        });
};

// api/mesa/:id
const findById = (req, res) => {
    const { id } = req.params;
    Mesa.findByPk(id, { include: Restaurante })
        .then((mesa) => {
            if (!mesa) {
                res.status(404).json({ message: `No se encontró la mesa con id ${id}` });
            } else {
                res.status(200).json(mesa);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la mesa' });
        });
};

// api/mesa/:idRestaurante/:planta
const findCoordenada = (req, res) => {
    const { idRestaurante, planta } = req.params;
    Mesa.findAll({
        where: {
            id_restaurante: idRestaurante,
            planta: planta
        },
        attributes: ['posicion_x', 'posicion_y']
    })
        .then((mesas) => {
            if (!mesas) {
                res.status(404).json({ message: `No se encontró la mesa con id ${id}` });
            } else {
                res.status(200).json(mesas);
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener la mesa' });
        });
};

// api/mesa
const create = (req, res) => {
    const { nombre, posicion_x, posicion_y, planta, capacidad, id_restaurante } = req.body;
    Mesa.create({
        nombre,
        posicion_x,
        posicion_y,
        planta,
        capacidad,
        id_restaurante,
    })
        .then((mesa) => {
            res.status(201).json(mesa);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la mesa' });
        });
};

// api/mesa/:id
const update = (req, res) => {
    const { id } = req.params;
    const { nombre, posicion_x, posicion_y, planta, capacidad, id_restaurante } = req.body;
    Mesa.update(
        { nombre, posicion_x, posicion_y, planta, capacidad, id_restaurante },
        { returning: true, where: { id } }
    )
        .then(([rowsUpdated, [mesa]]) => {
            if (!rowsUpdated) {
                res.status(404).json({ message: `No se encontró la mesa con id ${id}` });
            } else {
                res.status(200).json(mesa);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la mesa' });
        });
};

// api/mesa/:id
const eliminar = (req, res) => {
    const { id } = req.params;
    Mesa.destroy({ where: { id } })
        .then((rowsDeleted) => {
            if (!rowsDeleted) {
                res.status(404).json({ message: `No se encontró la mesa con id ${id}` });
            } else {
                res.status(204).json();
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la mesa' });
        });
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    eliminar,
    findCoordenada
};
