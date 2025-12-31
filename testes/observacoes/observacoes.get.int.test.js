import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('GET /observacoes/:consultaId', () => {
    let pacienteId;
    let consultaId;
    let observacaoId;

    beforeAll(async () => {
        const { data: paciente } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente Obs GET',
                telefone: 11999999991,
                email: 'obs@get.com',
                data_nascimento: '1990-01-01',
                sexo: 'F',
                altura: 1.65,
                peso: 65
            }])
            .select()
            .single();

        pacienteId = paciente.id;

        const { data: consulta } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-12'
            }])
            .select()
            .single();

        consultaId = consulta.id;

        const { data: observacao } = await supabase
            .from('observacoes')
            .insert([{
                consulta_id: consultaId,
                observacao: 'Observação para GET'
            }])
            .select()
            .single();

        observacaoId = observacao.id;
    });

    it('deve retornar observações da consulta', async () => {
        const res = await request(app)
            .get(`/observacoes/${consultaId}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.observacoes)).toBe(true);
        expect(res.body.observacoes.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await supabase.from('observacoes').delete().eq('id', observacaoId);
        await supabase.from('consultas').delete().eq('id', consultaId);
        await supabase.from('pacientes').delete().eq('id', pacienteId);
    });
});
