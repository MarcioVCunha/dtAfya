import supabase from '../../database/database.js';

const putPacientes = async (req, res) => {
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
            nome,
            telefone,
            email,
            data_nascimento,
            sexo,
            altura,
            peso
        } = req.body;

        if (
            !nome ||
            !telefone ||
            !email ||
            !data_nascimento ||
            !sexo ||
            altura === undefined ||
            peso === undefined
        ) {
            return res.status(400).json({
                error: 'Campos obrigatórios não preenchidos'
            });
        }

        const { data: paciente, error: erroBusca } = await supabase
            .from('pacientes')
            .select('*')
            .eq('id', id)
            .single();

        if (erroBusca || !paciente) {
            return res.status(404).json({
                error: 'Paciente não encontrado'
            });
        }

        const { data: duplicado, error: erroDuplicado } = await supabase
            .from('pacientes')
            .select('id')
            .or(`email.eq.${email},telefone.eq.${telefone}`)
            .neq('id', id)
            .limit(1);

        if (erroDuplicado) {
            console.error(erroDuplicado);
            return res.status(500).json({
                error: 'Erro ao verificar duplicidade'
            });
        }

        if (duplicado.length > 0) {
            return res.status(409).json({
                error: 'Email ou telefone já cadastrado em outro paciente'
            });
        }

        const { data: atualizado, error } = await supabase
            .from('pacientes')
            .update({
                nome,
                telefone,
                email,
                data_nascimento,
                sexo,
                altura,
                peso
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao atualizar paciente'
            });
        }

        return res.status(200).json({
            message: 'Paciente atualizado com sucesso',
            paciente: atualizado[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
};

export default putPacientes