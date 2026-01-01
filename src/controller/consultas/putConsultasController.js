import supabase from '../../database/database.js';

const putConsultas = async (req, res) => {
    try {
        const { pacienteId, consultaId } = req.params;

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                error: 'Body da requisição inválido ou ausente'
            });
        }

        const {
            data
        } = req.body;

        if (!consultaId || isNaN(Number(consultaId))) {
            return res.status(400).json({
                error: 'Consulta ID inválido'
            });
        }

        if (!pacienteId || isNaN(Number(pacienteId))) {
            return res.status(400).json({
                error: 'Paciente ID inválido'
            });
        }

        if (!pacienteId || !data) {
            return res.status(400).json({
                error: 'Campos obrigatórios não preenchidos'
            });
        }

        if (typeof data !== 'string') {
            return res.status(400).json({ error: 'Data inválida' });
        }

        const partes = data.split('/');

        if (partes.length !== 3) {
            return res.status(400).json({ error: 'Data inválida' });
        }

        const [dia, mes, ano] = partes.map(Number);

        const dataObj = new Date(ano, mes - 1, dia);

        if (
            isNaN(dataObj.getTime()) ||
            dataObj.getDate() !== dia ||
            dataObj.getMonth() !== mes - 1 ||
            dataObj.getFullYear() !== ano
        ) {
            return res.status(400).json({ error: 'Data inválida' });
        }

        const dataFormatada = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        const { data: consulta, error: erroBusca } = await supabase
            .from('consultas')
            .select()
            .eq('id', consultaId)
            .single();

        if (erroBusca || !consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        const { data: atualizado, error } = await supabase
            .from('consultas')
            .update({
                paciente_id: pacienteId,
                data: dataFormatada
            })
            .eq('id', consultaId)
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
