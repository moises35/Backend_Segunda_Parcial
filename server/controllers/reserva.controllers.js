const { Cliente } = require('./../models/cliente.model');
const { Restaurante } = require('./../models/restaurante.model');
const { Mesa } = require('./../models/mesa.model');
const { Reserva } = require('./../models/reserva.model');
const { Op } = require('sequelize');

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

function sumarUnaHora(hora) {
    const horaDate = new Date(`2000-01-01T${hora}`);
    horaDate.setHours(horaDate.getHours() + 1);
    const horaFin = horaDate.toTimeString().slice(0, 8);
    return horaFin;
}

// api/reservas/:idRestaurante/:fecha/:horas
const listarMesasDisponibles = (req, res) => {
    const { idRestaurante, fecha, horas } = req.params;
    const horasArray = horas.split(",");
    const horasFormato = horasArray.map(horaInicio => {
        const horaFin = sumarUnaHora(horaInicio);
        return [horaInicio, horaFin];
    });
    console.log(horasFormato);
    Reserva.findAll({
        where: {
            id_restaurante: idRestaurante,
            fecha: fecha,
            [Op.or]: horasFormato.map(horas => ({
                hora_inicio: horas[0],
                hora_fin: horas[1],
            })),
        },
        attributes: ['id_mesa'],
    })
        .then(reservas => {
            const mesasReservadas = reservas.map(reserva => reserva.id_mesa);

            Mesa.findAll({
                where: {
                    id_restaurante: idRestaurante,
                    id: { [Op.notIn]: mesasReservadas },
                },
                attributes: ['id', 'capacidad', 'nombre'],
            })
                .then(mesas => {
                    const capacidades = mesas.map(mesa => ({
                        id_mesa: mesa.id,
                        capacidad: mesa.capacidad,
                        nombre: mesa.nombre
                    }));

                    res.status(200).json(capacidades);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Error al obtener las mesas' });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las reservas' });
        });
};


module.exports = {
    crearReserva,
    obtenerReservas,
    listarMesasDisponibles
};