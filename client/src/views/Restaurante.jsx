import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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


const Restaurante = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [restaurantes, setRestaurantes] = useState([]);
    const [action, setAction] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurante`)
            .then(response => setRestaurantes(response.data))
            .catch(error => console.log(error));
    }, [action]);

    const handleSubmit = event => {
        event.preventDefault();

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/restaurante`, { nombre, direccion })
            .then(response => {
                setAction(!action);
                setNombre('');
                setDireccion('');
            })
            .catch(error => console.log(error));
    };

    const handleEdit = restaurante => {
        const nombre = prompt('Ingrese el nuevo nombre', restaurante.nombre);
        const direccion = prompt('Ingrese la nueva dirección', restaurante.direccion);

        axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/restaurante/${restaurante.id}`, { nombre, direccion })
            .then(response => {
                const index = restaurantes.findIndex(r => r.id === restaurante.id);
                const newRestaurantes = [...restaurantes];
                newRestaurantes[index] = response.data;
                setAction(!action);
            })
            .catch(error => console.log(error));
    };

    const handleDelete = restaurante => {
        if (window.confirm(`¿Está seguro que desea eliminar el restaurante ${restaurante.nombre}?`)) {
            axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/restaurante/${restaurante.id}`)
                .then(() => {
                    setAction(!action);
                })
                .catch(error => console.log(error));
        }
    };

    return (
        <Container>
            <h2>Restaurante</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    id="nombre" 
                    placeholder='Nombre'
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                />

                <input 
                    type="text" 
                    id="direccion" 
                    placeholder='Dirección'
                    value={direccion} 
                    onChange={e => setDireccion(e.target.value)} 
                    required
                />

                <button type="submit">Agregar</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurantes.map(restaurante => (
                        <tr key={restaurante.id}>
                            <td>{restaurante.id}</td>
                            <td>{restaurante.nombre}</td>
                            <td>{restaurante.direccion}</td>
                            <td>
                                <button className='update' onClick={() => handleEdit(restaurante)}>Editar</button>
                                <button className='delete' onClick={() => handleDelete(restaurante)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
};

export default Restaurante;