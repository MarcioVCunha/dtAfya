import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('PUT /pacientes/consultas/observacoes/:observacaoId', () => {
    let pacienteId;
    let consultaId;
    let observacaoId;

    beforeAll(async () => {
        const { data: paciente } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente Obs PUT',
                telefone: 11999999989,
                email: 'obs@put.com',
                data_nascimento: '1990-01-01',
                sexo: 'M',
                altura: 1.80,
                peso: 80
            }])
            .select()
            .single();

        pacienteId = paciente.id;

        const { data: consulta } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-13'
            }])
            .select()
            .single();

        consultaId = consulta.id;

        const { data: observacao } = await supabase
            .from('observacoes')
            .insert([{
                consulta_id: consultaId,
                observacao: 'Observação antiga'
            }])
            .select()
            .single();

        observacaoId = observacao.id;
    });

    afterAll(async () => {
        await supabase.from('observacoes').delete().eq('id', observacaoId);
        await supabase.from('consultas').delete().eq('id', consultaId);
        await supabase.from('pacientes').delete().eq('id', pacienteId);
    });

    it('deve atualizar uma observação com sucesso', async () => {
        const res = await request(app)
            .put(`/pacientes/consultas/observacoes/${observacaoId}`)
            .send({
                observacao: 'Observação atualizada'
            });

        expect(res.status).toBe(200);
        expect(res.body.observacao.observacao).toBe('Observação atualizada');
    });

    it('deve retornar 404 se a observação não existir', async () => {
        const res = await request(app)
            .put('/pacientes/consultas/observacoes/9999999999')
            .send({
                observacao: 'Teste'
            });

        expect(res.status).toBe(404);
    });

    it('deve retornar 400 se a observacao_id não for valido', async () => {
        const res = await request(app)
            .put('/pacientes/consultas/observacoes/id')
            .send({
                observacao: 'Teste'
            });

        expect(res.status).toBe(400);
    });

    
});
