module.exports = (sequelize, DataTypes, Moto, Usuario, Modelo) => {
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
        modelo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Modelo,
                key: 'id_modelo'
            }
        },
        data_retirada: {
            type: DataTypes.DATE(),
            allowNull: false,
        },
        data_devolucao: {
            type: DataTypes.DATE(),
            allowNull: true,
        },
        devolvido: {
            type: DataTypes.BOOLEAN(),
            defaultValue: false,
        },
        datas: {
            type: DataTypes.ARRAY(DataTypes.DATE),
            allowNull: true, // 
        },
        valor: {
            type: DataTypes.DECIMAL(10, 2),
        }
    }, {
        freezeTableName: true
    });
    return Aluguel;
};