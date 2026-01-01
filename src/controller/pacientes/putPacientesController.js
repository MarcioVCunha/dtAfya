import supabase from '../../database/database.js';

const putPacientes = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID inválido' });
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

        if (!nome || typeof nome !== 'string') {
            return res.status(400).json({ error: 'Nome inválido' });
        }

        if (!Number.isInteger(telefone) || (String(telefone).length !== 10 && String(telefone).length !== 11)) {
            return res.status(400).json({ error: 'Telefone inválido' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        if (!sexo || !['M', 'F'].includes(sexo)) {
            return res.status(400).json({ error: 'Sexo deve ser M ou F' });
        }

        if (typeof altura !== 'number') {
            return res.status(400).json({ error: 'Altura inválida' });
        }

        if (typeof peso !== 'number') {
            return res.status(400).json({ error: 'Peso inválido' });
        }

        if (!data_nascimento || data_nascimento.trim() === '') {
            return res.status(400).json({ error: 'Data de nascimento não pode estar vazia' });
        }

        const partes = data_nascimento.split('/');
        const dia = Number(partes[0]);
        const mes = Number(partes[1]);
        const ano = Number(partes[2]);

        const dataObj = new Date(ano, mes - 1, dia);
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (
            !regex.test(data_nascimento) ||
            dataObj.getFullYear() !== ano ||
            dataObj.getMonth() !== mes - 1 ||
            dataObj.getDate() !== dia
        ) {
            return res.status(400).json({ error: 'Data de nascimento inválida' });
        }

        const dataFormatada = `${ano}-${mes}-${dia}`

        const { data: paciente, error: erroBusca } = await supabase
            .from('pacientes')
            .select()
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
                data_nascimento: dataFormatada,
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

export default putPacientes;
