import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import supabase from '../../src/database/database.js';

describe('GET /pacientes', () => {
    let pacientesCriados = [];

    afterEach(async () => {
        if (pacientesCriados.length > 0) {
            await supabase
                .from('pacientes')
                .delete()
                .in('id', pacientesCriados);

            pacientesCriados = [];
        }
    });

    it('deve retornar pacientes cadastrados', async () => {
        const paciente = {
            nome: 'Teste',
            telefone: 11999999999,
            email: 'paciente@get.com',
            data_nascimento: '1990-01-01',
            sexo: 'M',
            altura: 1.75,
            peso: 70
        };
        
        const { data } = await supabase
            .from('pacientes')
                .insert([paciente])
                .select();
        pacientesCriados.push(data[0].id); 

        const res = await request(app).get('/pacientes');
        expect(res.status).toBe(201);
        expect(Array.isArray(res.body.pacientes)).toBe(true);
        expect(res.body.pacientes.length).toBeGreaterThan(0);
    });
});
