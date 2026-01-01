import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('PUT /pacientes/:id', () => {
    const pacienteValido = {
        nome: 'Paciente Teste',
        telefone: 11999999996,
        email: 'paciente@put.com',
        data_nascimento: '02/01/1990',
        sexo: 'M',
        altura: 1.75,
        peso: 75
    };

    let pacientesCriados = [];
    let pacienteId = ''

    beforeAll(async () => {
        const { data } = await supabase
            .from('pacientes')
            .insert([pacienteValido])
            .select();

        pacienteId = data[0].id;
        pacientesCriados.push(pacienteId);
    })

    afterAll(async () => {
        if (pacientesCriados.length > 0) {
            await supabase
                .from('pacientes')
                .delete()
                .in('id', pacientesCriados);

            pacientesCriados = [];
        }
    });

    it('deve atualizar paciente com sucesso', async () => {
        const atualizado = { ...pacienteValido, nome: 'Nome Atualizado' };

        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send(atualizado);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Paciente atualizado com sucesso');
        expect(res.body.paciente.nome).toBe('Nome Atualizado');
    });

    it('deve retornar 404 se paciente não existir', async () => {
        const res = await request(app)
            .put('/pacientes/999999')
            .send(pacienteValido);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Paciente não encontrado');
    });

    it('deve retornar 400 se body for inválido', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send(null);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/body/i);
    });

    it('deve retornar 400 se nome for inválido', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({ ...pacienteValido, nome: 123 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Nome inválido');
    });

    it('deve retornar 400 se altura for inválida', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({ ...pacienteValido, altura: '1.75' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Altura inválida');
    });

    it('deve retornar 400 se peso for inválido', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({ ...pacienteValido, peso: '75' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Peso inválido');
    });

    it('deve retornar 400 se data_nascimento for inválida', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({ ...pacienteValido, data_nascimento: 'data_invalida' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Data de nascimento inválida');
    });

    it('deve retornar 400 para email inválido', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({
                ...pacienteValido,
                email: 'email-invalido'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });

    it('deve retornar 400 para sexo inválido', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({
                ...pacienteValido,
                sexo: 'X'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/sexo/i);
    });

    it('deve retornar 400 para telefone não inteiro', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({
                ...pacienteValido,
                telefone: '11999'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/telefone/i);
    });

    it('deve retornar 400 para data de nascimento inválida', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send({
                ...pacienteValido,
                data_nascimento: 'data-invalida'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/data/i);
    });

});
