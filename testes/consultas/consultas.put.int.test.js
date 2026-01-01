import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('PUT /pacientes/:pacientesId/consultas/:consultasId', () => {
    let pacienteId;
    let consultaId;

    beforeAll(async () => {
        const { data, error } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente PUT Consulta',
                telefone: 11999999993,
                email: 'consultas@put.com',
                data_nascimento: '1990-01-01',
                sexo: 'M',
                altura: 1.80,
                peso: 80
            }])
            .select();

        if (error) throw error;
        pacienteId = data[0].id;

        const { data: consulta, error: erroConsulta } = await supabase
            .from(`consultas`)
            .insert([{
                data: '10/01/1997',
            }])
            .select();

        if (erroConsulta) throw erroConsulta;
        consultaId = consulta[0].id;
    });

    afterAll(async () => {
        await supabase
            .from('consultas')
            .delete()
            .eq('id', consultaId);

        await supabase
            .from('pacientes')
            .delete()
            .eq('id', pacienteId);
    });

    it('deve atualizar a consulta com sucesso', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}/consultas/${consultaId}`)
            .send({
                data: '11/01/1997',
            });

        expect(res.status).toBe(200);
        expect(res.body.consulta.data).toBe('1997-01-11');
        expect(res.body.consulta.paciente_id).toBe(pacienteId);
    });

    it('deve retornar 400 se body estiver ausente ou inválido', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}/consultas/${consultaId}`)
            .send(null);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/body/i);
    });

    it('deve retornar 400 se paciente_id não for inteiro', async () => {
        const res = await request(app)
            .put(`/pacientes/abc/consultas/${consultaId}`)
            .send({
                data: '11/01/1977'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/id/i);
    });

    it('deve retornar 400 se paciente_id não for inteiro', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}/consultas/abc`)
            .send({
                data: '11/01/1977'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/id/i);
    });

    it('deve retornar 400 se data for inválida', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}/consultas/${consultaId}`)
            .send({
                data: 'data-invalida'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/data/i);
    });

    it('deve retornar 404 se consulta não existir', async () => {
        const res = await request(app)
            .put(`/pacientes/${pacienteId}/consultas/99999999`)
            .send({
                data: '11/01/1997'
            });

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/não encontrada/i);
    });
});