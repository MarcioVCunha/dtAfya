import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import supabase from '../src/database/database.js';

describe('POST /cadastro', () => {

    const clienteValido = {
        nome: 'Cliente Teste',
        telefone: 11999999999,
        email: 'teste@email.com',
        data_nascimento: '1990-01-01',
        sexo: 'M',
        altura: 1.75,
        peso: 75
    };

    beforeEach(async () => {
        await supabase
            .from('clientes')
            .delete()
            .or(
                `email.eq.${clienteValido.email},telefone.eq.${clienteValido.telefone}`
            );
    });

    it('deve cadastrar um cliente com sucesso', async () => {
        const response = await request(app)
            .post('/cadastro')
            .send(clienteValido);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('cliente');
        expect(response.body.cliente.email).toBe(clienteValido.email);
    });

    it('não deve cadastrar cliente com email duplicado', async () => {
        await request(app)
            .post('/cadastro')
            .send(clienteValido);

        const response = await request(app)
            .post('/cadastro')
            .send({
                ...clienteValido,
                telefone: 11888888888
            });

        expect(response.status).toBe(409);
        expect(response.body.error).toMatch(/email/i);
    });

    it('não deve cadastrar cliente com telefone duplicado', async () => {
        await request(app)
            .post('/cadastro')
            .send(clienteValido);

        const response = await request(app)
            .post('/cadastro')
            .send({
                ...clienteValido,
                email: 'outro@email.com'
            });

        expect(response.status).toBe(409);
        expect(response.body.error).toMatch(/telefone/i);
    });

    it('deve retornar 400 se faltar campo obrigatório', async () => {
        const response = await request(app)
            .post('/cadastro')
            .send({
                nome: 'Teste'
            });

        expect(response.status).toBe(400);
    });

});
