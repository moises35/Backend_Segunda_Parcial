const { Restaurante } = require('./../models/restaurante.model')

// GET /api/restaurante
const findAll = (req, res) => {
    Restaurante.findAll()
        .then(restaurantes => {
            res.json(restaurantes);
        })
        .catch(error => {
            console.error('Error al obtener los restaurantes:', error);
            res.status(500).json({ error: 'Error al obtener los restaurantes.' });
        });
}

// GET /api/restaurante/:id
const findById = (req, res) => {
    const id = req.params.id;

    Restaurante.findByPk(id)
        .then(restaurante => {
            if (!restaurante) {
                return res.status(404).json({ error: 'Restaurante no encontrado.' });
            }
            res.json(restaurante);
        })
        .catch(error => {
            console.error(`Error al obtener el restaurante con id ${id}:`, error);
            res.status(500).json({ error: `Error al obtener el restaurante con id ${id}.` });
        });
}

// POST /api/restaurante
const create = (req, res) => {
    const { nombre, direccion } = req.body;

    Restaurante.create({ nombre, direccion })
        .then(restaurante => {
            res.status(201).json(restaurante);
        })
        .catch(error => {
            console.error('Error al crear el restaurante:', error);
            res.status(500).json({ error: 'Error al crear el restaurante.' });
        });
}

// PUT /api/restaurante/:id
const update = (req, res) => {
    const id = req.params.id;
    const { nombre, direccion } = req.body;

    Restaurante.update({ nombre, direccion }, { where: { id } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Restaurante no encontrado.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al actualizar el restaurante con id ${id}:`, error);
            res.status(500).json({ error: `Error al actualizar el restaurante con id ${id}.` });
        });
}

// DELETE /api/restaurante/:id
const deleteById = (req, res) => {
    const id = req.params.id;

    Restaurante.destroy({ where: { id } })
        .then(result => {
            if (result === 0) {
                return res.status(404).json({ error: 'Restaurante no encontrado.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al eliminar el restaurante con id ${id}:`, error);
            res.status(500).json({ error: `Error al eliminar el restaurante con id ${id}.` });
        });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: deleteById,
};
