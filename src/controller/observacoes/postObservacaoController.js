import supabase from '../../database/database.js';

const postObservacoes = async (req, res) => {
    try {
        const { consultaId } = req.params;
        const { observacao } = req.body;

        if (!consultaId || isNaN(Number(consultaId))) {
            return res.status(400).json({
                error: 'ID da consulta inválido'
            });
        }

        if (!observacao || typeof observacao !== 'string') {
            return res.status(400).json({
                error: 'Observação é obrigatória'
            });
        }

        const { data: consulta, error: erroConsulta } = await supabase
            .from('consultas')
            .select('id')
            .eq('id', consultaId)
            .single();

        if (erroConsulta || !consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        const { data, error } = await supabase
            .from('observacoes')
            .insert([{
                observacao,
                consulta_id: consultaId
            }])
            .select()
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao criar observação'
            });
        }

        return res.status(201).json({
            message: 'Observação criada com sucesso',
            observacao: data
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
};

export default postObservacoes;
