import supabase from '../../database/database.js';

const getConsultas = async (req, res) => {
    const { pacienteId } = req.params;

    if (!pacienteId || isNaN(Number(pacienteId))) {
        return res.status(400).json({
            error: 'ID inválido'
        });
    }

    const { data, error } = await supabase
        .from('consultas')
        .select()
        .eq('paciente_id', pacienteId)

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar consultas' });
    }

    return res.status(201).json({
        message: 'Consultas retornados com sucesso',
        consultas: data
    });
};

export default getConsultas