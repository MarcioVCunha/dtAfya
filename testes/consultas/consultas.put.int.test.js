import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('PUT /consultas/:id', () => {
    let pacienteId;
    let consultaId;

    beforeAll(async () => {
        const { data: paciente, error: pacienteError } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente PUT Consulta',
                telefone: 11999999994,
                email: 'consultas@put.com',
                data_nascimento: '1990-01-01',
                sexo: 'M',
                altura: 1.80,
                peso: 80
            }])
            .select()
            .single();

        if (pacienteError) throw pacienteError;

        pacienteId = paciente.id;

        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-20'
            }])
            .select()
            .single();

        if (consultaError) throw consultaError;

        consultaId = consulta.id;
    });

    it('deve atualizar uma consulta com sucesso', async () => {
        const response = await request(app)
            .put(`/consultas/${consultaId}`)
            .send({
                paciente_id: pacienteId,
                data: '1999-12-30'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Consulta atualizada com sucesso');
        expect(response.body.consulta.data).toBe('1999-12-30');
        expect(response.body.message).toBe('Consulta atualizada com sucesso');
    });

    it('deve retornar 404 se a consulta não existir', async () => {
        const response = await request(app)
            .put('/consultas/999999')
            .send({
                paciente_id: pacienteId,
                data: '1999-12-30'
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Consulta não encontrada');
    });

    it('deve retornar 400 se body for inválido', async () => {
        const response = await request(app)
            .put(`/consultas/${consultaId}`)
            .send({
                paciente_id: pacienteId
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Campos obrigatórios não preenchidos');
    });

    it('deve retornar 400 se o ID for inválido', async () => {
        const response = await request(app)
            .put('/consultas/abc')
            .send({
                paciente_id: pacienteId,
                data: '1999-12-30'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('ID inválido');
    });

    afterAll(async () => {
        if (consultaId) {
            await supabase
                .from('consultas')
                .delete()
                .eq('id', consultaId);
        }

        if (pacienteId) {
            await supabase
                .from('pacientes')
                .delete()
                .eq('id', pacienteId);
        }
    });
});
