import cors from 'cors';
import express from 'express';
import { getPacientes, postPacientes, putPacientes } from './controller/pacientesController.js'
import { postConsulta } from './controller/consultasController.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/pacientes', getPacientes)

app.post('/pacientes', postPacientes)
app.post('/consultas', postConsulta)

app.put('/pacientes/:id', putPacientes)

export default app;