const moment = require('moment');
const { Op, fn, col } = require('sequelize');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment2 = MomentRange.extendMoment(Moment);


const { Usuario, Modelo, Moto, Aluguel } = require("./models")
const bcrypt = require('bcryptjs');

exports.criarUsuario = async (req, res) => {
    try {
        const { nome, email, cpf, nmr_cnh, senha, telefone } = req.body;

        const usuarioAntigo = await Usuario.findOne({
            where: {
                [Op.or]: [{ email }, { cpf }, { nmr_cnh }]
            }
        });
        if (usuarioAntigo) {
            return res.status(409).json({ message: "Já existe um usuário cadastrado com esse email, cpf ou número de cnh." });
        }

        encryptedPassword = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome: nome,
            email: email.toLowerCase(),
            telefone: telefone,
            nmr_cnh: nmr_cnh,
            cpf: cpf,
            senha: encryptedPassword,

        });

        return res.status(201).json(usuario);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

exports.criarModelo = async (req, res) => {
    try {
        const { nome, marca, imagem, cilindrada, diaria } = req.body;

        const modeloAntigo = await Modelo.findOne({
            where: { marca: marca, nome: nome }
        });

        if (modeloAntigo) {
            return res.status(409).json({ message: "Já existe um modelo registrado com essas informações." });
        }


        const modelo = await Modelo.create({
            nome: nome,
            marca: marca,
            imagem: imagem,
            cilindrada: cilindrada,
            diaria: diaria,
        });

        return res.status(201).json(modelo);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};


exports.criarMoto = async (req, res) => {
    try {
        const { modelo_id, chassi, cor, placa } = req.body;

        const oldMoto = await Moto.findOne({
            where: {
                chassi: chassi
            }
        })

        if (oldMoto) {
            return res.status(409).json({ message: "Já existe uma moto  com os dados informados." });
        }
        const moto = await Moto.create({
            modelo_id: modelo_id,
            chassi: chassi,
            cor: cor,
            placa: placa,
            Modelo: { // adiciona o endereço como um objeto aninhado
                id: modelo_id
            }
        }, {
            include: {
                model: Modelo,
                as: 'modelo',
            },
        });

        return res.status(201).json(moto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

exports.criarAluguel = async (req, res) => {
    try {
        const { moto_id, usuario_id, data_retirada, data_devolucao } = req.body;

        const moto = await Moto.findByPk(moto_id);
        const usuario = await Usuario.findByPk(usuario_id);

        if (!moto || !usuario) {
            return res.status(404).json({ message: 'Moto ou usuário não encontrado' });
        }

        const diasAluguel = moment(data_devolucao).diff(moment(data_retirada), 'days');

        if (diasAluguel <= 0) {
            return res.status(400).json({ message: 'Data de devolução deve ser posterior à data de retirada' });
        }
        const modelo_id = moto.dataValues.modelo_id;
        const modelo = await Modelo.findByPk(modelo_id);
        if (!modelo) {
            return res.status(400).json({ message: 'Modelo moto não encontrado' });
        }
        const dataRetiradaComHoras = moment(data_retirada).add(3, 'hours').toDate();
        const dataDevolucaoComHoras = moment(data_devolucao).add(3, 'hours').toDate();


        const range = moment2.range(moment2(dataRetiradaComHoras), moment2(dataDevolucaoComHoras));
        const datas = Array.from(range.by('days')).map((date) => date.toDate());


        const valorAluguel = diasAluguel * modelo.dataValues.diaria;

        const aluguel = await Aluguel.create({
            moto_id,
            usuario_id,
            modelo_id,
            data_retirada: dataRetiradaComHoras,
            data_devolucao: dataDevolucaoComHoras,
            valor: valorAluguel,
            datas,
        }, {
            include: [
                {
                    model: Moto,
                    as: 'moto',
                },
                {
                    model: Usuario,
                    as: 'usuario',
                },
                {
                    model: Modelo,
                    as: 'modelo',
                },
            ],
        });

        return res.status(201).json(aluguel);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

exports.findAllMotos = async (req, res) => {
    try {
        let motos = await Moto.findAll({
            include: [
                {
                    model: Modelo,
                    as: 'modelo',
                    attributes: ['id', 'nome', 'marca']
                },

            ],
            order: [['id_moto', 'DESC']],
        });

        return res.status(200).json(motos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}



exports.findAllMotosDisponiveis = async (req, res) => {
    try {
        const { data_retirada, data_devolucao, modelo_id } = req.query;

        // Converter as strings de datas para objetos Date
        const dataRetiradaObj = new Date(`${data_retirada}T00:00:00.000Z`);
        const dataDevolucaoObj = new Date(`${data_devolucao}T23:59:59.999Z`);

        // Ajustar para UTC-3
        dataDevolucaoObj.setUTCHours(dataDevolucaoObj.getUTCHours() - 1);

        // Obter os alugueis que estão no intervalo
        let alugueis = await Aluguel.findAll({
            where: {
                modelo_id: modelo_id,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { data_retirada: { [Op.gte]: dataRetiradaObj } },
                            { data_retirada: { [Op.lte]: dataDevolucaoObj } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { data_devolucao: { [Op.gte]: dataRetiradaObj } },
                            { data_devolucao: { [Op.lte]: dataDevolucaoObj } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { data_retirada: { [Op.lte]: dataRetiradaObj } },
                            { data_devolucao: { [Op.gte]: dataDevolucaoObj } }
                        ]
                    },
                ]
            }
        });

        // Obter todas as motos
        let motos = await Moto.findAll({
            where: {
                modelo_id: modelo_id,
            },
            include: [
                {
                    model: Modelo,
                    as: 'modelo',
                    attributes: ['id', 'nome', 'marca']
                },
            ],
            order: [['id_moto', 'DESC']],
        });

        // Filtrar as motos disponíveis
        let motosDisponiveis = motos.filter(moto => {
            return !alugueis.some(aluguel => {
                const dataRetiradaAluguel = moment(aluguel.data_retirada).utcOffset(-3);
                const dataDevolucaoAluguel = moment(aluguel.data_devolucao).utcOffset(-3);

                return aluguel.moto_id === moto.id &&
                    (
                        dataRetiradaAluguel.isSameOrAfter(dataRetiradaObj) && dataRetiradaAluguel.isSameOrBefore(dataDevolucaoObj) ||
                        dataDevolucaoAluguel.isSameOrAfter(dataRetiradaObj) && dataDevolucaoAluguel.isSameOrBefore(dataDevolucaoObj) ||
                        dataRetiradaAluguel.isSameOrBefore(dataRetiradaObj) && dataDevolucaoAluguel.isSameOrAfter(dataDevolucaoObj)
                    );
            });
        });

        return res.status(200).json({ motos: motosDisponiveis });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

exports.findAllMotosByModelo = async (req, res) => {
    try {
        const modelo = req.params.modelo;

        let motos = await Moto.findAll({
            where: {
                modelo_id: modelo
            },
            include: [
                {
                    model: Modelo,
                    as: 'modelo',
                    attributes: ['id', 'nome', 'marca', 'imagem', 'cilindrada', 'diaria']
                },

            ],
            order: [['id_moto', 'DESC']],
        });

        return res.status(200).json(motos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}
exports.findAllModelos = async (req, res) => {
    try {
        let motos = await Modelo.findAll();

        return res.status(200).json(motos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}

exports.findAllAlugueis = async (req, res) => {

    try {
        let alugueis = await Aluguel.findAll({
            include: [
                {
                    model: Moto,
                    as: 'moto',
                },
                {
                    model: Usuario,
                    as: 'usuario',
                },
                {
                    model: Modelo,
                    as: 'modelo',
                }

            ],
            order: [['id_aluguel', 'DESC']],
        });

        return res.status(200).json(alugueis);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}

exports.findAllUsuarios = async (req, res) => {

    try {
        let usuarios = await Usuario.findAll({
            order: [['id_usuario', 'DESC']],
        });

        return res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}

exports.findAllAlugueisByUsuario = async (req, res) => {
    const id = req.params.id;

    try {
        let alugueis = await Aluguel.findAll({
            where: {
                usuario_id: id
            },
            include: [
                {
                    model: Moto,
                    as: 'moto',
                },
                {
                    model: Usuario,
                    as: 'usuario',
                },
                {
                    model: Modelo,
                    as: 'modelo',
                }

            ],
            order: [['id_aluguel', 'DESC']],
        });

        return res.status(200).json(alugueis);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, senha } = await req.body;

        // Validate user input
        if (!(email && senha)) {
            return res.status(400).json({ message: "Por favor informe os campos 'email' e 'senha'" });
        }

        // Validate if user exists in our database
        const usuario = await Usuario.findOne({ where: { email: email } });

        // Check if user does not exist or if the password is incorrect
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        const payload = {
            id: usuario.dataValues.id,
            nome: usuario.nome,
            acesso: usuario.acesso,
            email: usuario.email,
            cnh: usuario.nmr_cnh
        };

        // User authenticated
        return res.status(200).json(payload);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};


exports.editarModelo = async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
        let modelo = await Modelo.findOne({ where: { id_modelo: id } });
        if (!modelo) {
            return res.status(404).json({ message: "Modelo não encontrado para o id informado." });
        }
        await modelo.update(updatedFields);
        res.status(200).json(modelo);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}
exports.editarMoto = async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
        let moto = await Moto.findOne({ where: { id_moto: id } });
        if (!moto) {
            return res.status(404).json({ message: "Moto não encontrado para o id informado." });
        }
        await moto.update(updatedFields);
        res.status(200).json(moto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}

exports.editarAluguel = async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
        let aluguel = await Aluguel.findOne({ where: { id_aluguel: id } });
        if (!aluguel) {
            return res.status(404).json({ message: "Aluguel não encontrado para o id informado." });
        }
        await aluguel.update(updatedFields);
        res.status(200).json(aluguel);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}