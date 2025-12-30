import supabase from '../database/database.js';

const postConsulta = async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            error: 'Body da requisição inválido ou ausente'
        });
    }

    const data = req.body;

    if (
        !data.data ||
        !data.paciente_id
    ) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const { data: existente, error: erroBusca } = await supabase
        .from('consultas')
        .select('id')
        .or(
            `data.eq.${data.data}`
        )
        .limit(1);

    if (erroBusca) {
        console.error(erroBusca);
        return res.status(500).json({ error: 'Erro ao verificar duplicidade' });
    }

    if (existente.length > 0) {
        return res.status(409).json({
            error: 'Consulta já cadastrado para esta hora.'
        });
    }

    const { data: result, error } = await supabase
        .from('consultas')
        .insert([
            {
                data: data.data,
                paciente_id: data.paciente_id
            }
        ])
        .select();

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao inserir consulta' });
    }

    return res.status(201).json({
        message: 'Consulta cadastrada com sucesso',
        paciente: result[0]
    });

};


export { postConsulta }