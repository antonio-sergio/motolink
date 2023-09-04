module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define("usuario", {
        id: {
            type: DataTypes.INTEGER,
            field: 'id_usuario', // aqui renomeamos o campo id para id_user
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(),
            allowNull: false,
            unique: true
        },
        nmr_cnh: {
            type: DataTypes.STRING(),
            allowNull: false,
            unique: true
        },
        telefone: {
            type: DataTypes.STRING(11),
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        acesso: {
            type: DataTypes.ENUM('cliente', 'admin'),
            defaultValue: 'cliente' 
        },
    }, {
        freezeTableName: true
    }, {});
    return Usuario;
};