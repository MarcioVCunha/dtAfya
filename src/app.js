import cors from 'cors';
import express from 'express';
import {
    getPacientes, postPacientes, putPacientes,
    getConsultas, postConsultas, putConsultas, deleteConsultas,
    getObservacoes, postObservacoes, putObservacoes
} from './controller/controller.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/pacientes', getPacientes)
app.get('/pacientes/:pacienteId/consultas', getConsultas)
app.get('/observacoes/:consultaId', getObservacoes)

app.post('/pacientes', postPacientes)
app.post('/pacientes/:pacienteId/consultas', postConsultas)
app.post('/observacoes/:consultaId', postObservacoes)

app.put('/pacientes/:id', putPacientes)
app.put('/pacientes/:pacienteId/consultas/:consultaId', putConsultas)
app.put('/observacoes/:id', putObservacoes)

app.delete('/pacientes/consultas/:consultaId', deleteConsultas)

export default app;