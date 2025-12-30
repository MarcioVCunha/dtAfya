import supabase from '../../database/database.js';

const putConsultas = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                error: 'ID inválido'
            });
        }

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                error: 'Body da requisição inválido ou ausente'
            });
        }

        const {
            paciente_id,
            data
        } = req.body;

        if (!paciente_id || !data) {
            return res.status(400).json({
                error: 'Campos obrigatórios não preenchidos'
            });
        }

        const { data: consulta, error: erroBusca } = await supabase
            .from('consultas')
            .select()
            .eq('id', id)
            .single();

        if (erroBusca || !consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        const { data: atualizado, error } = await supabase
            .from('consultas')
            .update({
                paciente_id,
                data
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao atualizar consulta'
            });
        }

        return res.status(200).json({
            message: 'Consulta atualizada com sucesso',
            consulta: atualizado[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
};

export default putConsultas;
