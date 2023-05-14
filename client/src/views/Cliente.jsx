import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ClienteContainer = styled.div`
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
        }

        th {
            background-color: #f2f2f2;
            text-align: left;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #ddd;
        }
    }
`;

const Cliente = () => {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [clientes, setClientes] = useState([]);
    const [accion, setAccion] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cliente`)
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [accion]);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cliente`, {   
            cedula,
            nombre,
            apellido
        })
            .then((response) => {
                console.log(response);
                setCedula('');
                setNombre('');
                setApellido('');
                setAccion(!accion);
            })
            .catch((error) => {
                console.log(error);
            }
        );

    };


    return (
        <ClienteContainer>
            <h2>Clientes</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Cédula"
                    value={cedula}
                    onChange={(event) => setCedula(event.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(event) => setApellido(event.target.value)}
                    required
                />

                <button type="submit">Crear cliente</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.cedula}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </ClienteContainer>
    );
};

export default Cliente;
