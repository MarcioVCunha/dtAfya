import supabase from '../database/database.js';

const cadastro = async (req, res) => {
    const data = req.body;

    if (
        !data.nome ||
        !data.telefone ||
        !data.email ||
        !data.data_nascimento ||
        !data.sexo ||
        data.altura === undefined ||
        data.peso === undefined
    ) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const { data: existente, error: erroBusca } = await supabase
        .from('clientes')
        .select('id')
        .or(
            `email.eq.${data.email},telefone.eq.${data.telefone}`
        )
        .limit(1);

    if (erroBusca) {
        console.error(erroBusca);
        return res.status(500).json({ error: 'Erro ao verificar duplicidade' });
    }

    if (existente.length > 0) {
        return res.status(409).json({
            error: 'Email ou telefone já cadastrado'
        });
    }

    const { data: result, error } = await supabase
        .from('clientes')
        .insert([
            {
                nome: data.nome,
                telefone: data.telefone,
                email: data.email,
                data_nascimento: data.data_nascimento,
                sexo: data.sexo,
                altura: data.altura,
                peso: data.peso,
            }
        ])
        .select();

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao inserir cliente' });
    }

    return res.status(201).json({
        message: 'Cliente cadastrado com sucesso',
        cliente: result[0]
    });
};

export default cadastro;
