import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('GET pacieentes/idPaciente/consultas', () => {
    let pacienteId;
    let consultaId;

    beforeAll(async () => {
        const { data: paciente, error: pacienteError } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente Teste',
                telefone: 11999999995,
                email: 'consulta@get.com',
                data_nascimento: '01/01/1990',
                sexo: 'M',
                altura: 1.75,
                peso: 75
            }])
            .select();

        if (pacienteError) throw pacienteError;

        pacienteId = paciente[0].id;

        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-20'
            }])
            .select()

        if (consultaError) throw consultaError;

        consultaId = consulta[0].id;
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

    it('deve retornar consultas cadastradas', async () => {
        const res = await request(app).get(`/pacientes/${pacienteId}/consultas`);

        expect(res.status).toBe(201);
        expect(Array.isArray(res.body.consultas)).toBe(true);
        expect(res.body.consultas.length).toBeGreaterThan(0);
    });

    it('deve retornar 400 caso id invalido', async () => {
        const res = await request(app).get(`/pacientes/ID_INVALIDO/consultas`);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('ID inválido');
    });
});
