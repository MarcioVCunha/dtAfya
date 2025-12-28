import cors from 'cors';
import express from 'express';
import cadastro from './controller/cadastroController.js'

const app = express();

app.use(cors());
app.use(express.json());

app.post('/cadastro', cadastro)

export default app;