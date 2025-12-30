import supabase from '../../database/database.js';

const getConsultas = async (req, res) => {
    const { data, error } = await supabase
        .from('consultas')
        .select()

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