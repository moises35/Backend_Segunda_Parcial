import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const MapaMesa = ({ coordenada, otrasCoordenadas }) => {
    const data = [{ x: coordenada.x, y: coordenada.y }];

    const otrasCoordenadasData = otrasCoordenadas.map(coordenada => ({
        x: coordenada.posicion_x,
        y: coordenada.posicion_y,
    }));

    return (
        <ScatterChart width={400} height={300} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X" />
            <YAxis type="number" dataKey="y" name="Y" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="red" />
            <Scatter data={otrasCoordenadasData} fill="blue" />
        </ScatterChart>
    );
};

export default MapaMesa;
