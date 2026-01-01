import supabase from '../../database/database.js';

const getObservacoes = async (req, res) => {
    try {
        const { consultaId } = req.params;

        if (!consultaId || isNaN(Number(consultaId))) {
            return res.status(400).json({
                error: 'ID inválido'
            });
        }

        const { data: consulta, error: erroBusca } = await supabase
            .from('consultas')
            .select('id')
            .eq('id', consultaId)
            .single();

        if (erroBusca || !consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        const { data, error } = await supabase
            .from('observacoes')
            .select()
            .eq('consulta_id', consultaId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao buscar observações'
            });
        }

        return res.status(200).json({
            observacoes: data
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
};

export default getObservacoes;
