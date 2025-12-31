import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('POST /consultas/:consultaId/observacoes', () => {
    let pacienteId;
    let consultaId;
    let observacaoId;

    beforeAll(async () => {
        const { data: paciente } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente Obs POST',
                telefone: 11999999990,
                email: 'obs@post.com',
                data_nascimento: '1990-01-01',
                sexo: 'M',
                altura: 1.70,
                peso: 70
            }])
            .select()
            .single();

        pacienteId = paciente.id;

        const { data: consulta } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-11'
            }])
            .select()
            .single();

        consultaId = consulta.id;
    });

    it('deve criar uma observação com sucesso', async () => {
        const res = await request(app)
            .post(`/observacoes/${consultaId}`)
            .send({
                observacao: 'Paciente relata dor de cabeça'
            });

        expect(res.status).toBe(201);
        expect(res.body.observacao.observacao).toBeTruthy();

        observacaoId = res.body.observacao.id;
    });

    afterAll(async () => {
        if (observacaoId) {
            await supabase.from('observacoes').delete().eq('id', observacaoId);
        }
        if (consultaId) {
            await supabase.from('consultas').delete().eq('id', consultaId);
        }
        if (pacienteId) {
            await supabase.from('pacientes').delete().eq('id', pacienteId);
        }
    });
});
