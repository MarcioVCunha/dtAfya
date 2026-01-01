import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('POST /consultas', () => {
    let pacienteId;
    let consultasCriadas = [];

    beforeAll(async () => {
        const { data, error } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente Consulta',
                telefone: 11999999994,
                email: 'consulta@post.com',
                data_nascimento: '1990-01-01',
                sexo: 'M',
                altura: 1.75,
                peso: 75
            }])
            .select();

        if (error) throw error;
        pacienteId = data[0].id;
    });

    afterAll(async () => {
        if (consultasCriadas.length > 0) {
            await supabase
                .from('consultas')
                .delete()
                .in('id', consultasCriadas);

            consultasCriadas = [];
        }

        await supabase
            .from('pacientes')
            .delete()
            .eq('id', pacienteId);
    });

    it('deve cadastrar consulta com sucesso', async () => {
        const res = await request(app)
            .post(`/pacientes/${pacienteId}/consultas`)
            .send({
                data: '01/10/2025'
            });

        expect(res.status).toBe(201);
        expect(res.body.consulta.data).toBe('2025-10-01');

        consultasCriadas.push(res.body.consulta.id);
    });

    it('deve retornar 400 se paciente_id não for inteiro', async () => {
        const res = await request(app)
            .post(`/pacientes/ID/consultas`)
            .send({
                data: '10/01/2025'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/id/i);
    });

    it('deve retornar 404 se paciente_id não existir no banco', async () => {
        const res = await request(app)
            .post(`/pacientes/999999/consultas`)
            .send({
                data: '10/01/2025'
            });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('ID não cadastrado no banco');
    });

    it('deve retornar 400 se data for inválida', async () => {
        const res = await request(app)
            .post(`/pacientes/${pacienteId}/consultas`)
            .send({
                data: 'data-invalida'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/data/i);
    });

    it('deve retornar 409 se consulta já existir na mesma data', async () => {
        const res = await request(app)
            .post(`/pacientes/${pacienteId}/consultas`)
            .send({
                data: '01/10/2025'
            });

        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/consulta/i);
    });
});
