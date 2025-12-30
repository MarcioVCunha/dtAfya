import supabase from '../../database/database.js';

const getPacientes = async (req, res) => {
    const { data, error } = await supabase
        .from('pacientes')
        .select()

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }

    return res.status(201).json({
        message: 'Pacientes retornados com sucesso',
        pacientes: data
    });
};

export default getPacientes