import axios from "axios"
import styled from "styled-components"
import { useEffect, useState } from "react"

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
            align-items: center;
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

const Mesa = () => {
    const [mesas, setMesas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [posicionX, setPosicionX] = useState();
    const [posicionY, setPosicionY] = useState();
    const [planta, setPlanta] = useState();
    const [capacidad, setCapacidad] = useState();
    const [idRestaurante, setIdRestaurante] = useState('');
    const [restaurantes, setRestaurantes] = useState([]);
    const [action, setAction] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurante`)
            .then((response) => {
                setRestaurantes(response.data)
            })
            .catch((error) => {
                console.log(error)
            })

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mesa`)
            .then((response) => {
                setMesas(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [action])


    const handleSubmit = event => {
        event.preventDefault();

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/mesa`, {
            nombre,
            posicion_x: posicionX,
            posicion_y: posicionY,
            planta,
            capacidad,
            id_restaurante: idRestaurante
        })
            .then((response) => {
                console.log(response);
                setAction(!action);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleUpdate = mesa => {
        const nombre = prompt("Ingrese el nuevo nombre", mesa.nombre);
        const posicion_x = prompt("Ingrese la nueva posición X", mesa.posicion_x);
        const posicion_y = prompt("Ingrese la nueva posición Y", mesa.posicion_y); 
        const planta = prompt("Ingrese la nueva planta", mesa.planta);
        const capacidad = prompt("Ingrese la nueva capacidad", mesa.capacidad);        
        const idResta = prompt("Ingrese el nuevo id del restaurante", mesa.id_restaurante);

        axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/mesa/${mesa.id}`, {
            nombre,
            posicion_x,
            posicion_y,
            planta,
            capacidad,
            id_restaurante: idResta
        })
            .then(() => {
                setAction(!action);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = mesaId => {
        if (window.confirm("¿Está seguro que desea eliminar esta mesa?")) {
            axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/mesa/${mesaId}`)
                .then(() => {
                    setAction(!action);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <Container>
            <h2>Mesa</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nombre" 
                    value={nombre}
                    onChange={event => setNombre(event.target.value)}
                    required
                />
                <div className="inline-inputs">
                    <input
                        type="number"
                        placeholder="Posición X"
                        value={posicionX}
                        onChange={event => setPosicionX(event.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Posición Y"
                        value={posicionY}
                        onChange={event => setPosicionY(event.target.value)}
                        required
                    />
                </div>

                <div className="inline-inputs">
                    <input
                        type="number"
                        placeholder="Planta"
                        value={planta}
                        onChange={event => setPlanta(event.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Capacidad"
                        value={capacidad}
                        onChange={event => setCapacidad(event.target.value)}
                        required
                    />
                </div>

                <select value={idRestaurante} onChange={event => setIdRestaurante(event.target.value)} required >
                    <option value="">Seleccione un restaurante</option>
                    {restaurantes.map(restaurante => (
                        <option key={restaurante.id} value={restaurante.id}>ID: {restaurante.id} - {restaurante.nombre} - {restaurante.direccion}</option>
                    ))}
                </select>
                        
                <button type="submit">Agregar</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Posición X;Y</th>
                        <th>Planta</th>
                        <th>Capacidad</th>
                        <th>Restaurante_ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mesas.map(mesa => (
                        <tr key={mesa.id}>
                            <td>{mesa.id}</td>
                            <td>{mesa.nombre}</td>
                            <td>{mesa.posicion_x};{mesa.posicion_y}</td>
                            <td>{mesa.planta}</td>
                            <td>{mesa.capacidad}</td>
                            <td>{mesa.id_restaurante}</td>
                            <td>
                                <button className='update' onClick={() => handleUpdate(mesa)}>Editar</button>
                                <button className='delete' onClick={() => handleDelete(mesa.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}

export default Mesa