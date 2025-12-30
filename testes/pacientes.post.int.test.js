import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import supabase from '../src/database/database.js';

describe('POST /pacientes', () => {
    const pacienteValido = {
        nome: 'Paciente Teste',
        telefone: 11999999998,
        email: 'teste@post.com',
        data_nascimento: '1990-01-01',
        sexo: 'M',
        altura: 1.75,
        peso: 75
    };

    let pacientesCriados = [];

    afterEach(async () => {
        if (pacientesCriados.length > 0) {
            await supabase
                .from('pacientes')
                .delete()
                .in('id', pacientesCriados);
            
            pacientesCriados = [];
        }
    });

    it('deve cadastrar paciente com sucesso', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send(pacienteValido);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('paciente');
        pacientesCriados.push(res.body.paciente.id);
    });

    it('não deve cadastrar paciente duplicado', async () => {
        const res1 = await request(app)
            .post('/pacientes')
            .send(pacienteValido);
        
        pacientesCriados.push(res1.body.paciente.id);

        const res2 = await request(app)
            .post('/pacientes')
            .send({ ...pacienteValido, telefone: 11888888888 });

        expect(res2.status).toBe(409);
        expect(res2.body.error).toMatch(/email/i);
    });

    it('deve retornar 400 se faltar campo obrigatório', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ nome: 'Só nome' });
        
        expect(res.status).toBe(400);
    });
});
