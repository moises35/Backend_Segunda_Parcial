const { Cliente } = require('./../models/cliente.model');
const { Restaurante } = require('./../models/restaurante.model');
const { Mesa } = require('./../models/mesa.model');
const { Reserva } = require('./../models/reserva.model');
const { Op } = require('sequelize');

// api/reservas
const crearReserva = (req, res) => {
    console.log(req.body);
    const { fecha, hora_inicio, hora_fin, cantidad_solicitada, id_mesa, id_cliente, id_restaurante } = req.body;

    // Buscar la mesa por id
    Mesa.findByPk(id_mesa)
        .then(mesa => {
            if (!mesa) {
                return res.status(404).json({ error: 'Mesa no encontrada' });
            }
            Cliente.findByPk(id_cliente)
                .then(cliente => {
                    if (!cliente) {
                        res.status(404).json({ error: 'Cliente no encontrado' });
                    } else {
                        // Crear la reserva
                        Reserva.create({ fecha, hora_inicio, hora_fin, cantidad_solicitada, id_mesa, id_cliente, id_restaurante })
                            .then(reservaCreada => {
                                res.status(201).json(reservaCreada);
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

    Reserva.findAll({
        where: {
            id_restaurante: idRestaurante,
            fecha: fecha,
            [Op.or]: horasFormato.map(horas => ({
                hora_inicio: horas[0],
                hora_fin: horas[1],
            })),
        },
        attributes: ['id_mesa', 'hora_inicio', 'hora_fin'],
    })
        .then(reservas => {
            console.log("Reservas: ")
            console.log(reservas);
            // const mesasReservadas = reservas.map(reserva => reserva.id_mesa);
            Mesa.findAll({
                where: {
                    id_restaurante: idRestaurante
                    // id: { [Op.notIn]: mesasReservadas },
                },
                attributes: ['id', 'capacidad', 'nombre'],
            })
                .then(mesas => {
                    // Crear un array de objetos que contenga los datos de las mesas combinados con cada horaFormato
                    const horasMesas = [];
                    mesas.forEach(mesa => {
                        horasFormato.forEach(horas => {
                            horasMesas.push({
                                id_mesa: mesa.id,
                                nombre_mesa: mesa.nombre,
                                capacidad_mesa: mesa.capacidad,
                                hora_inicio: horas[0],
                                hora_fin: horas[1],
                            });
                        });
                    });
                    console.log("Horas Mesas: ")
                    console.log(horasMesas);
                    const mesasDisponibles = horasMesas.filter(horaMesa => {
                        // Verificamos si la mesa no está reservada en ese horario
                        const mesaReservada = reservas.find(reserva => {
                            return reserva.id_mesa === horaMesa.id_mesa && reserva.hora_inicio === horaMesa.hora_inicio && reserva.hora_fin === horaMesa.hora_fin;
                        });

                        // Si la mesa no está reservada, la agregamos al array de mesas disponibles
                        if (!mesaReservada) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    console.log("Mesas Disponibles: ")
                    console.log(mesasDisponibles);
                    res.status(200).json(mesasDisponibles);
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