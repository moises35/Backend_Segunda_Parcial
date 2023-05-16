import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem;


    h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;

        input {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 5px;
            border: none;
            box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
            width: 20rem;
        }

        select {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 5px;
            border: none;
            box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
            width: 20rem;
            font-size: 1rem;
        }

        .inline-inputs {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            justify-content: space-between;
            width: 20rem;
            gap: 12px;
            input {
                width: 48%;
            }
        }

        button {
            padding: 0.5rem 1rem;
            border-radius: 5px;
            border: none;
            background-color: #1E90FF;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
    }

    table {
        border-collapse: collapse;
        margin-top: 2rem;
        
        th, td {
            padding: 0.5rem;
            border: 1px solid #ccc;

            button {
                padding: 0.5rem 1rem;
                border-radius: 5px;
                border: none;
                color: white;
                font-weight: bold;

                &:hover {
                    cursor: pointer;
                    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
                    opacity: 0.9;
                }

                &.update {
                    background-color: #008000;
                    margin-right: 1rem;
                }

                &.delete {
                    background-color: #FF0000;
                }

            }
        }

        th {
            background-color: #f2f2f2;
            text-align: center;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #ddd;
        }
    }
`;

const Reserva = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState("");
    const [fecha, setFecha] = useState("");
    const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
    const [mesasDisponibles, setMesasDisponibles] = useState([]);
    const [editarDisponibleInput, setEditarDisponibleInput] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurante`)
            .then(response => {
                setRestaurantes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleHorasSeleccionadas = (e) => {
        const options = e.target.options;
        const values = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setHorasSeleccionadas(values);
    }

    const handleSearchMesas = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reserva/${restauranteSeleccionado}/${fecha}/${horasSeleccionadas}`)
            .then(response => {
                setMesasDisponibles(response.data);
                setEditarDisponibleInput(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleReservar = (reserva) => {
        console.log(reserva);
        const cedula_cliente = prompt("Ingrese su numero de cedula: ");
        // Verificar si el cliente existe en la base de datos
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cliente/${cedula_cliente}`)
            .then(response => {
                if (response.data.find) {
                    console.log("El cliente existe");
                    const dataReserva = {
                        fecha,
                        hora_inicio: reserva.hora_inicio,
                        hora_fin: reserva.hora_fin,
                        cantidad_solicitada: reserva.capacidad_mesa,
                        id_mesa: reserva.id_mesa,
                        id_cliente: response.data.cliente.id,
                        id_restaurante: restauranteSeleccionado
                    }
                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/reserva`, dataReserva)
                        .then(response => {
                            console.log('Reserva creada: ')
                            console.log(response.data);
                            alert("Reserva creada con exito");
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    const nombre = prompt("Ingrese su nombre: ");
                    const apellido = prompt("Ingrese su apellido: ");
                    if (nombre !== "" && apellido !== "") {
                        const data = {
                            cedula: cedula_cliente,
                            nombre,
                            apellido
                        }
                        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cliente`, data)
                            .then(response => {
                                console.log(response.data);
                                // Crear la reserva fecha, hora_inicio, hora_fin, cantidad_solicitada, id_mesa, id_cliente
                                const dataReserva = {
                                    fecha,
                                    hora_inicio: reserva.hora_inicio,
                                    hora_fin: reserva.hora_fin,
                                    cantidad_solicitada: reserva.capacidad_mesa,
                                    id_mesa: reserva.id_mesa,
                                    id_cliente: response.data.id,
                                    id_restaurante: restauranteSeleccionado
                                }
                                axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/reserva`, dataReserva)
                                    .then(response => {
                                        console.log('Reserva creada: ')
                                        console.log(response.data);
                                        alert("Reserva creada con exito");
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <Container>
            <h2>Reservas</h2>
            <form onSubmit={handleSubmit}>
                <select value={restauranteSeleccionado} onChange={e => setRestauranteSeleccionado(e.target.value)} required disabled={editarDisponibleInput}  >
                    <option value="">Seleccione un restaurante</option>
                    {restaurantes.map(restaurante => (
                        <option key={restaurante.id} value={restaurante.id}>ID: {restaurante.id} - {restaurante.nombre} - {restaurante.direccion}</option>
                    ))}
                </select>
                <div className="inline-inputs">
                    <label htmlFor="">Fecha de reserva: </label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={e => setFecha(e.target.value)}
                        required
                        disabled={editarDisponibleInput}
                    />

                </div>
                <div className="inline-inputs">
                    <label htmlFor="">Hora de reserva: </label>
                    <select multiple={true} value={horasSeleccionadas} onChange={handleHorasSeleccionadas} required disabled={editarDisponibleInput}  >
                        <option value="12:00:00">12:00 - 13:00</option>
                        <option value="13:00:00">13:00 - 14:00</option>
                        <option value="14:00:00">14:00 - 15:00</option>
                        <option value="19:00:00">19:00 - 20:00</option>
                        <option value="20:00:00">20:00 - 21:00</option>
                        <option value="21:00:00">21:00 - 22:00</option>
                        <option value="22:00:00">22:00 - 23:00</option>
                    </select>
                </div>
                {editarDisponibleInput ?
                    <>
                        <button onClick={() => setEditarDisponibleInput(false)} style={{ backgroundColor: "#FF0000", marginTop: "12px" }}>Editar datos de busqueda</button>
                        {mesasDisponibles.length > 0 ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo de mesa</th>
                                        <th>Capacidad</th>
                                        <th>Horario</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mesasDisponibles.map(reserva => (
                                        <tr key={reserva.id_mesa}>
                                            <td>{reserva.id_mesa}</td>
                                            <td>{reserva.nombre_mesa}</td>
                                            <td>{reserva.capacidad_mesa}</td>
                                            <td>{reserva.hora_inicio} a {reserva.hora_fin}</td>
                                            <td>
                                                <button onClick={() => handleReservar(reserva)}>Reservar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            :
                            <p>No hay mesas disponibles</p>
                        }
                    </>
                    :
                    <button onClick={handleSearchMesas}>Buscar</button>
                }
            </form>
        </Container>
    )
}

export default Reserva