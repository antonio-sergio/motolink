module.exports = (sequelize, DataTypes, Moto, Usuario) => {
    const Aluguel = sequelize.define("aluguel", {
        id: {
            type: DataTypes.INTEGER,
            field: 'id_aluguel', // aqui renomeamos o campo id para id_user
            primaryKey: true,
            autoIncrement: true
        },
        moto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Moto,
                key: 'id_moto'
            }
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'id_usuario'
            }
        },
        data_retirada: {
            type: DataTypes.DATE(),
            allowNull: false,
        },
        data_devolucao: {
            type: DataTypes.DATE(),
            allowNull: true,
        }
    }, {
        freezeTableName: true
    });
    return Aluguel;
};