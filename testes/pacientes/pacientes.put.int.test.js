import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('PUT /pacientes/:id', () => {
    const pacienteValido = {
        nome: 'Paciente Teste',
        telefone: 11999999997,
        email: 'paciente@put.com',
        data_nascimento: '1990-01-01',
        sexo: 'M',
        altura: 1.75,
        peso: 75
    };

    let pacienteId;
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

    it('deve atualizar paciente com sucesso', async () => {
        const { data } = await supabase.from('pacientes').insert([pacienteValido]).select();

        pacienteId = data[0].id;
        pacientesCriados.push(pacienteId);

        const atualizado = { ...pacienteValido, nome: 'Nome Atualizado' };
        const res = await request(app)
            .put(`/pacientes/${pacienteId}`)
            .send(atualizado);

        expect(res.status).toBe(200);
        expect(res.body.paciente.nome).toBe('Nome Atualizado');
    });

    it('retorna 404 se paciente não existir', async () => {
        const res = await request(app)
            .put('/pacientes/999999')
            .send(pacienteValido);

        expect(res.status).toBe(404);
    });

    it('retorna 400 se body inválido', async () => {
        const { data } = await supabase
            .from('pacientes')
            .insert([pacienteValido]).select();

        pacienteId = data[0].id;
        pacientesCriados.push(pacienteId);

        const res = await request(app).put(`/pacientes/${pacienteId}`).send({ nome: 'Apenas nome' });
        expect(res.status).toBe(400);
    });
});
