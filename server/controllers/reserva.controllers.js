const { Cliente } = require('./../models/cliente.model');
const { Restaurante } = require('./../models/restaurante.model');
const { Mesa } = require('./../models/mesa.model');
const { Reserva } = require('./../models/reserva.model');


// api/reservas
const crearReserva = (req, res) => {
    const { fecha, hora_inicio, hora_fin, cantidad_solicitada, id_mesa, id_cliente } = req.body;

    // Buscar la mesa por id
    Mesa.findByPk(id_mesa)
        .then(mesa => {
            // Verificar si la mesa existe y si está disponible
            if (!mesa) {
                return res.status(404).json({ error: 'Mesa no encontrada' });
            } else if (!mesa.disponible) {
                return res.status(400).json({ error: 'La mesa no está disponible para reservar' });
            }

            // Buscar el cliente por id
            Cliente.findByPk(id_cliente)
                .then(cliente => {
                    // Si no existe el cliente, crearlo
                    if (!cliente) {
                        const { nombre, apellido, cedula } = req.body;
                        Cliente.create({ nombre, apellido, cedula })
                            .then(clienteCreado => {
                                // Crear la reserva
                                Reserva.create({ fecha, hora_inicio, hora_fin, cantidad_solicitada, id_mesa, id_cliente: clienteCreado.id })
                                    .then(reservaCreada => {
                                        // Actualizar la disponibilidad de la mesa
                                        mesa.update({ disponible: false })
                                            .then(() => {
                                                res.status(201).json(reservaCreada);
                                            })
                                            .catch(error => {
                                                console.error(error);
                                                res.status(500).json({ error: 'Error al actualizar la mesa' });
                                            });
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        res.status(500).json({ error: 'Error al crear la reserva' });
                                    });
                            })
                            .catch(error => {
                                console.error(error);
                                res.status(500).json({ error: 'Error al crear el cliente' });
                            });
                    } else {
                        // Crear la reserva
                        Reserva.create({ fecha, hora_inicio, hora_fin, cantidad_solicitada, id_mesa, id_cliente })
                            .then(reservaCreada => {
                                // Actualizar la disponibilidad de la mesa
                                mesa.update({ disponible: false })
                                    .then(() => {
                                        res.status(201).json(reservaCreada);
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        res.status(500).json({ error: 'Error al actualizar la mesa' });
                                    });
                            })
                            .catch(error => {
                                console.error(error);
                                res.status(500).json({ error: 'Error al crear la reserva' });
                            });
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Error al buscar el cliente' });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar la mesa' });
        });
};

// api/reservas
const obtenerReservas = (req, res) => {
    Reserva.findAll()
        .then(reservas => {
            res.status(200).json(reservas);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las reservas' });
        });
};

// api/reservas/:idRestaurante/:fecha/:horaInicio/:horaFin
const listarMesasDisponibles = (req, res) => {
    const idRestaurante = req.params.idRestaurante;
    const fecha = req.params.fecha; // YYYY-MM-DD
    const horaInicio = req.params.horaInicio;
    const horaFin = req.params.horaFin;

    Reserva.findAll({
        where: {
            id_restaurante: idRestaurante,
            fecha: fecha,
            hora_inicio: {
                [Op.lt]: horaFin
            },
            hora_fin: {
                [Op.gt]: horaInicio
            }
        }
    }).then(reservas => {
        // Obtener las mesas ocupadas en el rango de hora especificado
        const mesasOcupadas = reservas.map(reserva => reserva.id_mesa);

        // Obtener todas las mesas del restaurante
        Mesa.findAll({
            where: {
                id_restaurante: idRestaurante
            }
        }).then(mesas => {
            // Obtener las mesas disponibles
            const mesasDisponibles = mesas.filter(mesa => !mesasOcupadas.includes(mesa.id));

            // Crear la lista de mesas con sus respectivas capacidades
            const listaMesas = mesasDisponibles.map(mesa => {
                return {
                    id: mesa.id,
                    capacidad: mesa.capacidad
                };
            });

            res.status(200).json(listaMesas);
        }).catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las mesas del restaurante' });
        });
    }).catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las reservas del restaurante' });
    });
};

module.exports = {
    crearReserva,
    obtenerReservas,
    listarMesasDisponibles
};