// tests/consulta.test.js
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('POST /consultas', () => {
    let pacienteId;
    const consultaValida = { data: '12-28-2025' };

    beforeAll(async () => {
        const paciente = {
            nome: 'Paciente Teste',
            telefone: 11999999996,
            email: 'consulta@post.com',
            data_nascimento: '01-01-1990',
            sexo: 'M',
            altura: 1.75,
            peso: 75
        };

        const { data, error } = await supabase
            .from('pacientes')
            .insert([paciente])
            .select();

        if (error) throw error;

        pacienteId = data[0].id;
        consultaValida.paciente_id = pacienteId;
    });

    beforeEach(async () => {
        await supabase
            .from('consultas')
            .delete()
            .or(
                `data.eq.${consultaValida.data},paciente_id.eq.${pacienteId}`
            );
    });

    it('deve cadastrar uma consulta com sucesso', async () => {
        const response = await request(app)
            .post('/consultas')
            .send(consultaValida);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Consulta cadastrada com sucesso');
        expect(response.body.paciente).toHaveProperty('paciente_id', pacienteId);
    });

    it('não deve cadastrar consulta duplicada na mesma data', async () => {
        await request(app).post('/consultas').send(consultaValida);

        const response = await request(app)
            .post('/consultas')
            .send(consultaValida);

        expect(response.status).toBe(409);
        expect(response.body.error).toMatch(/consulta/i);
    });

    it('deve retornar 400 se faltar campo obrigatório', async () => {
        const response = await request(app)
            .post('/consultas')
            .send({ data: '12-28-2025' });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/obrigatórios/i);
    });

    it('deve retornar 400 se body estiver ausente ou inválido', async () => {
        const response = await request(app)
            .post('/consultas')
            .send(null);

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/body/i);
    });

    afterAll(async () => {
        await supabase
            .from('consultas')
            .delete()
            .or(`paciente_id.eq.${pacienteId}`);

        await supabase
            .from('pacientes')
            .delete()
            .eq('id', pacienteId);
    });
});
