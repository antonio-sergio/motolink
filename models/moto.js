module.exports = (sequelize, DataTypes, Modelo) => {
    const Moto = sequelize.define("moto", {
        id: {
            type: DataTypes.INTEGER,
            field: 'id_moto', // aqui renomeamos o campo id para id_user
            primaryKey: true,
            autoIncrement: true
        },
        modelo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Modelo,
                key: 'id_modelo'
            }
        },
        chassi: {
            type: DataTypes.STRING(),
            allowNull: false,
            unique: true
        },
        placa: {
            type: DataTypes.STRING(),
            allowNull: false,
            unique: true
        },
        cor: {
            type: DataTypes.STRING(),
            allowNull: false,
        }
        
    }, {
        freezeTableName: true
    });
    return Moto;
};