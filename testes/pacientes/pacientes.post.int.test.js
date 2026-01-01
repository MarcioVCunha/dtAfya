import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('POST /pacientes', () => {
    const pacienteValido = {
        nome: 'Paciente Teste',
        telefone: 11999999998,
        email: 'paciente@post.com',
        data_nascimento: '02/01/1990',
        sexo: 'M',
        altura: 1.75,
        peso: 75
    };

    let pacientesCriados = [];

    afterAll(async () => {
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

    it('não deve cadastrar paciente duplicado (email)', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ ...pacienteValido, telefone: 11999999997 });

        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/email/i);
    });

    it('não deve cadastrar paciente duplicado (telefone)', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ ...pacienteValido, email: 'paciente@post2.com', });

        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/email/i);
    });

    it('deve retornar 400 se body for inválido', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send(null);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/body/i);
    });

    it('deve retornar 400 se nome for inválido', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ ...pacienteValido, nome: 123 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Nome inválido');
    });

    it('deve retornar 400 se altura for inválida', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ ...pacienteValido, altura: '1.75' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Altura inválida');
    });

    it('deve retornar 400 se peso for inválido', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ ...pacienteValido, peso: '75' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Peso inválido');
    });

    it('deve retornar 400 se faltar campo obrigatório', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({ nome: 'Só nome' });

        expect(res.status).toBe(400);
    });

    it('deve retornar 400 para email inválido', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({
                ...pacienteValido,
                email: 'email-invalido'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });

    it('deve retornar 400 para sexo inválido', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({
                ...pacienteValido,
                sexo: 'X'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/sexo/i);
    });

    it('deve retornar 400 para telefone não inteiro', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({
                ...pacienteValido,
                telefone: 123
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/telefone/i);
    });

    
    it('deve retornar 400 para data inválida', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({
                ...pacienteValido,
                data_nascimento: 'data-invalida'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/data/i);
    });

    it('deve retornar 400 para data não existente', async () => {
        const res = await request(app)
            .post('/pacientes')
            .send({
                ...pacienteValido,
                data_nascimento: '30/02/2025'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/data/i);
    });
});
