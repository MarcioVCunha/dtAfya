import supabase from '../../database/database.js';

const postConsultas = async (req, res) => {
    const { pacienteId } = req.params;
    const { data } = req.body;

    if (!pacienteId || isNaN(Number(pacienteId))) {
        return res.status(400).json({
            error: 'ID inválido'
        });
    }

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            error: 'Body da requisição inválido ou ausente'
        });
    }

    const partes = data.split('/');
    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    const dataObj = new Date(ano, mes - 1, dia);
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (
        !regex.test(data) ||
        dataObj.getFullYear() !== ano ||
        dataObj.getMonth() !== mes - 1 ||
        dataObj.getDate() !== dia
    ) {
        return res.status(400).json({ error: 'Data de nascimento inválida' });
    }

    const { data: paciente, error: pacienteError } = await supabase
        .from('pacientes')
        .select('id')
        .eq('id', pacienteId)
        .limit(1);

    if (pacienteError) {
        return res.status(500).json({ error: 'Erro ao buscar paciente' });
    }

    if (!paciente || paciente.length === 0) {
        return res.status(404).json({ error: 'ID não cadastrado no banco' });
    }

    const dataFormatada = `${ano}-${mes}-${dia}`

    const { data: existente, error: erroBusca } = await supabase
        .from('consultas')
        .select('id')
        .eq('data', dataFormatada)
        .limit(1);

    if (erroBusca) {
        return res.status(500).json({
            error: 'Erro ao verificar duplicidade'
        });
    }

    if (existente.length > 0) {
        return res.status(409).json({
            error: 'Consulta já cadastrada para esta data'
        });
    }

    const { data: result, error } = await supabase
        .from('consultas')
        .insert([{
            data: dataFormatada,
            paciente_id: pacienteId
        }])
        .select();

    if (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Erro ao inserir consulta'
        });
    }

    return res.status(201).json({
        message: 'Consulta cadastrada com sucesso',
        consulta: result[0]
    });
};

export default postConsultas;
