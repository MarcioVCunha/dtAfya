import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('DELETE /pacientes/consultas/:consultaId', () => {
    let pacienteId;
    let consultaId;

    beforeAll(async () => {
        const { data: paciente, error: pacienteError } = await supabase
            .from('pacientes')
            .insert([{
                nome: 'Paciente DELETE Consulta',
                telefone: 11999999992,
                email: 'consultas@delete.com',
                data_nascimento: '1990-01-01',
                sexo: 'F',
                altura: 1.65,
                peso: 65
            }])
            .select()
            .single();

        if (pacienteError) throw pacienteError;

        pacienteId = paciente.id;

        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert([{
                paciente_id: pacienteId,
                data: '1999-12-31'
            }])
            .select()
            .single();

        if (consultaError) throw consultaError;

        consultaId = consulta.id;
    });
    
    afterAll(async () => {
        if (pacienteId) {
            await supabase
                .from('pacientes')
                .delete()
                .eq('id', pacienteId);
        }
    });

    it('deve deletar uma consulta com sucesso', async () => {
        const response = await request(app)
            .delete(`/pacientes/consultas/${consultaId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Consulta deletada com sucesso');
    });

    it('deve retornar 404 ao tentar deletar consulta inexistente', async () => {
        const response = await request(app)
            .delete('/pacientes/consultas/999999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Consulta não encontrada');
    });

    it('deve retornar 400 se o ID for inválido', async () => {
        const response = await request(app)
            .delete('/pacientes/consultas/abc');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('ID inválido');
    });
});
