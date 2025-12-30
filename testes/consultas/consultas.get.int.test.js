import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('GET /consultas', () => {
    let pacienteId;
    let consultaId;

    beforeAll(async () => {
        const { data: paciente, error: pacienteError } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente Teste',
                telefone: 11999999995,
                email: 'consulta@get.com',
                data_nascimento: '1990-01-01',
                sexo: 'M',
                altura: 1.75,
                peso: 75
            }])
            .select()
            .single();

        if (pacienteError) throw pacienteError;

        pacienteId = paciente.id;

        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-29'
            }])
            .select()
            .single();

        if (consultaError) throw consultaError;

        consultaId = consulta.id;
    });

    it('deve retornar consultas cadastradas', async () => {
        const res = await request(app).get('/consultas');

        expect(res.status).toBe(201);
        expect(Array.isArray(res.body.consultas)).toBe(true);
        expect(res.body.consultas.length).toBeGreaterThan(0);
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
