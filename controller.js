const { Op } = require('sequelize');
const { Usuario, Modelo, Moto } = require("./models")
const bcrypt = require('bcryptjs');

exports.criarUsuario = async (req, res) => {
    try {
        const {nome,  email, cpf, nmr_cnh, senha, telefone } = req.body;
        
        const usuarioAntigo = await Usuario.findOne({
            where: {
                [Op.or]: [{ email }, { cpf }, {nmr_cnh}]
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
        const {nome,  marca, imagem, cilindrada, diaria, cor } = req.body;
        
        const modeloAntigo = await Modelo.findOne({
            where: { marca: marca, nome: nome }
        });

        if (modeloAntigo) {
            return res.status(409).json({ message: "Já existe um modelo registrado com essas informações." });
        }
        

        const modelo = await Modelo.create({
            nome: nome,
            marca: marca,
            cor: cor,
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
        const { modelo_id, chassi, km, alugado } = req.body;
       

        const moto = await Moto.create({
            modelo_id: modelo_id,
            chassi: chassi,
            km: km,
            alugado: alugado,
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