import cors from 'cors';
import express from 'express';
import {
    getPacientes, postPacientes, putPacientes,
    getConsultas, postConsultas, putConsultas, deleteConsultas
} from './controller/controller.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/pacientes', getPacientes)
app.get('/consultas', getConsultas)

app.post('/pacientes', postPacientes)
app.post('/consultas', postConsultas)

app.put('/pacientes/:id', putPacientes)
app.put('/consultas/:id', putConsultas)

app.delete('/consultas/:id', deleteConsultas)

export default app;