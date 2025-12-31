import supabase from '../../database/database.js';

const putObservacoes = async (req, res) => {
    try {
        const { id } = req.params;
        const { observacao } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                error: 'ID inválido'
            });
        }

        if (!observacao || typeof observacao !== 'string') {
            return res.status(400).json({
                error: 'Observação é obrigatória'
            });
        }

        const { data: existente, error: erroBusca } = await supabase
            .from('observacoes')
            .select('id')
            .eq('id', id)
            .single();

        if (erroBusca || !existente) {
            return res.status(404).json({
                error: 'Observação não encontrada'
            });
        }

        const { data, error } = await supabase
            .from('observacoes')
            .update({ observacao })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao atualizar observação'
            });
        }

        return res.status(200).json({
            message: 'Observação atualizada com sucesso',
            observacao: data
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
};

export default putObservacoes;
