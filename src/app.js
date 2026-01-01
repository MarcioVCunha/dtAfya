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
app.get('/pacientes/consultas/:consultaId/observacoes', getObservacoes)

app.post('/pacientes', postPacientes)
app.post('/pacientes/:pacienteId/consultas', postConsultas)
app.post('/pacientes/consultas/:consultaId/observacoes', postObservacoes)

app.put('/pacientes/:id', putPacientes)
app.put('/pacientes/:pacienteId/consultas/:consultaId', putConsultas)
app.put('/pacientes/consultas/observacoes/:observacaoId', putObservacoes)

app.delete('/pacientes/consultas/:consultaId', deleteConsultas)

export default app;