import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
import MapaMesa from "../components/MapaMesa";

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
                background-color: #1E90FF;
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

const ListReserva = () => {
    const [reservas, setReservas] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [coordenadas, setCoordenadas] = useState({});
    const [otrasCoordenadas, setOtrasCoordenadas] = useState({});
    const [filtroCampo, setFiltroCampo] = useState("");
    const [filtroValor, setFiltroValor] = useState("");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reserva`)
            .then((res) => {
                const reservas = res.data.sort((a, b) => {
                    if (a.hora_inicio === b.hora_inicio) {
                      return a.id_mesa - b.id_mesa;
                    }
                    return a.hora_inicio.localeCompare(b.hora_inicio);
                  });;
                setReservas(reservas);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleAbrirModal = (id_mesa) => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mesa/${id_mesa}`)
            .then((res) => {
                const coordenadadeMesaaPintar = { x: res.data.posicion_x, y: res.data.posicion_y };
                const { planta, id_restaurante } = res.data;
                axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mesa/${id_restaurante}/${planta}`)
                    .then((res) => {
                        const otrasCoordenadas = res.data; // [{posicion_x, posicion_y}, {posicion_x, posicion_y}, ...]
                        // De otrasCoordenadas eliminar la coordenada coordenadadeMesaaPintar
                        const otrasCoordenadasFiltradas = otrasCoordenadas.filter((coordenada) => {
                            return coordenada.posicion_x !== coordenadadeMesaaPintar.x && coordenada.posicion_y !== coordenadadeMesaaPintar.y;
                        });
                        setOtrasCoordenadas(otrasCoordenadasFiltradas);
                        setCoordenadas(coordenadadeMesaaPintar);
                        setModalIsOpen(true);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            }
            );
    };

    const handleCerrarModal = () => {
        setModalIsOpen(false);
    };

    const handleFiltrar = (e) => {
        e.preventDefault();

        // Filtrar las reservas según el campo y el valor especificados
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reserva`)
            .then((res) => {
                const filtradas = res.data.filter((reserva) => {
                    if (filtroCampo == "id_restaurante") {
                        return reserva.id_restaurante == filtroValor;
                    } else if (filtroCampo == "fecha") {
                        return reserva.fecha == filtroValor;
                    }
                    return true;
                });
                setReservas(filtradas);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Container>
            <h2>Lista de Reservas</h2>
            <form onSubmit={handleFiltrar}>
                <div className="inline-inputs">
                    <select
                        value={filtroCampo}
                        onChange={(e) => setFiltroCampo(e.target.value)}
                    >
                        <option value="">Seleccione un campo</option>
                        <option value="id_restaurante">ID Restaurante</option>
                        <option value="fecha">Fecha</option>
                    </select>
                    <input
                        type="text"
                        value={filtroValor}
                        onChange={(e) => setFiltroValor(e.target.value)}
                        placeholder="Ingrese el valor a filtrar"
                    />
                </div>
                <button type="submit">Filtrar</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Restaurante</th>
                        <th>Fecha</th>
                        <th>Horario</th>
                        <th>Mesa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>{reserva.id}</td>
                            <td>{reserva.id_cliente}</td>
                            <td>{reserva.id_restaurante}</td>
                            <td>{reserva.fecha}</td>
                            <td>{reserva.hora_inicio} a {reserva.hora_fin}</td>
                            <td>{reserva.id_mesa}</td>
                            <td>
                                <button onClick={() => handleAbrirModal(reserva.id_mesa)}>Ver ubicación</button>
                                <Modal isOpen={modalIsOpen} onRequestClose={handleCerrarModal}>
                                    <MapaMesa coordenada={coordenadas} otrasCoordenadas={otrasCoordenadas} />
                                </Modal>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}

export default ListReserva