import supabase from '../../database/database.js';

const deleteConsultas = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                error: 'ID inválido'
            });
        }

        const { data: consulta, error: erroBusca } = await supabase
            .from('consultas')
            .select('id')
            .eq('id', id)
            .single();

        if (erroBusca || !consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        const { error } = await supabase
            .from('consultas')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao deletar consulta'
            });
        }

        return res.status(200).json({
            message: 'Consulta deletada com sucesso'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
};

export default deleteConsultas;
